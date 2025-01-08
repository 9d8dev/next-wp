import { getAllPages } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";

import BackButton from "@/components/back";
import Link from "next/link";

export default async function Page() {
  const pages = await getAllPages();

  return (
    <Section>
      <Container className="space-y-6">
        <h2>All Pages</h2>
        <BackButton />
        <div className="grid craft">
          {pages.map((page: any) => (
            <Link key={page.id} href={`pages/${page.slug}`}>
              {page.title.rendered}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
