import { getAllAuthors } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Authors",
  description: "Browse all authors of our blog posts",
  alternates: {
    canonical: "/posts/authors",
  },
};

export default async function Page() {
  const authors = await getAllAuthors();

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Authors</h2>
          {authors.length > 0 ? (
            <ul className="grid">
              {authors.map((author: any) => (
                <li key={author.id}>
                  <Link href={`/posts/?author=${author.id}`}>{author.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No authors available yet.</p>
          )}
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
