"use client";

import Script from "next/script";

export default function ElementorFullScripts() {
  return (
    <>
      {/* 1️⃣ Elementor Pro Webpack Runtime */}
      <Script
        id="elementor-pro-webpack-runtime-js"
        src="https://cms.dapflow.com/wp-content/plugins/pro-elements/assets/js/webpack-pro.runtime.min.js?ver=3.32.1"
        strategy="afterInteractive"
      />

      {/* 2️⃣ Elementor Pro Config */}
      <Script id="elementor-pro-frontend-js-before" strategy="afterInteractive">
        {`
          var ElementorProFrontendConfig = {
            ajaxurl: "https://cms.dapflow.com/wp-admin/admin-ajax.php",
            nonce: "af73986408",
            urls: {
              assets: "https://cms.dapflow.com/wp-content/plugins/pro-elements/assets/",
              rest: "https://cms.dapflow.com/wp-json/"
            },
            settings: { lazy_load_background_images: true },
            popup: { hasPopUps: false },
            shareButtonsNetworks: { /* truncated for brevity, use full config */ },
            facebook_sdk: { lang: "en_US", app_id: "" },
            lottie: { defaultAnimationUrl: "https://cms.dapflow.com/wp-content/plugins/pro-elements/modules/lottie/assets/animations/default.json" }
          };
        `}
      </Script>

      {/* 3️⃣ Elementor Pro Frontend Script */}
      <Script
        id="elementor-pro-frontend-js"
        src="https://cms.dapflow.com/wp-content/plugins/pro-elements/assets/js/frontend.min.js?ver=3.32.1"
        strategy="afterInteractive"
      />

      {/* 4️⃣ Elementor Pro Elements Handlers */}
      <Script
        id="pro-elements-handlers-js"
        src="https://cms.dapflow.com/wp-content/plugins/pro-elements/assets/js/elements-handlers.min.js?ver=3.32.1"
        strategy="afterInteractive"
      />

      {/* 5️⃣ Elementor Frontend Config */}
      <Script id="elementor-frontend-js-before" strategy="afterInteractive">
        {`
          var elementorFrontendConfig = {
            environmentMode: { edit:false, wpPreview:false, isScriptDebug:false },
            i18n: { /* truncated for brevity, use full config */ },
            is_rtl: false,
            breakpoints: { xs:0, sm:480, md:768, lg:1025, xl:1440, xxl:1600 },
            responsive: { /* full responsive breakpoints */ },
            version: "3.32.4",
            urls: {
              assets: "https://cms.dapflow.com/wp-content/plugins/elementor/assets/",
              ajaxurl: "https://cms.dapflow.com/wp-admin/admin-ajax.php",
              uploadUrl: "https://cms.dapflow.com/wp-content/uploads"
            },
            post: { id: 100, title: "superr%20-%20cms.dapflow.com", excerpt:"", featuredImage:false }
          };
        `}
      </Script>
    </>
  );
}
