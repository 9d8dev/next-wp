import { Post, Category, Tag, Page, Author } from "./wordpress.d";
import { wordpress } from "@/wp.config";

export async function getAllPosts(): Promise<Post[]> {
  const response = await fetch(`${wordpress.url}wp-json/wp/v2/posts`);
  const posts: Post[] = await response.json();
  return posts;
}

export async function getPostById(id: number): Promise<Post> {
  const response = await fetch(`${wordpress.url}wp-json/wp/v2/posts/${id}`);
  const post: Post = await response.json();
  return post;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/posts?slug=${slug}`
  );
  const post: Post[] = await response.json();
  return post[0];
}

export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch("${wordpress.url}wp-json/wp/v2/categories");
  const categories: Category[] = await response.json();
  return categories;
}

export async function getCategoryById(id: number): Promise<Category> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/categories/${id}`
  );
  const category: Category = await response.json();
  return category;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/categories?slug=${slug}`
  );
  const category: Category[] = await response.json();
  return category[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/posts?categories=${categoryId}`
  );
  const posts: Post[] = await response.json();
  return posts;
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/posts?tags=${tagId}`
  );
  const posts: Post[] = await response.json();
  return posts;
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/tags?post=${postId}`
  );
  const tags: Tag[] = await response.json();
  return tags;
}

export async function getAllTags(): Promise<Tag[]> {
  const response = await fetch("${wordpress.url}wp-json/wp/v2/tags");
  const tags: Tag[] = await response.json();
  return tags;
}

export async function getTagById(id: number): Promise<Tag> {
  const response = await fetch(`${wordpress.url}wp-json/wp/v2/tags/${id}`);
  const tag: Tag = await response.json();
  return tag;
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/tags?slug=${slug}`
  );
  const tag: Tag[] = await response.json();
  return tag[0];
}

export async function getAllPages(): Promise<Page[]> {
  const response = await fetch("${wordpress.url}wp-json/wp/v2/pages");
  const pages: Page[] = await response.json();
  return pages;
}

export async function getPageById(id: number): Promise<Page> {
  const response = await fetch(`${wordpress.url}wp-json/wp/v2/pages/${id}`);
  const page: Page = await response.json();
  return page;
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/pages?slug=${slug}`
  );
  const page: Page[] = await response.json();
  return page[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  const response = await fetch("${wordpress.url}wp-json/wp/v2/users");
  const authors: Author[] = await response.json();
  return authors;
}

export async function getAuthorById(id: number): Promise<Author> {
  const response = await fetch(`${wordpress.url}wp-json/wp/v2/users/${id}`);
  const author: Author = await response.json();
  return author;
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/users?slug=${slug}`
  );
  const author: Author[] = await response.json();
  return author[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const response = await fetch(
    `${wordpress.url}wp-json/wp/v2/posts?author=${authorId}`
  );
  const posts: Post[] = await response.json();
  return posts;
}
