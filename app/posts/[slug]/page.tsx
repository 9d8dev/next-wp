import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress"

import { Section, Container, Article, Prose } from "@/components/craft"
import type { Metadata } from "next"
import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/site.config"

import Link from "next/link"
import Balancer from "react-wrap-balancer"
import Script from "next/script"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {}
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`)
  ogUrl.searchParams.append("title", post.title.rendered)
  // Strip HTML tags for description
  const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
  ogUrl.searchParams.append("description", description)

  return {
    title: post.yoast_head_json.og_title,
    description: post.yoast_head_json.description,
    openGraph: {
      title: post.yoast_head_json.og_title,
      description: post.yoast_head_json.og_description,
      type: "article",
      url: `${siteConfig.site_domain}/posts/${post.slug}`,
      images: [
        {
          url: post.yoast_head_json.og_image[0].url,
          width: post.yoast_head_json.og_image[0].width,
          height: post.yoast_head_json.og_image[0].height,
          alt: post.yoast_head_json.og_image[0].alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.yoast_head_json.title,
      description: post.yoast_head_json.description,
      images: [post.yoast_head_json.og_image[0].url],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null
  const author = await getAuthorById(post.author)
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const category = await getCategoryById(post.categories[0])

  return (
    <Section>
      <Script
        id="blog-schema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(post.yoast_head_json.schema),
        }}
      />
      <Container>
        <Prose>
          <h1>
            <Balancer>
              <span
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </Balancer>
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
                "!no-underline"
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

        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </Container>
    </Section>
  )
}
