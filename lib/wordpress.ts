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
  FeaturedMedia,
} from "./wordpress.d";

// Single source of truth for WordPress configuration
const baseUrl = process.env.WORDPRESS_URL;
const isConfigured = Boolean(baseUrl);

if (!isConfigured) {
  console.warn(
    "WORDPRESS_URL environment variable is not defined - WordPress features will be unavailable"
  );
}

class WordPressAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// Pagination types
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

const USER_AGENT = "Next.js WordPress Client";
const CACHE_TTL = 3600; // 1 hour

/**
 * Normalizes a WordPress `link` (absolute URL or bare path) into a canonical
 * site path with a leading and trailing slash, e.g.
 * "https://www.gujrera.com/news/foo/" -> "/news/foo/".
 * The WordPress REST API `link` field is the single source of truth for URLs,
 * so this is used both to emit links and to verify resolved content.
 */
export function linkToPath(link: string): string {
  let path: string;
  try {
    path = new URL(link, "http://placeholder.local").pathname;
  } catch {
    return "/";
  }
  if (!path.startsWith("/")) path = `/${path}`;
  if (path !== "/" && !path.endsWith("/")) path += "/";
  return path;
}

// Splits a normalized path into non-empty segments: "/a/b/" -> ["a", "b"].
export function pathToSegments(path: string): string[] {
  return path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
}

// Retry config for transient upstream failures. Shared WordPress hosts commonly
// return 5xx/429 under bursty load (e.g. build-time static generation), so we
// retry those with exponential backoff + jitter to spread requests out.
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

// fetch wrapper that retries transient failures (5xx / 429 / network errors).
async function fetchWithRetry(
  url: string,
  init: RequestInit & { next?: { tags?: string[]; revalidate?: number } }
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      // Exponential backoff with jitter: ~0.5s, ~1s, ~2s (+/- randomness).
      // Kept tiny under test to exercise the retry path without slow waits.
      const base = process.env.VITEST ? 1 : RETRY_BASE_MS;
      const backoff = base * 2 ** (attempt - 1);
      await sleep(backoff + Math.random() * base);
    }

    try {
      const response = await fetch(url, init);
      if (isRetryableStatus(response.status) && attempt < MAX_RETRIES) {
        continue;
      }
      return response;
    } catch (error) {
      // Network-level failure (DNS, socket, TLS) - retry unless out of attempts.
      lastError = error;
      if (attempt >= MAX_RETRIES) throw error;
    }
  }

  throw lastError;
}

// Core fetch - throws on error (for functions that require data)
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  if (!baseUrl) {
    throw new Error("WordPress URL not configured");
  }

  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query)}` : ""}`;

  const response = await fetchWithRetry(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { tags, revalidate: CACHE_TTL },
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

// Graceful fetch - returns fallback when WordPress unavailable or on error
async function wordpressFetchGraceful<T>(
  path: string,
  fallback: T,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  if (!isConfigured) return fallback;

  try {
    return await wordpressFetch<T>(path, query, tags);
  } catch {
    console.warn(`WordPress fetch failed for ${path}`);
    return fallback;
  }
}

// Paginated fetch - returns response with headers
async function wordpressFetchPaginated<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T>> {
  if (!baseUrl) {
    throw new Error("WordPress URL not configured");
  }

  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query)}` : ""}`;

  const response = await fetchWithRetry(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { tags, revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return {
    data: await response.json(),
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// Graceful paginated fetch - returns empty response when unavailable
async function wordpressFetchPaginatedGraceful<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T[]>> {
  const emptyResponse: WordPressResponse<T[]> = {
    data: [],
    headers: { total: 0, totalPages: 0 },
  };

  if (!isConfigured) return emptyResponse;

  try {
    return await wordpressFetchPaginated<T[]>(path, query, tags);
  } catch {
    console.warn(`WordPress paginated fetch failed for ${path}`);
    return emptyResponse;
  }
}

// Paginated posts with filter support
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<Post[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", "posts", `posts-page-${page}`];

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`posts-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
    cacheTags.push(`posts-category-${filterParams.category}`);
  }

  return wordpressFetchPaginatedGraceful<Post>(
    "/wp-json/wp/v2/posts",
    query,
    cacheTags
  );
}

/**
 * Fetches recent posts (up to 100). For paginated access use getPostsPaginated().
 * For fetching ALL posts (e.g., sitemap), use getAllPostsForSitemap().
 */
export async function getRecentPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) query.search = filterParams.search;
  if (filterParams?.author) query.author = filterParams.author;
  if (filterParams?.tag) query.tags = filterParams.tag;
  if (filterParams?.category) query.categories = filterParams.category;

  return wordpressFetchGraceful<Post[]>("/wp-json/wp/v2/posts", [], query, [
    "wordpress",
    "posts",
  ]);
}

export async function getPostById(id: number): Promise<Post> {
  return wordpressFetch<Post>(`/wp-json/wp/v2/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await wordpressFetchGraceful<Post[]>(
    "/wp-json/wp/v2/posts",
    [],
    { slug, _embed: true }
  );
  return posts[0];
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetchGraceful<Category[]>(
    "/wp-json/wp/v2/categories",
    [],
    { per_page: 100 },
    ["wordpress", "categories"]
  );
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", { slug }).then(
    (categories) => categories[0]
  );
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { post: postId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetchGraceful<Tag[]>(
    "/wp-json/wp/v2/tags",
    [],
    { per_page: 100 },
    ["wordpress", "tags"]
  );
}

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug }).then(
    (tags) => tags[0]
  );
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetchGraceful<Page[]>(
    "/wp-json/wp/v2/pages",
    [],
    { per_page: 100 },
    ["wordpress", "pages"]
  );
}

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`/wp-json/wp/v2/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  const pages = await wordpressFetchGraceful<Page[]>(
    "/wp-json/wp/v2/pages",
    [],
    { slug }
  );
  return pages[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetchGraceful<Author[]>(
    "/wp-json/wp/v2/users",
    [],
    { per_page: 100 },
    ["wordpress", "authors"]
  );
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", { slug }).then(
    (users) => users[0]
  );
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: authorId });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: author.id });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
  });
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tag.id });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetchGraceful<Category[]>(
    "/wp-json/wp/v2/categories",
    [],
    { search: query, per_page: 100 }
  );
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetchGraceful<Tag[]>("/wp-json/wp/v2/tags", [], {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetchGraceful<Author[]>("/wp-json/wp/v2/users", [], {
    search: query,
    per_page: 100,
  });
}

// Fetches ALL post slugs for generateStaticParams
// Returns empty array if WordPress is unavailable (allows build to succeed)
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  if (!isConfigured) return [];

  try {
    const allSlugs: { slug: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Post[]>(
        "/wp-json/wp/v2/posts",
        { per_page: 100, page, _fields: "slug" }
      );

      allSlugs.push(...response.data.map((post) => ({ slug: post.slug })));
      hasMore = page < response.headers.totalPages;
      page++;
    }

    return allSlugs;
  } catch {
    console.warn("WordPress unavailable, skipping static generation for posts");
    return [];
  }
}

// Fetches ALL posts for sitemap generation (paginates through all pages)
// Returns the real permalink path, slug, and modified date for each post.
export async function getAllPostsForSitemap(): Promise<
  { slug: string; modified: string; path: string }[]
> {
  if (!isConfigured) return [];

  try {
    const allPosts: { slug: string; modified: string; path: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Post[]>(
        "/wp-json/wp/v2/posts",
        { per_page: 100, page, _fields: "slug,modified,link" }
      );

      allPosts.push(
        ...response.data.map((post) => ({
          slug: post.slug,
          modified: post.modified,
          path: linkToPath(post.link),
        }))
      );
      hasMore = page < response.headers.totalPages;
      page++;
    }

    return allPosts;
  } catch {
    console.warn("WordPress unavailable, skipping sitemap generation");
    return [];
  }
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  });
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  });
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  });
}

// --- Path-based resolvers (mirror WordPress permalinks) ---
// Each resolves an incoming site path back to WordPress content by looking up
// the trailing slug, then verifying the item's real `link` matches the request
// path. This is immune to the category-permalink / Yoast primary-category rules
// because the `link` field is authoritative.

/**
 * Resolves a post permalink path, e.g. "/news/foo/" or "/p/ahmedabad/foo/".
 * The last path segment is the (globally unique) post slug.
 */
export async function getPostByPath(path: string): Promise<Post | undefined> {
  const normalized = linkToPath(path);
  const segments = pathToSegments(normalized);
  const slug = segments[segments.length - 1];
  if (!slug) return undefined;

  const posts = await wordpressFetchGraceful<Post[]>(
    "/wp-json/wp/v2/posts",
    [],
    { slug, _embed: true },
    ["wordpress", "posts", `post-slug-${slug}`]
  );

  return posts.find((post) => linkToPath(post.link) === normalized);
}

/**
 * Resolves a category archive path, e.g. "/category/tp-schemes/ahmedabad-tp/".
 * The last segment is the category slug (globally unique in WordPress).
 */
export async function getCategoryByPath(
  path: string
): Promise<Category | undefined> {
  const normalized = linkToPath(path);
  const segments = pathToSegments(normalized);
  const slug = segments[segments.length - 1];
  if (!slug) return undefined;

  const categories = await wordpressFetchGraceful<Category[]>(
    "/wp-json/wp/v2/categories",
    [],
    { slug },
    ["wordpress", "categories"]
  );

  return categories.find((category) => linkToPath(category.link) === normalized);
}

/**
 * Resolves a tag archive path, e.g. "/tag/airport/".
 */
export async function getTagByPath(path: string): Promise<Tag | undefined> {
  const normalized = linkToPath(path);
  const segments = pathToSegments(normalized);
  const slug = segments[segments.length - 1];
  if (!slug) return undefined;

  const tags = await wordpressFetchGraceful<Tag[]>(
    "/wp-json/wp/v2/tags",
    [],
    { slug },
    ["wordpress", "tags"]
  );

  return tags.find((tag) => linkToPath(tag.link) === normalized);
}

// --- Static-params helpers for the catch-all route ---

/**
 * Recent post paths as segment arrays for generateStaticParams, e.g.
 * [["news", "foo"], ["p", "ahmedabad", "bar"]]. Only recent posts are
 * pre-rendered; the rest render on-demand (dynamicParams = true).
 */
export async function getRecentPostPaths(
  limit: number = 100
): Promise<string[][]> {
  const posts = await wordpressFetchGraceful<Pick<Post, "link">[]>(
    "/wp-json/wp/v2/posts",
    [],
    { per_page: limit, _fields: "link" },
    ["wordpress", "posts"]
  );

  return posts
    .map((post) => pathToSegments(linkToPath(post.link)))
    .filter((segments) => segments.length > 0);
}

// All page paths as segment arrays for generateStaticParams (20 pages, cheap).
export async function getAllPagePaths(): Promise<string[][]> {
  const pages = await wordpressFetchGraceful<Pick<Page, "link">[]>(
    "/wp-json/wp/v2/pages",
    [],
    { per_page: 100, _fields: "link" },
    ["wordpress", "pages"]
  );

  return pages
    .map((page) => pathToSegments(linkToPath(page.link)))
    .filter((segments) => segments.length > 0);
}

export { WordPressAPIError };
