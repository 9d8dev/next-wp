import { getPageBySlug } from "@/lib/wordpress";
import { Section, Container, Main } from "@/components/craft";
import { Metadata } from "next";

import BackButton from "@/components/back";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return {
    title: page.title.rendered,
    description: page.excerpt.rendered,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  return (
    <Section>
      <Container>
        <BackButton />
        <h1 className="pt-12">{page.title.rendered}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </Container>
    </Section>
  );
}
