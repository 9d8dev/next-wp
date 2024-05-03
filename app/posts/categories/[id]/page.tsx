import { getPostsByCategory, getTagById } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";

export default async function Page({ params }: { params: { id: number } }) {
  const posts = await getPostsByCategory(params.id);
  const category = await getTagById(params.id);

  return (
    <Main>
      <Section>
        <Container>
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
    </Main>
  );
}
