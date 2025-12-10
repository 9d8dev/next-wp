// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  WPPost,
  Category,
  Tag,
  WPPage,
  Author,
  WPMedia,
  WordPressResponse,
  WordPressQuery,
  CacheTag,
  Post,
  Media,
  Page,
} from "./wordpress.d";
import { extractExcerptText } from "./utils";

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

if (!baseUrl) {
  throw new Error(
    "NEXT_PUBLIC_WORDPRESS_URL environment variable is not defined"
  );
}

export class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

const wordpressFetch = <T>(
  path: string,
  query?: WordPressQuery<T>,
  cacheTags: CacheTag[] = []
) =>
  wordpressFetchWithPagination<T>(path, query, cacheTags).then(
    ({ data }) => data
  );

async function wordpressFetchWithPagination<T>(
  path: string,
  query?: WordPressQuery<T>,
  cacheTags: CacheTag[] = []
): Promise<WordPressResponse<T>> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query, { arrayFormat: "comma" })}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress", ...cacheTags],
      revalidate: 86400, // 1 day cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

async function wordpressFetchAll<T>(
  path: string,
  queryParams?: WordPressQuery<T>,
  cacheTags: CacheTag[] = []
): Promise<T[]> {
  const getPage = (page: number) =>
    wordpressFetchWithPagination<T[]>(
      path,
      <WordPressQuery<T[]>>{
        ...queryParams,
        per_page: 100,
        page,
      },
      cacheTags
    );

  const { headers, data } = await getPage(1);

  if (headers.totalPages > 1) {
    const promiseArray: Promise<T[]>[] = [];

    for (let i = 2; i <= headers.totalPages; i++) {
      promiseArray.push(getPage(i).then((response) => response.data));
    }

    return data.concat(...(await Promise.all(promiseArray)));
  }

  return data;
}

const transformMedia = (wpMedia: WPMedia): Media => ({
  id: wpMedia.id,
  date: new Date(wpMedia.date),
  modified: new Date(wpMedia.date),
  slug: wpMedia.slug,
  status: wpMedia.status,
  link: wpMedia.link,
  guid: wpMedia.guid?.rendered,
  title: wpMedia.title?.rendered,
  caption: wpMedia.caption?.rendered,
  altText: wpMedia.alt_text,
  mediaType: wpMedia.media_type,
  mimeType: wpMedia.mime_type,
  mediaDetails: wpMedia.media_details,
  sourceUrl: wpMedia.source_url,
  authorID: wpMedia.author,
});

function transformPost(wpPost: WPPost): Post {
  if (!wpPost._embedded) {
    throw Error("Can't transform WPPost without embedded data");
  }

  let categories: Category[] = [],
    tags: Tag[] = [];

  if (wpPost._embedded["wp:term"]) {
    for (let terms of wpPost._embedded["wp:term"]) {
      if (!terms.length) continue;
      switch (terms[0].taxonomy) {
        case "category":
          categories = terms as Category[];
          break;
        case "post_tag":
          tags = terms as Tag[];
        default:
          break;
      }
    }
  }

  return {
    id: wpPost.id,
    date: new Date(wpPost.date),
    modified: new Date(wpPost.modified),
    slug: wpPost.slug,
    status: wpPost.status,
    link: wpPost.link,
    guid: wpPost.guid?.rendered,
    title: wpPost.title.rendered,
    content: wpPost.content?.rendered,
    excerpt: extractExcerptText(wpPost.excerpt?.rendered),
    type: wpPost.type,
    sticky: wpPost.sticky,
    template: wpPost.template,
    format: wpPost.format,
    meta: wpPost.meta,
    author:
      wpPost._embedded["author"][0]?.id !== undefined
        ? wpPost._embedded["author"][0]
        : undefined,
    featuredMedia:
      wpPost._embedded["wp:featuredmedia"] &&
      transformMedia(wpPost._embedded["wp:featuredmedia"][0]),
    categories,
    tags,
  };
}

function transformPage(wpPage: WPPage): Page {
  if (!wpPage._embedded) {
    throw Error("Can't transform WPPage without embedded data");
  }

  return {
    id: wpPage.id,
    date: new Date(wpPage.date),
    modified: new Date(wpPage.modified),
    slug: wpPage.slug,
    status: wpPage.status,
    link: wpPage.link,
    guid: wpPage.guid.rendered,
    title: wpPage.title.rendered,
    content: wpPage.content?.rendered,
    excerpt: extractExcerptText(wpPage.excerpt?.rendered),
    parent: wpPage.parent,
    menuOrder: wpPage.menu_order,
    template: wpPage.template,
    meta: wpPage.meta,
    author:
      wpPage._embedded["author"][0]?.id !== undefined
        ? wpPage._embedded["author"][0]
        : undefined,
    featuredMedia:
      wpPage._embedded["wp:featuredmedia"] &&
      transformMedia(wpPage._embedded["wp:featuredmedia"][0]),
  };
}

const postFields: Array<keyof WPPost> = [
  "id",
  "date",
  "date_gmt",
  "modified",
  "modified_gmt",
  "slug",
  "status",
  "link",
  "guid",
  "title",
  "content",
  "excerpt",
  "author",
  "featured_media",
  "comment_status",
  "ping_status",
  "sticky",
  "template",
  "format",
  "categories",
  "tags",
  "meta",
  "author_meta",
  "featured_img",
  "featured_img_caption",
  "_links",
  "_embedded",
];

const postCardFields: Array<keyof WPPost> = [
  "id",
  "date",
  "slug",
  "title",
  "excerpt",
  "author",
  "featured_media",
  "categories",
  "tags",
  "_links",
  "_embedded",
];

export type CardPost = Pick<
  Post,
  | "id"
  | "date"
  | "slug"
  | "title"
  | "excerpt"
  | "author"
  | "featuredMedia"
  | "categories"
  | "tags"
>;

// New function for paginated posts
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: WordPressQuery<WPPost>
): Promise<WordPressResponse<CardPost[]>> {
  const query: WordPressQuery<WPPost> = {
    _fields: postCardFields,
    context: "embed",
    ...filterParams,
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags: CacheTag[] = ["posts"];

  if (filterParams?.author) {
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tags) {
    cacheTags.push(`posts-tag-${filterParams.tags}`);
  }
  if (filterParams?.categories) {
    cacheTags.push(`posts-category-${filterParams.categories}`);
  }

  const response = await wordpressFetchWithPagination<WPPost[]>(
    "/wp-json/wp/v2/posts",
    query,
    cacheTags
  );

  return {
    headers: response.headers,
    data: response.data.map(transformPost),
  };
}

export const getAllPosts = (queryParams: WordPressQuery<WPPost>) =>
  wordpressFetchAll<WPPost>(
    "/wp-json/wp/v2/posts",
    {
      _fields: postFields,
      ...queryParams,
    },
    ["posts"]
  );

export const getPostById = (id: number) =>
  wordpressFetch<WPPost>(
    `/wp-json/wp/v2/posts/${id}`,
    {
      _embed: true,
      _fields: postFields,
    },
    [`post-${id}`]
  ).then(transformPost);

export const getPostBySlug = (slug: string) =>
  wordpressFetch<WPPost[]>(
    "/wp-json/wp/v2/posts",
    {
      slug,
      _embed: true,
      _fields: postFields,
    },
    [`post-${slug}`]
  ).then((posts) => transformPost(posts[0]));

const categoryFields: Array<keyof Category> = [
  "id",
  "count",
  "description",
  "link",
  "name",
  "slug",
  "taxonomy",
  "parent",
];

export const getAllCategories = (queryParams?: WordPressQuery<Category>) =>
  wordpressFetchAll<Category>(
    "/wp-json/wp/v2/categories",
    {
      hide_empty: true,
      _fields: categoryFields,
      ...queryParams,
    },
    ["categories"]
  );

export const getCategoryById = (id: number) =>
  wordpressFetch<Category>(
    `/wp-json/wp/v2/categories/${id}`,
    { _fields: categoryFields },
    [`category-${id}`]
  );

export const getCategoryBySlug = (slug: string) =>
  wordpressFetch<Category[]>(
    "/wp-json/wp/v2/categories",
    { slug, _fields: categoryFields },
    ["categories"]
  ).then((categories) => categories[0]);

const tagFields: Array<keyof Tag> = [
  "id",
  "count",
  "description",
  "link",
  "name",
  "slug",
  "taxonomy",
];

export const getAllTags = (queryParams?: WordPressQuery<Tag>) =>
  wordpressFetchAll<Tag>(
    "/wp-json/wp/v2/tags",
    {
      hide_empty: true,
      _fields: tagFields,
      ...queryParams,
    },
    ["tags"]
  );

export const getTagById = (id: number) =>
  wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`, { _fields: tagFields }, [
    `tag-${id}`,
  ]);

export const getTagBySlug = (slug: string) =>
  wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug, _fields: tagFields }, [
    "tags",
  ]).then((tags) => tags[0]);

const pageFields: Array<keyof WPPage> = [
  "id",
  "date",
  "date_gmt",
  "modified",
  "modified_gmt",
  "slug",
  "status",
  "link",
  "guid",
  "title",
  "content",
  "excerpt",
  "author",
  "featured_media",
  "parent",
  "menu_order",
  "comment_status",
  "ping_status",
  "template",
  "meta",
  "_links",
  "_embedded",
];

export const getAllPages = (queryParams: WordPressQuery<WPPage>) =>
  wordpressFetchAll<WPPage>(
    "/wp-json/wp/v2/pages",
    {
      _fields: pageFields,
      ...queryParams,
    },
    ["pages"]
  );

export const getPageById = (id: number) =>
  wordpressFetch<WPPage>(
    `/wp-json/wp/v2/pages/${id}`,
    {
      _embed: true,
      _fields: pageFields,
    },
    [`page-${id}`]
  ).then(transformPage);

export const getPageBySlug = (slug: string) =>
  wordpressFetch<WPPage[]>(
    "/wp-json/wp/v2/pages",
    {
      _embed: true,
      _fields: pageFields,
      slug,
    },
    [`page-${slug}`]
  ).then((pages) => transformPage(pages[0]));

const authorFields: Array<keyof Author> = [
  "id",
  "name",
  "url",
  "description",
  "link",
  "slug",
  "avatar_urls",
];

export const getAllAuthors = (queryParams?: WordPressQuery<Author>) =>
  wordpressFetchAll<Author>(
    "/wp-json/wp/v2/users",
    {
      has_published_posts: true,
      _fields: authorFields,
      ...queryParams,
    },
    ["authors"]
  );

export const getAuthorById = (id: number) =>
  wordpressFetch<Author>(
    `/wp-json/wp/v2/users/${id}`,
    { _fields: authorFields },
    [`author-${id}`]
  );

export const getAuthorBySlug = (slug: string) =>
  wordpressFetch<Author[]>(
    "/wp-json/wp/v2/users",
    { slug, _fields: authorFields },
    ["authors"]
  ).then((users) => users[0]);

const mediaFields: Array<keyof WPMedia> = [
  "id",
  "date",
  "date_gmt",
  "modified",
  "modified_gmt",
  "slug",
  "status",
  "link",
  "guid",
  "title",
  "author",
  "caption",
  "alt_text",
  "media_type",
  "mime_type",
  "media_details",
  "source_url",
];

export const getMediaById = (id: number) =>
  wordpressFetch<WPMedia>(
    `/wp-json/wp/v2/media/${id}`,
    {
      _fields: mediaFields,
    },
    ["media", `media-${id}`]
  ).then(transformMedia);

// Function specifically for generateStaticParams - fetches ALL post slugs
export const getAllPostSlugs = () => getAllPosts({ _fields: ["slug"] });
