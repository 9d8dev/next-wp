import { getAllPosts } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <Main>
      <Section>
        <Container>
          <h1>Posts</h1>
          <div className="grid">
            <Link href="/posts/tags">Tags</Link>
            <Link href="/posts/categories">Categories</Link>
            <Link href="/posts/authors">Authors</Link>
          </div>

          <h2>All Posts</h2>
          <div className="grid">
            {posts.map((post: any) => (
              <Link key={post.id} href={`posts/${post.slug}`}>
                {post.title.rendered}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
