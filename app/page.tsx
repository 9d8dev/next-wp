// Craft Imports
import { Container, Prose } from "@/components/craft";

import { getCategoryBySlug, getPostsPaginated } from "@/lib/wordpress";
import { PostCard } from "@/components/posts/post-card";
import { NewsCarousel } from "@/components/carousel/news-carousel";

// This page is using the craft.tsx component and design system
export default async function Home() {
  const newsCategory = await getCategoryBySlug("news");

  // Получаем новости и остальные посты параллельно
  const [newsResponse, postsResponse] = await Promise.all([
    getPostsPaginated(1, 10, { categories: newsCategory.id }),
    getPostsPaginated(1, 30, { categories_exclude: newsCategory.id }),
  ]);

  const { data: newsPosts } = newsResponse;
  const { data: posts } = postsResponse;

  // Трансформируем посты WordPress в формат для карусели
  const newsItems = newsPosts.map((post) => ({
    id: post.id,
    title: post.title || "Untitled Post",
    description: post.excerpt
      ? post.excerpt.split(" ").slice(0, 24).join(" ").trim() + "..."
      : "No excerpt available",
    image: post.featuredMedia?.sourceUrl || "/images/placeholder.jpg",
    date: post.date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    url: `/posts/${post.slug}`,
  }));

  return (
    <Container>
      <Prose>
        <h1>Системный Блокъ </h1>
      </Prose>

      {/* Секция с новостями в карусели */}
      {newsItems.length > 0 && (
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">Последние новости</h2>
          <NewsCarousel news={newsItems} />
        </div>
      )}
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
    </Container>
  );
}
