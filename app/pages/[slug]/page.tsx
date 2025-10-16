import { getPageBySlug, getAllPages } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { BlockRenderer } from "@/lib/blocks/block-renderer";
import { siteConfig } from "@/site.config";

import type { Metadata } from "next";

// Revalidate pages every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const pages = await getAllPages();

    return pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (_err) {
    // If WP is unavailable at build time, return empty list to allow on-demand rendering
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
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
  } catch (_err) {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page: any | null = null;
  try {
    page = await getPageBySlug(slug);
  } catch (err) {
    console.warn('Page fetch failed, rendering fallback:', err instanceof Error ? err.message : err);
  }

  return (
    <>
      {page?.blocks && page.blocks.length > 0 ? (
        // Render all blocks (both custom and core) with React components
        <BlockRenderer blocks={page.blocks} />
      ) : (
        // Fallback for pages without block data
        <Section>
          <Container>
            <Prose>
              <h1>{page?.title?.rendered || slug}</h1>
              {page?.content?.rendered ? (
                <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
              ) : (
                <p>Content is currently unavailable.</p>
              )}
            </Prose>
          </Container>
        </Section>
      )}
    </>
  );
}
