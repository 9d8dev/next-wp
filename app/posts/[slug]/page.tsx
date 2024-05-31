import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";

import { Section, Container, Article, Main } from "@/components/craft";
import { Metadata } from "next";
import { badgeVariants } from "@/components/ui/badge";

import Link from "next/link";
import Balancer from "react-wrap-balancer";
import BackButton from "@/components/back";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title.rendered,
    description: post.excerpt.rendered,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const featuredMedia = await getFeaturedMediaById(post.featured_media);
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = await getCategoryById(post.categories[0]);

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h1 className="pt-12">
            <Balancer>{post.title.rendered}</Balancer>
          </h1>

          <h5 className="mb-12 text-sm">
            Published {date} by{" "}
            {author.name && (
              <span>
                <a href={`/posts/authors/${author.slug}`}>{author.name}</a>{" "}
              </span>
            )}
          </h5>

          <div className="h-96 mb-12 md:h-[560px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
            {/* eslint-disable-next-line */}
            <img
              className="w-full"
              src={featuredMedia.source_url}
              alt={post.title.rendered}
            />
          </div>
          <Article
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </Container>
      </Section>
    </Main>
  );
}
