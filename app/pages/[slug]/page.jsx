import { getPageBySlug } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import BackButton from "@/components/back";

export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.slug);
  return {
    title: page.title.rendered,
    description: page.excerpt.rendered,
  };
}

export default async function Page({ params }) {
  const page = await getPageBySlug(params.slug);

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
