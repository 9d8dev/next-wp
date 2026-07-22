import type { Post } from "@/lib/wordpress.d";
import { linkToPath } from "@/lib/wordpress";
import { decodeHtml } from "@/lib/metadata";

// Editorial helpers for the magazine layout.

// The story's section (primary category), e.g. "News", "Guide".
export function postSection(post: Post): string {
  const term = post._embedded?.["wp:term"]?.[0]?.[0];
  return term?.name ? decodeHtml(term.name) : "News";
}

// Dateline date, e.g. "12 Jul 2026".
export function postDate(post: Post): string {
  return new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function postHref(post: Post): string {
  return linkToPath(post.link);
}

export function postImage(post: Post): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
}

export function postAuthor(post: Post): string | null {
  return post._embedded?.author?.[0]?.name ?? null;
}
