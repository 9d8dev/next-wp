// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from 'query-string'

import {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";

// WordPress Config

const baseUrl = process.env.WORDPRESS_URL;

function getUrl(path: string, query?: Record<string, any>) {
    const params = query ? querystring.stringify(query) : null
  
    return `${baseUrl}${path}${params ? `?${params}` : ""}`
}

export interface GetPostsResult {
  posts: Post[];
  totalPages: number;
}

export async function getAllPosts(
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
  },
  page: number = 1,
  perPage: number = 100
): Promise<GetPostsResult> {  
  const url = getUrl("/wp-json/wp/v2/posts", { 
    author: filterParams?.author, 
    tags: filterParams?.tag, 
    categories: filterParams?.category,
    per_page: Math.min(perPage, 100), // WordPress max is 100
    page
  });

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching posts: ${response.statusText}`);
  }

  const posts: Post[] = await response.json();

  // Parse the total number of pages from the response headers
  const totalPagesHeader = response.headers.get('X-WP-TotalPages');
  const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;

  return { posts, totalPages };
}


export async function getPostById(id: number): Promise<Post> {
  const url = getUrl(`/wp-json/wp/v2/posts/${id}`);
  const response = await fetch(url);
  const post: Post = await response.json();
  return post;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const url = getUrl("/wp-json/wp/v2/posts", { slug });
  const response = await fetch(url);
  const post: Post[] = await response.json();
  return post[0];
}

export async function getAllCategories(): Promise<Category[]> {
  const url = getUrl("/wp-json/wp/v2/categories");
  const response = await fetch(url);
  const categories: Category[] = await response.json();
  return categories;
}

export async function getCategoryById(id: number): Promise<Category> {
  const url = getUrl(`/wp-json/wp/v2/categories/${id}`);
  const response = await fetch(url);
  const category: Category = await response.json();
  return category;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const url = getUrl("/wp-json/wp/v2/categories", { slug });
  const response = await fetch(url);
  const category: Category[] = await response.json();
  return category[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { categories:  categoryId });
  const response = await fetch(url);
  const posts: Post[] = await response.json();
  return posts;
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { tags:  tagId });
  const response = await fetch(url);
  const posts: Post[] = await response.json();
  return posts;
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", { post:  postId });
  const response = await fetch(url);
  const tags: Tag[] = await response.json();
  return tags;
}

export async function getAllTags(): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags");
  const response = await fetch(url);
  const tags: Tag[] = await response.json();
  return tags;
}

export async function getTagById(id: number): Promise<Tag> {
  const url = getUrl(`/wp-json/wp/v2/tags/${id}`);
  const response = await fetch(url);
  const tag: Tag = await response.json();
  return tag;
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const url = getUrl("/wp-json/wp/v2/tags", { slug });
  const response = await fetch(url);
  const tag: Tag[] = await response.json();
  return tag[0];
}

export async function getAllPages(): Promise<Page[]> {
  const url = getUrl("/wp-json/wp/v2/pages");
  const response = await fetch(url);
  const pages: Page[] = await response.json();
  return pages;
}

export async function getPageById(id: number): Promise<Page> {
  const url = getUrl(`/wp-json/wp/v2/pages/${id}`);
  const response = await fetch(url);
  const page: Page = await response.json();
  return page;
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const url = getUrl("/wp-json/wp/v2/pages", { slug });
  const response = await fetch(url);
  const page: Page[] = await response.json();
  return page[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users");
  const response = await fetch(url);
  const authors: Author[] = await response.json();
  return authors;
}

export async function getAuthorById(id: number): Promise<Author> {
  const url = getUrl(`/wp-json/wp/v2/users/${id}`);
  const response = await fetch(url);
  const author: Author = await response.json();
  return author;
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const url = getUrl("/wp-json/wp/v2/users", { slug });
  const response = await fetch(url);
  const author: Author[] = await response.json();
  return author[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { author: authorId });
  const response = await fetch(url);
  const posts: Post[] = await response.json();
  return posts;
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { author: author.id });
  const response = await fetch(url);
  const posts: Post[] = await response.json();
  return posts;
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  const url = getUrl("/wp-json/wp/v2/posts", { categories: category.id });
  const response = await fetch(url);
  const posts: Post[] = await response.json();
  return posts;
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tag.id });
  const response = await fetch(url);
  const posts: Post[] = await response.json();
  return posts;
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  const url = getUrl(`/wp-json/wp/v2/media/${id}`);
  const response = await fetch(url);
  const featuredMedia: FeaturedMedia = await response.json();
  return featuredMedia;
}
