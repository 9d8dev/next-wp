import { getAllPosts } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import PostCard from "@/components/posts/post-card";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <Main>
      <Section>
        <Container>
          <h1>Posts</h1>
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
