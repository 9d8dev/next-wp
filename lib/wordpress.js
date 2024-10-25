// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API

import querystring from 'query-string';

// WordPress Config
const baseUrl = process.env.WORDPRESS_URL;

function getUrl(path, query) {
  const params = query ? querystring.stringify(query) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

// WordPress Functions

export async function getAllPosts(filterParams) {  
  const url = getUrl("/wp-json/wp/v2/posts", { 
    author: filterParams?.author, 
    tags: filterParams?.tag, 
    categories: filterParams?.category 
  });
  const response = await fetch(url);
  const posts = await response.json();
  return posts;
}

export async function getPostById(id) {
  const url = getUrl(`/wp-json/wp/v2/posts/${id}`);
  const response = await fetch(url);
  const post = await response.json();
  return post;
}

export async function getPostBySlug(slug) {
  const url = getUrl("/wp-json/wp/v2/posts", { slug });
  const response = await fetch(url);
  const post = await response.json();
  return post[0];
}

export async function getAllCategories() {
  const url = getUrl("/wp-json/wp/v2/categories");
  const response = await fetch(url);
  const categories = await response.json();
  return categories;
}

export async function getCategoryById(id) {
  const url = getUrl(`/wp-json/wp/v2/categories/${id}`);
  const response = await fetch(url);
  const category = await response.json();
  return category;
}

export async function getCategoryBySlug(slug) {
  const url = getUrl("/wp-json/wp/v2/categories", { slug });
  const response = await fetch(url);
  const category = await response.json();
  return category[0];
}

export async function getPostsByCategory(categoryId) {
  const url = getUrl("/wp-json/wp/v2/posts", { categories: categoryId });
  const response = await fetch(url);
  const posts = await response.json();
  return posts;
}

export async function getPostsByTag(tagId) {
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tagId });
  const response = await fetch(url);
  const posts = await response.json();
  return posts;
}

export async function getTagsByPost(postId) {
  const url = getUrl("/wp-json/wp/v2/tags", { post: postId });
  const response = await fetch(url);
  const tags = await response.json();
  return tags;
}

export async function getAllTags() {
  const url = getUrl("/wp-json/wp/v2/tags");
  const response = await fetch(url);
  const tags = await response.json();
  return tags;
}

export async function getTagById(id) {
  const url = getUrl(`/wp-json/wp/v2/tags/${id}`);
  const response = await fetch(url);
  const tag = await response.json();
  return tag;
}

export async function getTagBySlug(slug) {
  const url = getUrl("/wp-json/wp/v2/tags", { slug });
  const response = await fetch(url);
  const tag = await response.json();
  return tag[0];
}

export async function getAllPages() {
  const url = getUrl("/wp-json/wp/v2/pages");
  const response = await fetch(url);
  const pages = await response.json();
  return pages;
}

export async function getPageById(id) {
  const url = getUrl(`/wp-json/wp/v2/pages/${id}`);
  const response = await fetch(url);
  const page = await response.json();
  return page;
}

export async function getPageBySlug(slug) {
  const url = getUrl("/wp-json/wp/v2/pages", { slug });
  const response = await fetch(url);
  const page = await response.json();
  return page[0];
}

export async function getAllAuthors() {
  const url = getUrl("/wp-json/wp/v2/users");
  const response = await fetch(url);
  const authors = await response.json();
  return authors;
}

export async function getAuthorById(id) {
  const url = getUrl(`/wp-json/wp/v2/users/${id}`);
  const response = await fetch(url);
  const author = await response.json();
  return author;
}

export async function getAuthorBySlug(slug) {
  const url = getUrl("/wp-json/wp/v2/users", { slug });
  const response = await fetch(url);
  const author = await response.json();
  return author[0];
}

export async function getPostsByAuthor(authorId) {
  const url = getUrl("/wp-json/wp/v2/posts", { author: authorId });
  const response = await fetch(url);
  const posts = await response.json();
  return posts;
}

export async function getPostsByAuthorSlug(authorSlug) {
  const author = await getAuthorBySlug(authorSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { author: author.id });
  const response = await fetch(url);
  const posts = await response.json();
  return posts;
}

export async function getPostsByCategorySlug(categorySlug) {
  const category = await getCategoryBySlug(categorySlug);
  const url = getUrl("/wp-json/wp/v2/posts", { categories: category.id });
  const response = await fetch(url);
  const posts = await response.json();
  return posts;
}

export async function getPostsByTagSlug(tagSlug) {
  const tag = await getTagBySlug(tagSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tag.id });
  const response = await fetch(url);
  const posts = await response.json();
  return posts;
}

export async function getFeaturedMediaById(id) {
  const url = getUrl(`/wp-json/wp/v2/media/${id}`);
  const response = await fetch(url);
  const featuredMedia = await response.json();
  return featuredMedia;
}
