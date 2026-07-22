import { Section, Container, Prose } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";
import { getPostsPaginated } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";

import Link from "next/link";

export const revalidate = 3600;

export default async function Home() {
  const { data: posts } = await getPostsPaginated(1, 12);

  return (
    <Section>
      <Container className="space-y-12">
        <Prose>
          <h1>{siteConfig.site_name}</h1>
          <p className="text-muted-foreground">{siteConfig.site_description}</p>
          <Button asChild>
            <Link href="/posts">Browse all posts</Link>
          </Button>
        </Prose>

        <div className="space-y-6 not-prose">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">Latest Posts</h2>
            <Link
              href="/posts"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              View all
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
              <p className="text-muted-foreground">No posts available yet.</p>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
