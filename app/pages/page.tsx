import { getAllPages } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";

import BackButton from "@/components/back";
import Link from "next/link";

export default async function Page() {
  const pages = await getAllPages();

  return (
    <Section>
      <Container className="space-y-6">
        <h2 className="sr-only">All Pages</h2>
        <BackButton />
        <Prose>
          <ul className="grid">
            {pages.map((page: any) => (
              <li key={page.id}>
                <Link href={`pages/${page.slug}`}>{page.title.rendered}</Link>
              </li>
            ))}
          </ul>
        </Prose>
      </Container>
    </Section>
  );
}
