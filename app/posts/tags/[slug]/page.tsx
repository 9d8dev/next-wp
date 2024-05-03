import { getPostsByTagSlug, getTagBySlug } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";
import BackButton from "@/components/back";

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
