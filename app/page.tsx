// Craft Imports
import { Container, Prose } from "@/components/craft";

import { getPostsPaginated } from "@/lib/wordpress";
import { PostCard } from "@/components/posts/post-card";

// This page is using the craft.tsx component and design system
export default async function Home() {
  const { data: posts } = await getPostsPaginated(1, 30);

  return (
    <Container>
      <Prose>
        <h1>
          Системный Блокъ
        </h1>
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
            <p>No posts found</p>
          </div>
        )}
      </Prose>
    </Container>
  );
}