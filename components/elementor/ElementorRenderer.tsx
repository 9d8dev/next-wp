"use client";

import { useEffect } from "react";
import Script from "next/script";
import type {
  ElementorAssets
} from "../../lib/elementorfiles.d";
import ElementorScriptConfig from "./ElementorScriptConfig";
import type { Page } from "@/lib/wordpress.d";

interface ElementorPage {
  id: number;
  title: string;
  content: {
    rendered: string;
  };
}

interface ElementorRendererProps {
  page: Page;
  wpBaseUrl?: string;
  assets: ElementorAssets;
}

export default function ElementorRendererImprove({
  page,
  assets
}: ElementorRendererProps) {

  const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || "";
  console.log(page.slug)


  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).elementorFrontend) {
      (window as any).elementorFrontend.init();
    }
  }, [page.content.rendered]);

  return (
    <>

      {
        assets.cssFiles.map((item: string, idx: number) => (
          <link
            key={idx}
            rel="stylesheet"
            href={item}
          />
        ))
      }

      {
        assets.jsFiles.map((item: string, idx: number) => (
          <Script
            key={idx}
            src={`${item}`}
            strategy="afterInteractive"
          />
        ))
      }


      <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      <ElementorScriptConfig wpBaseUrl={wpBaseUrl} page={page} />
    </>
  );
}
