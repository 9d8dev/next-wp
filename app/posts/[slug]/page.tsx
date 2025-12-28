import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPostSlugs,
} from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article, Prose } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return generateContentMetadata({
    title: post.title.rendered,
    description: stripHtml(post.excerpt.rendered),
    slug: post.slug,
    basePath: "posts",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = await getCategoryById(post.categories[0]);

  return (
    <Section>
      <Container>
        <Prose>
          <h1>
            <span
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              ></span>
          </h1>
          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>
              Published {date} by{" "}
              {author.name && (
                <span>
                  <a href={`/posts/?author=${author.id}`}>{author.name}</a>{" "}
                </span>
              )}
            </h5>

            <Link
              href={`/posts/?category=${category.id}`}
              className={cn(
                badgeVariants({ variant: "outline" }),
                "no-underline!"
              )}
            >
              {category.name}
            </Link>
          </div>
          {featuredMedia?.source_url && (
            <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              {/* eslint-disable-next-line */}
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
