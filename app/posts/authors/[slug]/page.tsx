import { getPostsByAuthorSlug, getAuthorBySlug } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import Link from "next/link";
import BackButton from "@/components/back";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);
  return {
    title: `Posts by Author: ${author.name}`,
    description: `Browse posts written by ${author.name}.`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const author = await getAuthorBySlug(params.slug);
  const posts = await getPostsByAuthorSlug(params.slug);

  return (
    <Section>
      <Container>
        <BackButton />
        <h2>Posts by Author: {author.name}</h2>
        <div className="grid">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/posts/${post.slug}`}>
              {post.title.rendered}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
