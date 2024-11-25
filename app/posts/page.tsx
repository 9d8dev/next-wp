// pages/page.tsx

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

import { Section, Container } from "@/components/craft";
import PostCard from "@/components/posts/post-card";
import FilterPosts from "./filter";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { author, tag, category, page: pageParam } = searchParams;
  
  // Determine the current page
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 9;

  // Calculate per_page for the API (fetch more to fill the current page)
  // For example, if postsPerPage is 9, set per_page to 9
  const perPage = postsPerPage;

  // Fetch posts for the current page
  const { posts, totalPages } = await getAllPosts(
    { author, tag, category },
    page,
    perPage
  );

  // Fetch filter options
  const [authors, tags, categories] = await Promise.all([
    getAllAuthors(),
    getAllTags(),
    getAllCategories(),
  ]);

  return (
    <Section>
      <Container>
        <h1>Newest Posts</h1>
        <FilterPosts
          authors={authors}
          tags={tags}
          categories={categories}
          selectedAuthor={author}
          selectedTag={tag}
          selectedCategory={category}
        />

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4 z-0">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
            <p>No results</p>
          </div>
        )}

        <div className="mt-8 not-prose">
          <Pagination>
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
        </div>
      </Container>
    </Section>
  );
}
