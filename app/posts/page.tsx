// pages/page.tsx

import * as React from "react";
import { getAllPosts, getAllAuthors, getAllTags, getAllCategories } from "@/lib/wordpress";
import PaginationComponent from "@/components/ui/pagination-component"; // Adjust the path as needed

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
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 9;

  // Fetch posts for the current page
  const { posts, totalPages } = await getAllPosts(
    { author, tag, category },
    currentPage,
    postsPerPage
  );

  // Fetch filter options
  const [authors, tagsList, categoriesList] = await Promise.all([
    getAllAuthors(),
    getAllTags(),
    getAllCategories(),
  ]);

  return (
    <Section>
      <Container>
        <h1>Najnovšie články</h1>
        <FilterPosts
          authors={authors}
          tags={tagsList}
          categories={categoriesList}
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
            <p>Žiadny výsledok</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 not-prose">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            category={category}
            author={author}
            tag={tag}
          />
        </div>
      </Container>
    </Section>
  );
}