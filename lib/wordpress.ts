// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  Media,
  WordPressResponse,
  WordPressQuery,
} from "./wordpress.d";

const baseUrl = process.env.NEXT_WORDPRESS_URL;

if (!baseUrl) {
  throw new Error("NEXT_WORDPRESS_URL environment variable is not defined");
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// Keep original function for backward compatibility
async function wordpressFetch<T>(
  path: string,
  query?: WordPressQuery<T>
): Promise<T> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query, { arrayFormat: "comma" })}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// New function for paginated requests
async function wordpressFetchWithPagination<T>(
  path: string,
  query?: WordPressQuery<T>
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
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
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

function createGetAll<T>(
  path: string,
  queryParams?: WordPressQuery<T>
): (query?: WordPressQuery<T>) => Promise<T[]> {
  return async (query?: WordPressQuery<T>) => {
    const getPage = (page: number) => wordpressFetchWithPagination<T[]>(
      path,
      <WordPressQuery<T[]>> {
        ...queryParams,
        ...query,
        per_page: 100,
        page,
      }
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
}

const postFields: Array<keyof Post> = [ 
  "id", "date", "date_gmt", "modified", "modified_gmt", "slug", "status", "link", 
  "guid", "title", "content", "excerpt", "author", "featured_media", "comment_status", 
  "ping_status", "sticky", "template", "format", "categories", "tags", "meta",
  "author_meta", "featured_img", "featured_img_caption",
];

const postFieldsWithEmbed: Array<keyof Post> = [...postFields, "_links", "_embedded"];

// New function for paginated posts
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: WordPressQuery<Post>,
): Promise<WordPressResponse<Post[]>> {
  const query: WordPressQuery<Post> = {
    _fields: postFieldsWithEmbed,
    ...filterParams,
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", "posts"];

  if (filterParams?.search) {
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tags) {
    cacheTags.push(`posts-tag-${filterParams.tags}`);
  }
  if (filterParams?.categories) {
    cacheTags.push(`posts-category-${filterParams.categories}`);
  }

  // Add page-specific cache tag for granular invalidation
  cacheTags.push(`posts-page-${page}`);

  const url = `${baseUrl}/wp-json/wp/v2/posts${
    query ? `?${querystring.stringify(query , { arrayFormat: "comma" })}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: cacheTags,
      revalidate: 3600, // 1 hour cache
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

export const getAllPosts = createGetAll<Post>("/wp-json/wp/v2/posts", {
  _fields: postFields,
})

export async function getPostById(id: number): Promise<Post> {
  return wordpressFetch<Post>(`/wp-json/wp/v2/posts/${id}`, { _fields: postFields });
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    slug,
    _fields: postFields,
  }).then(
    (posts) => posts[0]
  );
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
    _fields: postFields,
  });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    tags: tagId, 
    _fields: postFields,
  });
}

const categoryFields: Array<keyof Category> = [ 
  "id", "count", "description", "link", "name", "slug", "taxonomy", "parent",
];

export const getAllCategories = createGetAll<Category>("/wp-json/wp/v2/categories", {
  hide_empty: true,
  _fields: categoryFields,
});

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`, { _fields: categoryFields });
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", { slug, _fields: categoryFields }).then(
    (categories) => categories[0]
  );
}

const tagFields: Array<keyof Tag> = [ 
  "id", "count", "description", "link", "name", "slug", "taxonomy",
];

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { 
    post: postId, 
    _fields: tagFields, 
  });
}

export const getAllTags = createGetAll<Tag>("/wp-json/wp/v2/tags", {
  hide_empty: true,
  _fields: tagFields,
});

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`, { _fields: tagFields });
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug, _fields: tagFields }).then(
    (tags) => tags[0]
  );
}

const pageFields: Array<keyof Page> = [ 
  "id", "date", "date_gmt", "modified", "modified_gmt", "slug", "status", "link", 
  "guid", "title", "content", "excerpt", "author", "featured_media", "parent", 
  "menu_order", "comment_status", "ping_status", "template", "meta",
];

export const getAllPages = createGetAll<Page>("/wp-json/wp/v2/pages", { _fields: pageFields })

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`/wp-json/wp/v2/pages/${id}`, { _fields: pageFields });
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages", { slug, _fields: pageFields }).then(
    (pages) => pages[0]
  );
}

const authorFields: Array<keyof Author> = [ 
  "id", "name", "url", "description", "link", "slug", "avatar_urls",
];

export const getAllAuthors = createGetAll<Author>("/wp-json/wp/v2/users", {
  has_published_posts: true,
  _fields: authorFields,
});

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`, { _fields: authorFields });
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", { slug, _fields: authorFields }).then(
    (users) => users[0]
  );
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    author: authorId,
    _fields: postFields,
  });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    author: author.id,
    _fields: postFields,
  });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
    _fields: postFields,
  });
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    tags: tag.id,
    _fields: postFields,
  });
}

const mediaFields: Array<keyof Media> = [
  "id", "date", "date_gmt", "modified", "modified_gmt", "slug", "status", "link",
  "guid", "title", "author", "caption", "alt_text", "media_type", "mime_type",
  "media_details", "source_url",
];

export async function getFeaturedMediaById(id: number): Promise<Media> {
  return wordpressFetch<Media>(`/wp-json/wp/v2/media/${id}`, {
    _fields: mediaFields,
  });
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
    hide_empty: true,
    _fields: categoryFields,
  });
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
    hide_empty: true,
    _fields: tagFields,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
    hide_empty: true,
    _fields: authorFields,
  });
}

// Function specifically for generateStaticParams - fetches ALL posts
export const getAllPostSlugs = () => getAllPosts({ _fields: [ "slug" ] })

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
    _fields: postFields,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
    _fields: postFields,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
    _fields: postFields,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export { WordPressAPIError };
