import { describe, it, expect } from "vitest";
import {
  stripHtml,
  truncateHtml,
  generateContentMetadata,
} from "@/lib/metadata";

describe("stripHtml", () => {
  it("removes HTML tags", () => {
    expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe(
      "Hello world"
    );
  });

  it("trims whitespace", () => {
    expect(stripHtml("  <p>hello</p>  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(stripHtml("")).toBe("");
  });

  it("handles text without HTML", () => {
    expect(stripHtml("plain text")).toBe("plain text");
  });

  it("handles nested tags", () => {
    expect(stripHtml("<div><p><em>nested</em></p></div>")).toBe("nested");
  });
});

describe("truncateHtml", () => {
  it("truncates to max words with ellipsis", () => {
    expect(truncateHtml("<p>one two three four five</p>", 3)).toBe(
      "one two three..."
    );
  });

  it("returns full text when under limit", () => {
    expect(truncateHtml("<p>short text</p>", 10)).toBe("short text");
  });

  it("strips HTML before truncating", () => {
    expect(truncateHtml("<b>bold</b> <i>italic</i> plain", 2)).toBe(
      "bold italic..."
    );
  });

  it("handles exact word count", () => {
    expect(truncateHtml("one two three", 3)).toBe("one two three");
  });
});

describe("generateContentMetadata", () => {
  it("returns correct metadata structure", () => {
    const metadata = generateContentMetadata({
      title: "Test Post",
      description: "A test description",
      slug: "test-post",
      basePath: "posts",
    });

    expect(metadata.title).toBe("Test Post");
    expect(metadata.description).toBe("A test description");
  });

  it("builds correct OpenGraph URL", () => {
    const metadata = generateContentMetadata({
      title: "Test",
      description: "Desc",
      slug: "my-slug",
      basePath: "posts",
    });

    expect(metadata.openGraph).toBeDefined();
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og.url).toContain("/posts/my-slug");
    expect(og.type).toBe("article");
  });

  it("includes OG image with correct dimensions", () => {
    const metadata = generateContentMetadata({
      title: "Test",
      description: "Desc",
      slug: "slug",
      basePath: "pages",
    });

    const og = metadata.openGraph as Record<string, unknown>;
    const images = og.images as Array<Record<string, unknown>>;
    expect(images[0].width).toBe(1200);
    expect(images[0].height).toBe(630);
  });

  it("includes Twitter card metadata", () => {
    const metadata = generateContentMetadata({
      title: "Test",
      description: "Desc",
      slug: "slug",
      basePath: "posts",
    });

    const twitter = metadata.twitter as Record<string, unknown>;
    expect(twitter.card).toBe("summary_large_image");
    expect(twitter.title).toBe("Test");
  });

  it("encodes title and description in OG image URL", () => {
    const metadata = generateContentMetadata({
      title: "Hello & World",
      description: "A <test>",
      slug: "slug",
      basePath: "posts",
    });

    const og = metadata.openGraph as Record<string, unknown>;
    const images = og.images as Array<Record<string, unknown>>;
    const imageUrl = images[0].url as string;
    expect(imageUrl).toContain("title=Hello+%26+World");
  });
});
