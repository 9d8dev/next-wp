import { siteConfig } from "@/site.config";
import type { Metadata } from "next";

interface ContentMetadataOptions {
  title: string;
  description: string;
  slug: string;
  basePath: "posts" | "pages";
}

export function generateContentMetadata({
  title,
  description,
  slug,
  basePath,
}: ContentMetadataOptions): Metadata {
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", title);
  ogUrl.searchParams.append("description", description);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteConfig.site_domain}/${basePath}/${slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}
