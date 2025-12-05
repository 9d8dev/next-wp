/**
 * Enhanced WordPress functions with URL rewriting
 * Wraps lib/wordpress.ts functions and applies URL rewriting to content
 */

import { getPageBySlug as originalGetPageBySlug, getPageById as originalGetPageById, getPostBySlug as originalGetPostBySlug, getPostById as originalGetPostById } from "./wordpress";
import { rewriteWpUrls, rewriteWpUrlInText } from "./url-rewriter";
import type { Page, Post } from "./wordpress.d";

/**
 * Get page by slug with WordPress URLs rewritten to Next.js URLs
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const page = await originalGetPageBySlug(slug);

  if (!page) {
    return null;
  }

  return rewritePageUrls(page);
}

/**
 * Get page by ID with WordPress URLs rewritten to Next.js URLs
 */
export async function getPageById(id: number): Promise<Page> {
  const page = await originalGetPageById(id);
  return rewritePageUrls(page);
}

/**
 * Get post by slug with WordPress URLs rewritten to Next.js URLs
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const post = await originalGetPostBySlug(slug);

  if (!post) {
    return post;
  }

  return rewritePostUrls(post);
}

/**
 * Get post by ID with WordPress URLs rewritten to Next.js URLs
 */
export async function getPostById(id: number): Promise<Post> {
  const post = await originalGetPostById(id);
  return rewritePostUrls(post);
}

/**
 * Rewrite all URLs in a page object
 * Applies both href rewriting (relative paths) and plain text URL replacement
 */
function rewritePageUrls(page: Page): Page {
  const rewriteContent = (content: string) => {
    // First rewrite href attributes to relative paths
    let rewritten = rewriteWpUrls(content);
    // Then replace remaining WordPress URLs in plain text with full site URLs
    rewritten = rewriteWpUrlInText(rewritten);
    return rewritten;
  };

  return {
    ...page,
    content: {
      ...page.content,
      rendered: rewriteContent(page.content.rendered),
    },
    excerpt: page.excerpt
      ? {
          ...page.excerpt,
          rendered: rewriteContent(page.excerpt.rendered),
        }
      : page.excerpt,
  };
}

/**
 * Rewrite all URLs in a post object
 * Applies both href rewriting (relative paths) and plain text URL replacement
 */
function rewritePostUrls(post: Post): Post {
  const rewriteContent = (content: string) => {
    // First rewrite href attributes to relative paths
    let rewritten = rewriteWpUrls(content);
    // Then replace remaining WordPress URLs in plain text with full site URLs
    rewritten = rewriteWpUrlInText(rewritten);
    return rewritten;
  };

  return {
    ...post,
    content: {
      ...post.content,
      rendered: rewriteContent(post.content.rendered),
    },
    excerpt: post.excerpt
      ? {
          ...post.excerpt,
          rendered: rewriteContent(post.excerpt.rendered),
        }
      : post.excerpt,
  };
}
