import { getAllPages, getPageBySlug } from "@/lib/wordpress";
import { Container, Section } from "@/components/craft";
import { siteConfig } from "@root/site.config";

import type { Metadata } from "next";
import HtmlRenderer from "@/components/HtmlRenderer";

// Revalidate pages every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await getAllPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

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
    : page.content.rendered
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 200) + "...";
  ogUrl.searchParams.append("description", description);

  return {
    title: page.title.rendered,
    description: description,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: page.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/${page.slug}`,
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

  if (!page) {
    return null;
  }

  return (
    <Section>
      <Container>
        <HtmlRenderer
          htmlContent={page.content.rendered}
          className="page-content max-w-4xl mx-auto"
          debug={true}
        />
      </Container>
    </Section>
  );
}
