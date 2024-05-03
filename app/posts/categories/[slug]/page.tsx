import {
  getCategoryById,
  getCategoryBySlug,
  getPostsByCategorySlug,
  getTagBySlug,
} from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";
import BackButton from "@/components/back";

export default async function Page({ params }: { params: { slug: string } }) {
  const posts = await getPostsByCategorySlug(params.slug);
  const category = await getCategoryBySlug(params.slug);

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>Posts by Category: {category.slug}</h2>
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
