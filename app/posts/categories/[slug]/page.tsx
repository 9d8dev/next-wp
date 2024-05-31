import { getCategoryBySlug, getPostsByCategorySlug } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import Link from "next/link";
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
