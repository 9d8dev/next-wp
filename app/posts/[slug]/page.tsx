import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPosts,
} from "@/lib/wordpress";

import { Section, Container, Article, Prose } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";
import Balancer from "react-wrap-balancer";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return {};
    }

    const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
    ogUrl.searchParams.append("title", post.title.rendered);
    // Strip HTML tags for description
    const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
    ogUrl.searchParams.append("description", description);

    return {
      title: post.title.rendered,
      description: description,
      openGraph: {
        title: post.title.rendered,
        description: description,
        type: "article",
        url: `${siteConfig.site_domain}/posts/${post.slug}`,
        images: [
          {
            url: ogUrl.toString(),
            width: 1200,
            height: 630,
            alt: post.title.rendered,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title.rendered,
        description: description,
        images: [ogUrl.toString()],
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  try {
    const post = await getPostBySlug(slug);
    
    let featuredMedia = null;
    try {
      if (post.featured_media) {
        featuredMedia = await getFeaturedMediaById(post.featured_media);
      }
    } catch (error) {
      console.error('Error fetching featured media:', error);
    }

    let author = null;
    try {
      if (post.author) {
        author = await getAuthorById(post.author);
      }
    } catch (error) {
      console.error('Error fetching author:', error);
    }

    let category = null;
    try {
      if (post.categories?.[0]) {
        category = await getCategoryById(post.categories[0]);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }

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
              <Balancer>
                <span
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                ></span>
              </Balancer>
            </h1>
            <div className="flex justify-between items-center gap-4 text-sm mb-4">
              <h5>
                Published {date}
                {author?.name && (
                  <span>
                    {" "}by{" "}
                    <a href={`/posts/?author=${author.id}`}>{author.name}</a>
                  </span>
                )}
              </h5>

              {category && (
                <Link
                  href={`/posts/?category=${category.id}`}
                  className={cn(
                    badgeVariants({ variant: "outline" }),
                    "!no-underline"
                  )}
                >
                  {category.name}
                </Link>
              )}
            </div>
            {featuredMedia?.source_url && (
              <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
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
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}
