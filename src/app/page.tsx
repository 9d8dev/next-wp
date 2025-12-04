import { Container, Section } from "@/components/craft";
import { siteConfig } from "@root/site.config";
import type { Metadata } from "next";
import HtmlRenderer from "@/components/HtmlRenderer";
import { getFrontPage } from "@/lib/wp-home";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFrontPage();

  if (!page) {
    return {
      title: "Home",
      description: "Welcome to our site",
      alternates: {
        canonical: "/",
      },
    };
  }

  return {
    title: page.title.rendered,
    description: page.excerpt?.rendered
      ? page.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
      : page.content.rendered.replace(/<[^>]*>/g, "").trim().slice(0, 200) +
        "...",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: page.title.rendered,
      description: page.excerpt?.rendered
        ? page.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
        : page.content.rendered.replace(/<[^>]*>/g, "").trim().slice(0, 200) +
          "...",
      type: "website",
      url: siteConfig.site_domain,
    },
  };
}

export default async function Home() {
  const page = await getFrontPage();

  if (!page) {
    return (
      <Section>
        <Container className="max-w-4xl mx-auto">
          <div className="border border-yellow-400 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-700 rounded-lg p-8 space-y-4">
            <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100">
              ⚠️ Front Page Not Configured
            </h2>
            <p className="text-yellow-800 dark:text-yellow-200">
              To set a front page, please:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-yellow-800 dark:text-yellow-200 ml-2">
              <li>Log in to your WordPress admin</li>
              <li>Go to <strong>Settings → Reading</strong></li>
              <li>Under "Your homepage displays", select <strong>"A static page"</strong></li>
              <li>Choose a page from the dropdown and save</li>
            </ol>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 pt-4">
              Once configured, this page will display your front page content from WordPress.
            </p>
          </div>
        </Container>
      </Section>
    );
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
