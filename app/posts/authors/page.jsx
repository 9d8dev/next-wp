import { getAllAuthors } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import Link from "next/link";
import BackButton from "@/components/back";

export async function generateMetadata() {
  return {
    title: "All Authors",
    description: "Browse all authors on the site.",
  };
}

export default async function Page() {
  const authors = await getAllAuthors();

  return (
    <Section>
      <Container>
        <BackButton />
        <h2>All Authors</h2>
        <div className="grid">
          {authors.map((author) => (
            <Link key={author.id} href={`/posts/?author=${author.id}`}>
              {author.name}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
