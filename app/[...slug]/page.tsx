import {
  getPostByPath,
  getPageBySlug,
  getCategoryByPath,
  getTagByPath,
  getAuthorByPath,
  getPostsByCategoryPaginated,
  getPostsByTagPaginated,
  getPostsByAuthorPaginated,
  getRecentPostPaths,
  getAllPagePaths,
  linkToPath,
} from "@/lib/wordpress";
import type { Post, Page as WPPage } from "@/lib/wordpress.d";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { badgeVariants } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;
// Only recent posts + all pages are pre-rendered; everything else renders
// on-demand and is then cached (WordPress has ~4300 posts).
export const dynamicParams = true;

// Matches WordPress's default archive page size so /page/N/ contains the same
// posts as the WordPress site.
const ARCHIVE_PER_PAGE = 10;

// --- Route classification (mirrors WordPress permalink structure) ---
type Resolved =
  | { kind: "category" }
  | { kind: "tag" }
  | { kind: "author" }
  | { kind: "page" }
  | { kind: "post" };

function classify(segments: string[]): Resolved {
  if (segments[0] === "category") return { kind: "category" };
  if (segments[0] === "tag") return { kind: "tag" };
  if (segments[0] === "author") return { kind: "author" };
  // No hierarchical pages exist, so a single segment is a page; posts always
  // carry a category prefix (>= 2 segments).
  if (segments.length === 1) return { kind: "page" };
  return { kind: "post" };
}

// WordPress paginates archives at /{archive}/page/N/ (page 1 is the bare URL).
// Split a trailing "page/N" off category/tag paths; posts and pages never
// paginate, so they are left untouched. Reading pagination from the path (not
// a query string) keeps this route statically prerenderable.
function parsePagination(slug: string[]): { segments: string[]; page: number } {
  const isArchive =
    slug[0] === "category" || slug[0] === "tag" || slug[0] === "author";
  if (isArchive && slug.length >= 3) {
    const last = slug[slug.length - 1];
    const prev = slug[slug.length - 2];
    if (prev === "page" && /^\d+$/.test(last)) {
      return {
        segments: slug.slice(0, -2),
        page: Math.max(1, parseInt(last, 10)),
      };
    }
  }
  return { segments: slug, page: 1 };
}

function pathFromParams(slug: string[]): string {
  return `/${slug.join("/")}/`;
}

// --- Static params: recent posts + all pages ---
export async function generateStaticParams() {
  const [postPaths, pagePaths] = await Promise.all([
    getRecentPostPaths(100),
    getAllPagePaths(),
  ]);

  return [...postPaths, ...pagePaths].map((segments) => ({ slug: segments }));
}

// --- Metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { segments } = parsePagination(slug);
  const path = pathFromParams(segments);
  const { kind } = classify(segments);

  if (kind === "post") {
    const post = await getPostByPath(path);
    if (!post) return {};
    return generateContentMetadata({
      title: post.title.rendered,
      description: stripHtml(post.excerpt.rendered),
      path: linkToPath(post.link),
    });
  }

  if (kind === "page") {
    const page = await getPageBySlug(segments[0]);
    if (!page) return {};
    const description = page.excerpt?.rendered
      ? stripHtml(page.excerpt.rendered)
      : stripHtml(page.content.rendered).slice(0, 200) + "...";
    return generateContentMetadata({
      title: page.title.rendered,
      description,
      path: linkToPath(page.link),
    });
  }

  if (kind === "category") {
    const category = await getCategoryByPath(path);
    if (!category) return {};
    return generateContentMetadata({
      title: category.name,
      description:
        stripHtml(category.description) || `Posts in ${category.name}`,
      path: linkToPath(category.link),
    });
  }

  if (kind === "author") {
    const author = await getAuthorByPath(path);
    if (!author) return {};
    return generateContentMetadata({
      title: author.name,
      description: stripHtml(author.description) || `Posts by ${author.name}`,
      path: linkToPath(author.link),
    });
  }

  const tag = await getTagByPath(path);
  if (!tag) return {};
  return generateContentMetadata({
    title: tag.name,
    description: stripHtml(tag.description) || `Posts tagged ${tag.name}`,
    path: linkToPath(tag.link),
  });
}

// --- Page dispatcher ---
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const { segments, page } = parsePagination(slug);
  const path = pathFromParams(segments);
  const { kind } = classify(segments);

  if (kind === "post") {
    const post = await getPostByPath(path);
    if (!post) notFound();
    return <PostView post={post} />;
  }

  if (kind === "page") {
    const wpPage = await getPageBySlug(segments[0]);
    if (!wpPage) notFound();
    return <PageView page={wpPage} />;
  }

  if (kind === "category") {
    const category = await getCategoryByPath(path);
    if (!category) notFound();
    const { data: posts, headers } = await getPostsByCategoryPaginated(
      category.id,
      page,
      ARCHIVE_PER_PAGE
    );
    // Mirror WordPress: out-of-range archive pages 404.
    if (page > 1 && posts.length === 0) notFound();
    return (
      <ArchiveView
        title={category.name}
        description={stripHtml(category.description)}
        posts={posts}
        basePath={linkToPath(category.link)}
        page={page}
        totalPages={headers.totalPages}
      />
    );
  }

  if (kind === "author") {
    const author = await getAuthorByPath(path);
    if (!author) notFound();
    const { data: posts, headers } = await getPostsByAuthorPaginated(
      author.id,
      page,
      ARCHIVE_PER_PAGE
    );
    if (page > 1 && posts.length === 0) notFound();
    return (
      <ArchiveView
        title={author.name}
        description={stripHtml(author.description)}
        posts={posts}
        basePath={linkToPath(author.link)}
        page={page}
        totalPages={headers.totalPages}
      />
    );
  }

  // tag
  const tag = await getTagByPath(path);
  if (!tag) notFound();
  const { data: posts, headers } = await getPostsByTagPaginated(
    tag.id,
    page,
    ARCHIVE_PER_PAGE
  );
  if (page > 1 && posts.length === 0) notFound();
  return (
    <ArchiveView
      title={tag.name}
      description={stripHtml(tag.description)}
      posts={posts}
      basePath={linkToPath(tag.link)}
      page={page}
      totalPages={headers.totalPages}
    />
  );
}

// --- Views ---
function PostView({ post }: { post: Post }) {
  const author = post._embedded?.author?.[0];
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Section>
      <Container>
        <Prose>
          <h1>
            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </h1>
          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>
              Published {date}
              {author?.name && (
                <>
                  {" "}
                  by{" "}
                  <span>
                    <a href={`/author/${author.slug}/`}>{author.name}</a>
                  </span>
                </>
              )}
            </h5>

            {category && (
              <Link
                href={`/posts/?category=${category.id}`}
                className={cn(
                  badgeVariants({ variant: "outline" }),
                  "no-underline!"
                )}
              >
                {category.name}
              </Link>
            )}
          </div>
          {featuredMedia?.source_url && (
            <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover"
                src={featuredMedia.source_url}
                alt={post.title.rendered}
              />
            </div>
          )}
        </Prose>

        <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </Container>
    </Section>
  );
}

function PageView({ page }: { page: WPPage }) {
  return (
    <Section>
      <Container>
        <Prose>
          <h2>{page.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </Prose>
      </Container>
    </Section>
  );
}

function ArchiveView({
  title,
  description,
  posts,
  basePath,
  page,
  totalPages,
}: {
  title: string;
  description: string;
  posts: Post[];
  basePath: string;
  page: number;
  totalPages: number;
}) {
  // Mirror WordPress archive pagination: /{archive}/page/N/ (page 1 is bare).
  // basePath already ends with a trailing slash.
  const pageUrl = (n: number) => (n > 1 ? `${basePath}page/${n}/` : basePath);

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          <Prose>
            <h2>{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </Prose>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
              <p>No posts found</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center py-8">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={pageUrl(page - 1)} />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <span className="px-4 text-sm">
                      Page {page} of {totalPages}
                    </span>
                  </PaginationItem>
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={pageUrl(page + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
