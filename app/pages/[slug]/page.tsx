import { getPageBySlug } from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", page.title.rendered);
  // Strip HTML tags for description and limit length
  const description = page.excerpt?.rendered
    ? page.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
    : page.content.rendered.replace(/<[^>]*>/g, "").trim().slice(0, 200) + "...";
  ogUrl.searchParams.append("description", description);

  return {
    title: page.title.rendered,
    description: description,
    openGraph: {
      title: page.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/pages/${page.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: page.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  return (
    <Section className="craft spaced">
      <Container className="space-y-6">
        <h2>{page.title.rendered}</h2>
        <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </Container>
    </Section>
  );
}
