import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.site_domain}/pages`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/authors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/categories`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/tags`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.site_domain}/posts/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticUrls, ...postUrls];
}
