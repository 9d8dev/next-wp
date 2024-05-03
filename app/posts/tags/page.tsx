import { getAllTags } from "@/lib/wordpress";
import { Main, Section, Container } from "@/components/craft";
import Link from "next/link";
import BackButton from "@/components/back";

export default async function Page() {
  const tags = await getAllTags();

  return (
    <Main>
      <Section>
        <Container>
          <BackButton />
          <h2>All Tags</h2>
          <div className="grid">
            {tags.map((tag: any) => (
              <Link key={tag.id} href={`tags/${tag.id}`}>
                {tag.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
