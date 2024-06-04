import {
  getAllPosts,
  getAllAuthors,
  getAllTags,
  getAllCategories,
} from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import PostCard from "@/components/posts/post-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { author, tag, category, page: pageParam } = searchParams;
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
        <h1>Posts</h1>
        <div className="flex space-x-4 mb-4">
          <Select value={author || "all"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Authors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors.map((author) => (
                <SelectItem key={author.id} value={author.id.toString()}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tag || "all"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category || "all"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {paginatedPosts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-8 not-prose">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/posts?page=${Math.max(page - 1, 1)}`}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`/posts?page=${page}`}>
                  {page}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`/posts?page=${Math.min(page + 1, totalPages)}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Container>
    </Section>
  );
}
