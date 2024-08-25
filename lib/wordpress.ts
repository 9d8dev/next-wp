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

function wpFetch<T>(path: string, query?: Record<string, any>) {
  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query)}` : ""}`;

  return fetch(url)
    .then(response => response.json()) as Promise<T>;
}

// WordPress Functions

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
}): Promise<Post[]> {  
  return wpFetch<Post[]>("/wp-json/wp/v2/posts", { author: filterParams?.author, tags: filterParams?.tag, categories: filterParams?.category });
}

export async function getPostById(id: number): Promise<Post> {
  return wpFetch<Post>(`/wp-json/wp/v2/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return wpFetch<Post[]>("/wp-json/wp/v2/posts", { slug })
    .then(posts => posts[0]);
}

export async function getAllCategories(): Promise<Category[]> {
  return wpFetch<Category[]>("/wp-json/wp/v2/categories");
}

export async function getCategoryById(id: number): Promise<Category> {
  return wpFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wpFetch<Category[]>("/wp-json/wp/v2/categories", { slug })
    .then(categories => categories[0]);
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wpFetch<Post[]>("/wp-json/wp/v2/posts", { categories:  categoryId });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wpFetch<Post[]>("/wp-json/wp/v2/posts", { tags:  tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wpFetch<Tag[]>("/wp-json/wp/v2/tags", { post:  postId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wpFetch<Tag[]>("/wp-json/wp/v2/tags");
}

export async function getTagById(id: number): Promise<Tag> {
  return wpFetch<Tag>(`/wp-json/wp/v2/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wpFetch<Tag[]>("/wp-json/wp/v2/tags", { slug })
    .then(tags => tags[0]);
}

export async function getAllPages(): Promise<Page[]> {
  return wpFetch<Page[]>("/wp-json/wp/v2/pages");
}

export async function getPageById(id: number): Promise<Page> {
  return wpFetch<Page>(`/wp-json/wp/v2/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return wpFetch<Page[]>("/wp-json/wp/v2/pages", { slug })
    .then(pages => pages[0]);
}

export async function getAllAuthors(): Promise<Author[]> {
  return wpFetch<Author[]>("/wp-json/wp/v2/users");
}

export async function getAuthorById(id: number): Promise<Author> {
  return wpFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wpFetch<Author[]>("/wp-json/wp/v2/users", { slug })
    .then(authors => authors[0]);
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wpFetch<Post[]>("/wp-json/wp/v2/posts", { author: authorId });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wpFetch<Post[]>("/wp-json/wp/v2/posts", { author: author.id });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  return wpFetch<Post[]>("/wp-json/wp/v2/posts", { categories: category.id });
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  return wpFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tag.id });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wpFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}
