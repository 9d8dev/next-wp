import { getPostsByAuthorSlug, getAuthorBySlug } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import BackButton from "@/components/back";
import { Metadata } from "next";
import PostCard from "@/components/posts/post-card";

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
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
