// components/ElementorScripts.tsx
"use client";
import Script from "next/script";

export default function ElementorScripts() {
  return (
    <>
      <Script
        src="http://localhost/hoplon-ai/wp-content/plugins/elementor/assets/js/frontend.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="http://localhost/hoplon-ai/wp-content/plugins/elementor/assets/js/frontend-modules.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="http://localhost/hoplon-ai/wp-content/plugins/elementor/assets/js/waypoints.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
