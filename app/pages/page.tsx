import { getAllPages } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Pages",
  description: "Browse all pages of our blog posts",
  alternates: {
    canonical: "/posts/pages",
  },
};

export default async function Page() {
  const pages = await getAllPages();

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Pages</h2>
<<<<<<< HEAD
          <ul className="grid">
            {pages.map((page: any) => (
              <li key={page.id}>
                <Link href={`/pages/${page.slug}`}>{page.title.rendered}</Link>
              </li>
            ))}
          </ul>
=======
          {pages.length > 0 ? (
            <ul className="grid">
              {pages.map((page: any) => (
                <li key={page.id}>
                  <Link href={`/pages/${page.slug}`}>{page.title.rendered}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pages available at the moment.</p>
          )}
>>>>>>> f133120680d25d867feaf326f1bd5d473b277128
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
