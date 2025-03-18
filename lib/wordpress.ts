// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import { revalidateTag } from "next/cache";

import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";

// WordPress Config
const baseUrl = process.env.WORDPRESS_URL;

if (!baseUrl) {
  throw new Error("WORDPRESS_URL environment variable is not defined");
}

// Utility type for fetch options
interface FetchOptions {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

function getUrl(path: string, query?: Record<string, any>) {
  const params = query ? querystring.stringify(query) : null;
  return `${baseUrl}/wp-json/wp/v2${path}${params ? `?${params}` : ""}`;
}

// Default fetch options for WordPress API calls
const defaultFetchOptions: FetchOptions = {
  next: {
    tags: ["wordpress"],
    revalidate: 3600, // Revalidate every hour by default
  },
};

// Error handling utility
class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// Utility function for making WordPress API requests
async function wordpressFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const userAgent = "Next.js WordPress Client";

  try {
    console.log('Fetching from URL:', url); // Debug log
    const response = await fetch(url, {
      ...defaultFetchOptions,
      ...options,
      headers: {
        "User-Agent": userAgent,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress API Error Response:', errorText); // Debug log
      throw new WordPressAPIError(
        `WordPress API request failed: ${response.statusText} (${response.status})`,
        response.status,
        url
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('WordPress API Error:', error); // Debug log
    throw error;
  }
}

// WordPress Functions

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
    status: 'publish', // Only fetch published posts
  };

  if (filterParams?.search) {
    query.search = filterParams.search;
    if (filterParams?.author) query.author = filterParams.author;
    if (filterParams?.tag) query.tags = filterParams.tag;
    if (filterParams?.category) query.categories = filterParams.category;
  } else {
    if (filterParams?.author) query.author = filterParams.author;
    if (filterParams?.tag) query.tags = filterParams.tag;
    if (filterParams?.category) query.categories = filterParams.category;
  }

  const url = getUrl("/posts", query);
  return wordpressFetch<Post[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", "posts"],
    },
  });
}

export async function getPostById(id: number): Promise<Post> {
  const url = getUrl(`/posts/${id}`);
  const response = await wordpressFetch<Post>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `post-${id}`],
    },
  });

  return response;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const url = getUrl("/posts", { slug });
  const response = await wordpressFetch<Post[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `post-${slug}`],
    },
  });

  if (!response || response.length === 0) {
    throw new WordPressAPIError(
      `Post not found with slug: ${slug}`,
      404,
      url
    );
  }

  return response[0];
}

export async function getAllCategories(): Promise<Category[]> {
  const url = getUrl("/categories");
  const response = await wordpressFetch<Category[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", "categories"],
    },
  });

  return response;
}

export async function getCategoryById(id: number): Promise<Category> {
  const url = getUrl(`/categories/${id}`);
  const response = await wordpressFetch<Category>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `category-${id}`],
    },
  });

  return response;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const url = getUrl("/categories", { slug });
  const response = await wordpressFetch<Category[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `category-${slug}`],
    },
  });

  return response[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  const url = getUrl("/posts", { categories: categoryId });
  const response = await wordpressFetch<Post[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `category-${categoryId}`],
    },
  });

  return response;
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  const url = getUrl("/posts", { tags: tagId });
  const response = await wordpressFetch<Post[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `tag-${tagId}`],
    },
  });

  return response;
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  const url = getUrl("/tags", { post: postId });
  const response = await wordpressFetch<Tag[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `post-${postId}`],
    },
  });

  return response;
}

export async function getAllTags(): Promise<Tag[]> {
  const url = getUrl("/tags");
  const response = await wordpressFetch<Tag[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", "tags"],
    },
  });

  return response;
}

export async function getTagById(id: number): Promise<Tag> {
  const url = getUrl(`/tags/${id}`);
  const response = await wordpressFetch<Tag>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `tag-${id}`],
    },
  });

  return response;
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const url = getUrl("/tags", { slug });
  const response = await wordpressFetch<Tag[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `tag-${slug}`],
    },
  });

  return response[0];
}

export async function getAllPages(): Promise<Page[]> {
  const url = getUrl("/pages");
  const response = await wordpressFetch<Page[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", "pages"],
    },
  });

  return response;
}

export async function getPageById(id: number): Promise<Page> {
  const url = getUrl(`/pages/${id}`);
  const response = await wordpressFetch<Page>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `page-${id}`],
    },
  });

  return response;
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const url = getUrl("/pages", { slug });
  const response = await wordpressFetch<Page[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `page-${slug}`],
    },
  });

  return response[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  const url = getUrl("/users");
  const response = await wordpressFetch<Author[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", "authors"],
    },
  });

  return response;
}

export async function getAuthorById(id: number): Promise<Author> {
  const url = getUrl(`/users/${id}`);
  const response = await wordpressFetch<Author>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `author-${id}`],
    },
  });

  return response;
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const url = getUrl("/users", { slug });
  const response = await wordpressFetch<Author[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `author-${slug}`],
    },
  });

  return response[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const url = getUrl("/posts", { author: authorId });
  const response = await wordpressFetch<Post[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `author-${authorId}`],
    },
  });

  return response;
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  const url = getUrl("/posts", { author: author.id });
  const response = await wordpressFetch<Post[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `author-${authorSlug}`],
    },
  });

  return response;
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  const url = getUrl("/posts", { categories: category.id });
  const response = await wordpressFetch<Post[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `category-${categorySlug}`],
    },
  });

  return response;
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  const url = getUrl("/posts", { tags: tag.id });
  const response = await wordpressFetch<Post[]>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `tag-${tagSlug}`],
    },
  });

  return response;
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  const url = getUrl(`/media/${id}`);
  const response = await wordpressFetch<FeaturedMedia>(url, {
    next: {
      ...defaultFetchOptions.next,
      tags: ["wordpress", `media-${id}`],
    },
  });

  return response;
}

// Helper function to search across categories
export async function searchCategories(query: string): Promise<Category[]> {
  const url = getUrl("/categories", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Category[]>(url);
}

// Helper function to search across tags
export async function searchTags(query: string): Promise<Tag[]> {
  const url = getUrl("/tags", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Tag[]>(url);
}

// Helper function to search across authors
export async function searchAuthors(query: string): Promise<Author[]> {
  const url = getUrl("/users", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Author[]>(url);
}

// Helper function to revalidate WordPress data
export async function revalidateWordPressData(tags: string[] = ["wordpress"]) {
  try {
    for (const tag of tags) {
      revalidateTag(tag);
    }
  } catch (error) {
    console.error("Failed to revalidate WordPress data:", error);
    throw new Error("Failed to revalidate WordPress data");
  }
}

// Export error class for error handling
export { WordPressAPIError };
