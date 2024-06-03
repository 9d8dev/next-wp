import { getCategoryBySlug, getPostsByCategorySlug } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import PostCard from "@/components/posts/post-card";
import BackButton from "@/components/back";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  return {
    title: `Posts by Category: ${category.name}`,
    description: `Browse posts in the ${category.name} category.`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const posts = await getPostsByCategorySlug(params.slug);
  const category = await getCategoryBySlug(params.slug);

  return (
    <Section>
      <Container>
        <BackButton />
        <h2>Posts by Category: {category.name}</h2>
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
