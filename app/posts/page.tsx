import {
  getAllPosts,
  getAllAuthors,
  getAllTags,
  getAllCategories,
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
import PostCard from "@/components/posts/post-card";
import FilterPosts from "@/components/posts/filter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Browse all our blog posts",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const { author, tag, category, page: pageParam } = params;

  const posts = await getAllPosts({ author, tag, category });
  const authors = await getAllAuthors();
  const tags = await getAllTags();
  const categories = await getAllCategories();

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 9;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginatedPosts = posts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  return (
    <Section>
      <Container>
        <Prose>
          <h2>All Posts</h2>
        </Prose>

        <FilterPosts
          authors={authors}
          tags={tags}
          categories={categories}
          selectedAuthor={author}
          selectedTag={tag}
          selectedCategory={category}
        />

        {paginatedPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4 z-0">
            {paginatedPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
            <p>No Results Found</p>
          </div>
        )}

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={page === 1 ? "pointer-events-none text-muted" : ""}
                href={`/posts?page=${Math.max(page - 1, 1)}${
                  category ? `&category=${category}` : ""
                }${author ? `&author=${author}` : ""}${
                  tag ? `&tag=${tag}` : ""
                }`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/posts?page=${page}`}>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={
                  page === totalPages ? "pointer-events-none text-muted" : ""
                }
                href={`/posts?page=${Math.min(page + 1, totalPages)}${
                  category ? `&category=${category}` : ""
                }${author ? `&author=${author}` : ""}${
                  tag ? `&tag=${tag}` : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Container>
    </Section>
  );
}
