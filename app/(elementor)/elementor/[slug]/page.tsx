// app/elementor/[slug]/page.tsx
import { getPageBySlug } from "@/lib/wordpress";
import ElementorRendererImproved from "@/components/elementor/ElementorRendererImproved";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ElementorRenderer from "@/components/elementor/ElementorRenderer";
import { getNormalizedElementorAssets } from "@/lib/elementorfiles";
import { Header } from "@/components/elementor/nav/header";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } =  await params;
  try {
    const page = await getPageBySlug(slug);

    if (!page) {
      return {
        title: "Page Not Found",
        description: "The requested page could not be found.",
      };
    }

    // Clean HTML from content for description
    const cleanDescription = page.content.rendered
      .replace(/<[^>]*>/g, '')
      .substring(0, 160)
      .trim();

    return {
      title: page.title.rendered,
      description: cleanDescription || `View ${page.title.rendered} page`,
      alternates: {
        canonical: `/elementor/${slug}`,
      },
      openGraph: {
        title: page.title.rendered,
        description: cleanDescription,
        type: 'website',
        url: `/elementor/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Error Loading Page",
      description: "There was an error loading this page.",
    };
  }
}

export default async function ElementorPage({ params }: Props) {
  const { slug } = await params;
  console.log(slug)

  try {
    const page = await getPageBySlug(slug);
    const assets = await getNormalizedElementorAssets(page.id);
    // console.log("assets", assets)
    console.log("page id")

    if (!page) {
      notFound();
    }

    return (
      <>
        {/* <ElementorRendererImproved page={page} /> */}
        <div className={`${assets.bodyClasses}`}>
          <ElementorRenderer page={page} assets={assets} />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading Elementor page:', error);
    return (
      <div className="error-container p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Page</h1>
        <p className="text-gray-600">There was an error loading this page. Please try again later.</p>
      </div>
    );
  }
}


// export default function page(){
//   return (
//     <>
//       <h1>Hello World</h1>
//     </>
//   )
// }