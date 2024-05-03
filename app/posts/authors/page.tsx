import { getAllAuthors } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";
import BackButton from "@/components/back";

export default async function Page() {
  const authors = await getAllAuthors();

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>All Authors</h2>
          <div className="grid">
            {authors.map((author: any) => (
              <Link key={author.id} href={`authors/${author.slug}`}>
                {author.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
