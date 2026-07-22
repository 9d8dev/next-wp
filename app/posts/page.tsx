import {
  getPostsPaginated,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
} from "@/lib/wordpress";

import { StoryCard } from "@/components/magazine/story";
import { FilterPosts } from "@/components/posts/filter";
import { SearchInput } from "@/components/posts/search-input";

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Stories",
  description: "Browse and search every story in the Gujrera record.",
};

export const dynamic = "auto";
export const revalidate = 3600;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { author, tag, category, page: pageParam, search } = params;

  const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
  const postsPerPage = 9;

  const [postsResponse, authors, tags, categories] = await Promise.all([
    getPostsPaginated(page, postsPerPage, { author, tag, category, search }),
    search ? searchAuthors(search) : getAllAuthors(),
    search ? searchTags(search) : getAllTags(),
    search ? searchCategories(search) : getAllCategories(),
  ]);

  const { data: posts, headers } = postsResponse;
  const { total, totalPages } = headers;

  const pageUrl = (newPage: number) => {
    const p = new URLSearchParams();
    if (newPage > 1) p.set("page", newPage.toString());
    if (category) p.set("category", category);
    if (author) p.set("author", author);
    if (tag) p.set("tag", tag);
    if (search) p.set("search", search);
    return `/posts${p.toString() ? `?${p.toString()}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
      <header className="border-b-2 border-ink pb-4">
        <p className="kicker text-brown">The Record</p>
        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
          All Stories
        </h1>
        <p className="mt-3 font-kicker text-[0.72rem] uppercase tracking-[0.09em] text-brown">
          {total.toLocaleString("en-IN")} {total === 1 ? "story" : "stories"}
          {search && " matching your search"}
        </p>
      </header>

      <div className="mt-6 space-y-4">
        <SearchInput defaultValue={search} />
        <FilterPosts
          authors={authors}
          tags={tags}
          categories={categories}
          selectedAuthor={author}
          selectedTag={tag}
          selectedCategory={category}
        />
      </div>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StoryCard key={post.id} post={post} variant="feature" />
          ))}
        </div>
      ) : (
        <p className="mt-10 border-t border-line pt-8 text-brown">
          No stories match your search.
        </p>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-between border-t border-line pt-6 font-kicker text-[0.72rem] font-semibold uppercase tracking-[0.09em]">
          {page > 1 ? (
            <Link href={pageUrl(page - 1)} className="text-saffron hover:text-saffron-deep">
              ← Newer
            </Link>
          ) : (
            <span className="text-brown/40">← Newer</span>
          )}
          <span className="text-brown">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={pageUrl(page + 1)} className="text-saffron hover:text-saffron-deep">
              Older →
            </Link>
          ) : (
            <span className="text-brown/40">Older →</span>
          )}
        </nav>
      )}
    </div>
  );
}
