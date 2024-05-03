export async function getAllPosts() {
  const response = await fetch(
    "https://windpress.wpenginepowered.com/wp-json/wp/v2/posts"
  );
  const posts = await response.json();
  return posts;
}

export async function getPostById(id: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/posts/${id}`
  );
  const post = await response.json();
  return post;
}

export async function getPostBySlug(slug: string) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/posts?slug=${slug}`
  );
  const post = await response.json();
  return post[0];
}

export async function getAllCategories() {
  const response = await fetch(
    "https://windpress.wpenginepowered.com/wp-json/wp/v2/categories"
  );
  const categories = await response.json();
  return categories;
}

export async function getCategoryById(id: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/categories/${id}`
  );
  const category = await response.json();
  return category;
}

export async function getCategoryBySlug(slug: string) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/categories?slug=${slug}`
  );
  const category = await response.json();
  return category[0];
}

export async function getPostsByCategory(categoryId: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/posts?categories=${categoryId}`
  );
  const posts = await response.json();
  return posts;
}

export async function getPostsByTag(tagId: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/posts?tags=${tagId}`
  );
  const posts = await response.json();
  return posts;
}

export async function getTagsByPost(postId: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/tags?post=${postId}`
  );
  const tags = await response.json();
  return tags;
}

export async function getAllTags() {
  const response = await fetch(
    "https://windpress.wpenginepowered.com/wp-json/wp/v2/tags"
  );
  const tags = await response.json();
  return tags;
}

export async function getTagById(id: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/tags/${id}`
  );
  const tag = await response.json();
  return tag;
}

export async function getTagBySlug(slug: string) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/tags?slug=${slug}`
  );
  const tag = await response.json();
  return tag[0];
}

export async function getAllPages() {
  const response = await fetch(
    "https://windpress.wpenginepowered.com/wp-json/wp/v2/pages"
  );
  const pages = await response.json();
  return pages;
}

export async function getPageById(id: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/pages/${id}`
  );
  const page = await response.json();
  return page;
}

export async function getPageBySlug(slug: string) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/pages?slug=${slug}`
  );
  const page = await response.json();
  return page[0];
}

export async function getAllAuthors() {
  const response = await fetch(
    "https://windpress.wpenginepowered.com/wp-json/wp/v2/users"
  );
  const authors = await response.json();
  return authors;
}

export async function getAuthorById(id: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/users/${id}`
  );
  const author = await response.json();
  return author;
}

export async function getAuthorBySlug(slug: string) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/users?slug=${slug}`
  );
  const author = await response.json();
  return author[0];
}

export async function getPostsByAuthor(authorId: number) {
  const response = await fetch(
    `https://windpress.wpenginepowered.com/wp-json/wp/v2/posts?author=${authorId}`
  );
  const posts = await response.json();
  return posts;
}
