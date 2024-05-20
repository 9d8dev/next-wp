import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
} from "@/lib/wordpress";
import { Section, Container, Article, Main } from "@/components/craft";
import { Metadata } from "next";

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
  const date = new Date(post.date).toLocaleDateString();

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h1 className="pt-12">{post.title.rendered}</h1>
          <div className="text-black grid gap-4 mb-12">
            <p>
              By <a href={`/posts/authors/${author.slug}`}>{author.name}</a> |{" "}
              {date}
            </p>
          </div>
          <div className="h-96 mb-12 md:h-[560px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
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
