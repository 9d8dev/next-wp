import { getPostsByTagSlug, getTagBySlug } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/back";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tag = await getTagBySlug(params.slug);
  return {
    title: `Posts by Tag: ${tag.name}`,
    description: `Browse posts tagged with ${tag.name}.`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const posts = await getPostsByTagSlug(params.slug);
  const tag = await getTagBySlug(params.slug);

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>Posts by Tag: {tag.name}</h2>
          <div className="grid">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                {post.title.rendered}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
