import { siteConfig } from "@/site.config";
import type { Metadata } from "next";

interface ContentMetadataOptions {
  title: string;
  description: string;
  /** Canonical site path (mirrors the WordPress permalink), e.g. "/news/foo/". */
  path: string;
}

export function generateContentMetadata({
  title,
  description,
  path,
}: ContentMetadataOptions): Metadata {
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", title);
  ogUrl.searchParams.append("description", description);

  const canonicalUrl = `${siteConfig.site_domain}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
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

// Decode the HTML entities WordPress leaves in rendered strings (e.g. &#8211;,
// &gt;) so plain-text excerpts/descriptions/names read correctly.
export function decodeHtml(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&(?:rsquo|lsquo|apos);/g, "'")
    .replace(/&(?:rdquo|ldquo|quot);/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export function stripHtml(html: string): string {
  return decodeHtml(html.replace(/<[^>]*>/g, "")).trim();
}

export function truncateHtml(html: string, maxWords: number): string {
  const text = decodeHtml(html.replace(/<[^>]*>/g, "")).trim();
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
