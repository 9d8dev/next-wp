import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import { truncateHtml } from "@/lib/metadata";
import {
  postSection,
  postDate,
  postHref,
  postImage,
  postAuthor,
} from "@/lib/magazine";

// The signature: SECTION · CITY · DATE in tracked Archivo, saffron, with a lead-in tick.
export function Dateline({
  section,
  date,
  city,
  className,
}: {
  section: string;
  date: string;
  city?: string;
  className?: string;
}) {
  const rest = [city, date].filter(Boolean) as string[];
  return (
    <div className={cn("kicker flex items-center gap-2", className)}>
      <span aria-hidden className="h-[3px] w-5 shrink-0 bg-saffron" />
      <span className="text-saffron">{section}</span>
      {rest.length > 0 && (
        <span className="text-brown/70">· {rest.join(" · ")}</span>
      )}
    </div>
  );
}

// A dangerouslySetInnerHTML title keeps WordPress entities/Gujarati intact.
function Headline({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  return (
    <h3
      className={cn("font-display leading-[1.1] break-words hyphens-none", className)}
      dangerouslySetInnerHTML={{
        __html: post.title?.rendered || "Untitled",
      }}
    />
  );
}

type Variant = "lead" | "feature" | "compact";

export function StoryCard({
  post,
  variant = "feature",
}: {
  post: Post;
  variant?: Variant;
}) {
  const href = postHref(post);
  const image = postImage(post);
  const dateline = (
    <Dateline section={postSection(post)} date={postDate(post)} />
  );

  if (variant === "compact") {
    return (
      <article className="group border-t border-line py-4 first:border-t-0">
        <Link href={href} className="block">
          {dateline}
          <Headline
            post={post}
            className="mt-1.5 text-lg font-medium group-hover:text-saffron-deep"
          />
        </Link>
      </article>
    );
  }

  if (variant === "lead") {
    const author = postAuthor(post);
    const byline = author && (
      <p className="mt-4 font-kicker text-[0.72rem] uppercase tracking-[0.09em] text-brown">
        By {author}
      </p>
    );

    // No featured image → a bold full-width typographic lead (news front-page).
    if (!image) {
      return (
        <article className="group border-l-2 border-saffron pl-5 md:pl-7">
          {dateline}
          <Link href={href} className="block">
            <Headline
              post={post}
              className="mt-3 max-w-4xl text-[1.8rem] font-semibold sm:text-5xl md:text-[3.4rem] group-hover:text-saffron-deep"
            />
          </Link>
          {post.excerpt?.rendered && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
              {truncateHtml(post.excerpt.rendered, 40)}
            </p>
          )}
          {byline}
        </article>
      );
    }

    return (
      <article className="group grid gap-6 md:grid-cols-2 md:items-center">
        <Link href={href} className="order-1 block md:order-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line bg-card">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          </div>
        </Link>
        <div className="order-2 md:order-1">
          {dateline}
          <Link href={href} className="block">
            <Headline
              post={post}
              className="mt-3 text-3xl font-semibold md:text-[2.6rem] group-hover:text-saffron-deep"
            />
          </Link>
          {post.excerpt?.rendered && (
            <p className="mt-3 max-w-prose text-[1.0625rem] leading-relaxed text-ink/80">
              {truncateHtml(post.excerpt.rendered, 32)}
            </p>
          )}
          {byline}
        </div>
      </article>
    );
  }

  // feature
  return (
    <article className="group flex flex-col">
      {image && (
        <Link href={href} className="block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line bg-card">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </Link>
      )}
      <div className={cn(image && "mt-4")}>
        {dateline}
        <Link href={href} className="block">
          <Headline
            post={post}
            className="mt-2 text-xl font-medium group-hover:text-saffron-deep"
          />
        </Link>
        {post.excerpt?.rendered && (
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            {truncateHtml(post.excerpt.rendered, 18)}
          </p>
        )}
      </div>
    </article>
  );
}
