import { getAllCategories } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all categories of our blog posts",
  alternates: {
    canonical: "/posts/categories",
  },
};

export default async function Page() {
  const categories = await getAllCategories();

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Categories</h2>
          {categories.length > 0 ? (
            <ul className="grid">
              {categories.map((category: any) => (
                <li key={category.id}>
                  <Link href={`/posts/?category=${category.id}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No categories available yet.</p>
          )}
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
