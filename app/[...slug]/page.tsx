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
import { generateContentMetadata, stripHtml, decodeHtml } from "@/lib/metadata";

import { StoryCard, Dateline } from "@/components/magazine/story";
import {
  postSection,
  postDate,
  postImage,
  postAuthor,
} from "@/lib/magazine";

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
// WordPress content often repeats the title as an <h1>; drop the first one since
// the page already renders the title in the magazine header.
function stripLeadingH1(html: string): string {
  return html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
}

function PostView({ post }: { post: Post }) {
  const authorName = postAuthor(post);
  const authorSlug = post._embedded?.author?.[0]?.slug;
  const image = postImage(post);

  return (
    <article className="mx-auto max-w-3xl px-6 py-10 md:py-14">
      <Dateline section={postSection(post)} date={postDate(post)} />
      <h1
        className="mt-4 font-display text-[2rem] font-semibold leading-[1.08] break-words sm:text-4xl md:text-5xl"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      {authorName && (
        <p className="mt-5 border-t border-line pt-4 font-kicker text-[0.72rem] uppercase tracking-[0.09em] text-brown">
          By{" "}
          {authorSlug ? (
            <a
              href={`/author/${authorSlug}/`}
              className="hover:text-saffron-deep"
            >
              {authorName}
            </a>
          ) : (
            authorName
          )}
        </p>
      )}

      {image && (
        <figure className="my-8 overflow-hidden rounded-sm border border-line bg-card md:my-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="max-h-[540px] w-full object-cover"
          />
        </figure>
      )}

      <div
        className="prose prose-lg mt-8 max-w-none"
        dangerouslySetInnerHTML={{
          __html: stripLeadingH1(post.content.rendered),
        }}
      />
    </article>
  );
}

function PageView({ page }: { page: WPPage }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-10 md:py-14">
      <h1 className="font-display text-[2rem] font-semibold leading-[1.08] break-words sm:text-4xl md:text-5xl">
        {page.title.rendered}
      </h1>
      <div
        className="prose prose-lg mt-8 max-w-none"
        dangerouslySetInnerHTML={{
          __html: stripLeadingH1(page.content.rendered),
        }}
      />
    </article>
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
  const pageUrl = (n: number) => (n > 1 ? `${basePath}page/${n}/` : basePath);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
      <header className="border-b-2 border-ink pb-4">
        <p className="kicker text-brown">
          Archive{page > 1 ? ` · Page ${page}` : ""}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold break-words md:text-5xl">
          {decodeHtml(title)}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/75">
            {description}
          </p>
        )}
      </header>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StoryCard key={post.id} post={post} variant="feature" />
          ))}
        </div>
      ) : (
        <p className="mt-10 border-t border-line pt-8 text-brown">
          No stories filed here yet.
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
