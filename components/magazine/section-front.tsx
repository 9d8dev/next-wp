import Link from "next/link";

import type { Post } from "@/lib/wordpress.d";
import { StoryCard, Dateline } from "@/components/magazine/story";
import { postSection, postDate, postHref } from "@/lib/magazine";

export type SectionVariant = "split" | "grid" | "numbered" | "list";

function SectionHeader({
  title,
  href,
  count,
}: {
  title: string;
  href: string;
  count?: number;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-2xl font-semibold leading-none">
          <Link href={href} className="transition-colors hover:text-saffron-deep">
            {title}
          </Link>
        </h2>
        {typeof count === "number" && count > 0 && (
          <span className="font-kicker text-[0.7rem] uppercase tracking-[0.09em] text-brown/70">
            {count.toLocaleString("en-IN")} stories
          </span>
        )}
      </div>
      <Link
        href={href}
        className="shrink-0 font-kicker text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-saffron hover:text-saffron-deep"
      >
        View all →
      </Link>
    </div>
  );
}

function NumberedItem({ post, index }: { post: Post; index: number }) {
  return (
    <li className="flex gap-4 border-t border-line pt-4">
      <span
        aria-hidden
        className="font-display text-2xl font-semibold leading-none text-saffron"
      >
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <Dateline section={postSection(post)} date={postDate(post)} />
        <Link href={postHref(post)} className="group block">
          <h3
            className="mt-1.5 font-display text-lg font-medium leading-snug break-words group-hover:text-saffron-deep"
            dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
          />
        </Link>
      </div>
    </li>
  );
}

export function SectionFront({
  title,
  href,
  posts,
  variant,
  count,
}: {
  title: string;
  href: string;
  posts: Post[];
  variant: SectionVariant;
  count?: number;
}) {
  if (posts.length === 0) return null;

  return (
    <section>
      <SectionHeader title={title} href={href} count={count} />

      {variant === "grid" && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StoryCard key={post.id} post={post} variant="feature" />
          ))}
        </div>
      )}

      {variant === "split" && (
        <div className="grid gap-8 md:grid-cols-2">
          <StoryCard post={posts[0]} variant="feature" />
          <div className="flex flex-col">
            {posts.slice(1).map((post) => (
              <StoryCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {variant === "numbered" && (
        <ol className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {posts.map((post, i) => (
            <NumberedItem key={post.id} post={post} index={i + 1} />
          ))}
        </ol>
      )}

      {variant === "list" && (
        <div className="grid gap-x-10 sm:grid-cols-2">
          {posts.map((post) => (
            <StoryCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      )}
    </section>
  );
}
