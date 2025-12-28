import { getAllPages } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import type { Page as WPPage } from "@/lib/wordpress.d";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Pages",
  description: "Browse all pages of our site",
  alternates: {
    canonical: "/pages",
  },
};

export default async function Page() {
  const pages = await getAllPages();

  return (
    <ArchiveList<WPPage>
      title="All Pages"
      items={pages}
      getItemHref={(p) => `/pages/${p.slug}`}
      getItemLabel={(p) => p.title.rendered}
      emptyMessage="No pages available yet."
    />
  );
}
