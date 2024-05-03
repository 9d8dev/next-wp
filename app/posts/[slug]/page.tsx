import { getPostBySlug } from "@/lib/wordpress";
import { Section, Container, Article } from "@/components/craft";

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return (
    <Article>
      <Section>
        <Container>
          <h1>{post.title.rendered}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </Container>
      </Section>
    </Article>
  );
}
