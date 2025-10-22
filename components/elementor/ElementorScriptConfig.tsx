import Script from "next/script";
import type { Page } from "@/lib/wordpress.d";

interface Propstype {
  page: Page;
  wpBaseUrl: String;
}

export default function ElementorScriptConfig({ wpBaseUrl, page }: Propstype) {
  return (
    <>
      <Script id="elementor-pro-frontend-js-before" strategy="beforeInteractive">
        {`
        var ElementorProFrontendConfig = {
          "ajaxurl": "${wpBaseUrl}/wp-admin/admin-ajax.php",
          "nonce": "de0ad90f1d",
          "urls": {
            "assets": "${wpBaseUrl}/wp-content/plugins/elementor-pro/assets/",
            "rest": "${wpBaseUrl}/wp-json/"
          },
          "settings": { "lazy_load_background_images": true },
          "popup": { "hasPopUps": true },
          "shareButtonsNetworks": {
            "facebook": { "title": "Facebook", "has_counter": true },
            "twitter": { "title": "Twitter" },
            "linkedin": { "title": "LinkedIn", "has_counter": true },
            "pinterest": { "title": "Pinterest", "has_counter": true },
            "reddit": { "title": "Reddit", "has_counter": true },
            "vk": { "title": "VK", "has_counter": true },
            "odnoklassniki": { "title": "OK", "has_counter": true },
            "tumblr": { "title": "Tumblr" },
            "digg": { "title": "Digg" },
            "skype": { "title": "Skype" },
            "stumbleupon": { "title": "StumbleUpon", "has_counter": true },
            "mix": { "title": "Mix" },
            "telegram": { "title": "Telegram" },
            "pocket": { "title": "Pocket", "has_counter": true },
            "xing": { "title": "XING", "has_counter": true },
            "whatsapp": { "title": "WhatsApp" },
            "email": { "title": "Email" },
            "print": { "title": "Print" },
            "x-twitter": { "title": "X" },
            "threads": { "title": "Threads" }
          },
          "woocommerce": {
            "menu_cart": {
              "cart_page_url": "${wpBaseUrl}/cart/",
              "checkout_page_url": "${wpBaseUrl}/checkout_previous/",
              "fragments_nonce": "b812e08a02"
            }
          },
          "facebook_sdk": { "lang": "en_US", "app_id": "" },
          "lottie": {
            "defaultAnimationUrl": "${wpBaseUrl}/wp-content/plugins/elementor-pro/modules/lottie/assets/animations/default.json"
          }
        };
      `}
      </Script>
      <Script id="wp-i18n-js-after" strategy="afterInteractive">
        {`
        wp.i18n.setLocaleData({ 'text direction\\u0004ltr': ['ltr'] });
      `}
      </Script>
      <Script id="elementor-frontend-js-before" strategy="beforeInteractive">
        {`
        var elementorFrontendConfig = {
          "environmentMode": { "edit": false, "wpPreview": false, "isScriptDebug": false },
          "i18n": {
            "shareOnFacebook": "Share on Facebook",
            "shareOnTwitter": "Share on Twitter",
            "pinIt": "Pin it",
            "download": "Download",
            "downloadImage": "Download image",
            "fullscreen": "Fullscreen",
            "zoom": "Zoom",
            "share": "Share",
            "playVideo": "Play Video",
            "previous": "Previous",
            "next": "Next",
            "close": "Close",
            "a11yCarouselPrevSlideMessage": "Previous slide",
            "a11yCarouselNextSlideMessage": "Next slide",
            "a11yCarouselFirstSlideMessage": "This is the first slide",
            "a11yCarouselLastSlideMessage": "This is the last slide",
            "a11yCarouselPaginationBulletMessage": "Go to slide"
          },
          "is_rtl": false,
          "breakpoints": {
            "xs": 0, "sm": 480, "md": 768, "lg": 1025, "xl": 1440, "xxl": 1600
          },
          "responsive": {
            "breakpoints": {
              "mobile": { "label": "Mobile Portrait", "value": 767, "default_value": 767, "direction": "max", "is_enabled": true },
              "mobile_extra": { "label": "Mobile Landscape", "value": 880, "default_value": 880, "direction": "max", "is_enabled": false },
              "tablet": { "label": "Tablet Portrait", "value": 1024, "default_value": 1024, "direction": "max", "is_enabled": true },
              "tablet_extra": { "label": "Tablet Landscape", "value": 1200, "default_value": 1200, "direction": "max", "is_enabled": false },
              "laptop": { "label": "Laptop", "value": 1366, "default_value": 1366, "direction": "max", "is_enabled": false },
              "widescreen": { "label": "Widescreen", "value": 2400, "default_value": 2400, "direction": "min", "is_enabled": false }
            },
            "hasCustomBreakpoints": false
          },
          "version": "3.29.0",
          "is_static": false,
          "experimentalFeatures": {
            "e_font_icon_svg": true,
            "additional_custom_breakpoints": true,
            "container": true,
            "e_optimized_markup": true,
            "e_local_google_fonts": true,
            "theme_builder_v2": true,
            "hello-theme-header-footer": true,
            "nested-elements": true,
            "editor_v2": true,
            "e_element_cache": true,
            "home_screen": true,
            "cloud-library": true,
            "e_opt_in_v4_page": true,
            "mega-menu": true
          },
          "urls": {
            "assets": "${wpBaseUrl}/wp-content/plugins/elementor/assets/",
            "ajaxurl": "${wpBaseUrl}/wp-admin/admin-ajax.php",
            "uploadUrl": "${wpBaseUrl}/wp-content/uploads"
          },
          "nonces": { "floatingButtonsClickTracking": "b7be3fcfed" },
          "swiperClass": "swiper",
          "settings": { "page": [], "editorPreferences": [] },
          "kit": {
            "global_image_lightbox": "yes",
            "active_breakpoints": ["viewport_mobile", "viewport_tablet"],
            "lightbox_enable_counter": "yes",
            "lightbox_enable_fullscreen": "yes",
            "lightbox_enable_zoom": "yes",
            "lightbox_enable_share": "yes",
            "lightbox_title_src": "title",
            "lightbox_description_src": "description",
            "woocommerce_notices_elements": [],
            "hello_header_logo_type": "logo",
            "hello_header_menu_layout": "horizontal",
            "hello_footer_logo_type": "logo"
          },
          "post": {
            "id": ${page.id},
            "title": "${page.title}",
            "excerpt": "",
            "featuredImage": false
          }
        };
      `}
      </Script>
    </>
  );
}
