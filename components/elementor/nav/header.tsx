import { getNormalizedElementorAssets } from "@/lib/elementorfiles";
import Script from "next/script";


export async function Header() {
  const assets = await getNormalizedElementorAssets(196);
  const res = await fetch("https://cms.dapflow.com/wp-json/headless/v1/header-full");
  const data = await res.json();

  return (
    <div className={`${assets.bodyClasses}`}>
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
            src={`${item}`}
            strategy="afterInteractive"
            key={idx}
          />
        ))
      }
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  )
}