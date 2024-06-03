import { getPostsByTagSlug, getTagBySlug } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import PostCard from "@/components/posts/post-card";

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
    <Section>
      <Container>
        <BackButton />
        <h2>Posts by Tag: {tag.name}</h2>
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
