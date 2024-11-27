// app/clanky/page.tsx

import {
  getAllPosts,
  getAllAuthors,
  getAllTags,
  getAllCategories,
} from "@/lib/wordpress";
import PaginationComponent from "@/components/ui/pagination-component"; // Uistite sa, že cesta je správna

import { Section, Container } from "@/components/craft";
import PostCard from "@/components/posts/post-card";
import FilterPosts from "./filter";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { author, tag, category, page: pageParam } = searchParams;

  // Určte aktuálnu stránku
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 9;

  // Načítanie príspevkov pre aktuálnu stránku
  const { posts, totalPages } = await getAllPosts(
    { author, tag, category },
    currentPage,
    postsPerPage
  );

  // Načítanie možností filtrov
  const [authors, tagsList, categoriesList] = await Promise.all([
    getAllAuthors(),
    getAllTags(),
    getAllCategories(),
  ]);

  return (
    <Section>
      <Container>
        <h1>Newest posts</h1>
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
            <p>No results</p>
          </div>
        )}

        {/* Paginácia */}
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
