import {
  getAllPosts,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
} from "@/lib/wordpress";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { FilterPosts } from "@/components/posts/filter";
import { SearchInput } from "@/components/posts/search-input";

import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Browse all our blog posts",
};

export const dynamic = "auto";
export const revalidate = 600;

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

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 3;
  
  // Fetch data based on search parameters
  const [posts, authors, tags, categories] = await Promise.all([
    getAllPosts({ author, tag, category, search, page: page, perPage: postsPerPage }),
    search ? searchAuthors(search) : getAllAuthors(),
    search ? searchTags(search) : getAllTags(),
    search ? searchCategories(search) : getAllCategories(),
  ]);

  // Create pagination URL helper
  const createPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    if (author) params.set("author", author);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    return `/posts${params.toString() ? `?${params.toString()}` : ""}`;
  };
  return (
    <Section>
      <Container>
        <div className="space-y-8">
          <Prose>
            <h2>All Posts</h2>
            <p className="text-muted-foreground">
              {posts.total} {posts.total === 1 ? "post" : "posts"} found
              {search && " matching your search"}
            </p>
          </Prose>

          <div className="space-y-4">
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

          {posts.posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {posts.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
              <p>No posts found</p>
            </div>
          )}

          {/* Pagination */}
          {(posts && posts.pages > 1) && <section className='text-white flex flex-row w-fit mx-auto'>
            <section className='flex flex-row gap-3'>
              <Button variant={"ghost"} asChild><Link className={`lg:w-full hover:bg-gray-700/60 ${page === 1 ? 'dark:bg-gray-700 bg-blue-100 !text-primary' : ''}`} href={createPaginationUrl(1)}>۱</Link></Button>
              {page > 3 && "..."}
              {page-1 > 1 && <Button variant={"ghost"} asChild><Link href={createPaginationUrl(page - 1)} className={`lg:w-full hover:bg-gray-700/60`}>{(page-1)}</Link></Button>}
              {page != 1 && page != posts.pages && <Button variant={"ghost"} asChild><p className={`lg:w-full hover:bg-gray-700/60 dark:bg-gray-700 bg-blue-100 !text-primary`}>{(page)}</p></Button>}
              {page+1 < posts.pages && <Button variant={"ghost"} asChild><Link href={createPaginationUrl(page + 1)} className={`lg:w-full hover:bg-gray-700/60`}>{(page+1)}</Link></Button>}
              {page < posts.pages-2 && "..."}
              <Button variant={"ghost"} asChild><Link className={`lg:w-full hover:bg-gray-700/60 ${page === posts.pages ? 'dark:bg-gray-700 bg-blue-100 !text-primary' : ''}`} href={createPaginationUrl(posts.pages)}>{(posts.pages)}</Link></Button>
            </section>
          </section>}
        </div>
      </Container>
    </Section>
  );
}
