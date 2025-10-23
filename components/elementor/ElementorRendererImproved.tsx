"use client";

import { useRef, useEffect, useState } from "react";
import Script from "next/script";

interface ElementorPage {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

interface ElementorRendererProps {
  page: ElementorPage;
}

// Essential Elementor CSS files - you can customize this list based on your needs
const ESSENTIAL_CSS_FILES = [
  '/wp-content/plugins/elementor/assets/css/frontend.min.css',
  '/wp-content/plugins/elementor/assets/css/widget-image.min.css',
  '/wp-content/plugins/elementor/assets/css/widget-heading.min.css',
  '/wp-content/plugins/elementor/assets/css/widget-icon-list.min.css',
  '/wp-content/plugins/elementor/assets/css/widget-social-icons.min.css',
  '/wp-content/plugins/elementor/assets/css/widget-video.min.css',
];

// Essential Elementor JS files
const ESSENTIAL_JS_FILES = [
  '/wp-includes/js/jquery/jquery.min.js?ver=3.7.1',
  '/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1',
  '/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js',
  '/wp-content/plugins/elementor/assets/js/frontend-modules.min.js',
  '/wp-content/plugins/elementor/assets/js/naved.min.js',
];

export default function ElementorRendererImproved({ page }: ElementorRendererProps) {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Get WordPress base URL from environment or fallback
  const wpBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || 'http://localhost/hoplon-ai';

  useEffect(() => {
    // Initialize Elementor frontend when scripts are loaded and content is available
    if (scriptsLoaded && typeof window !== "undefined" && (window as any).elementorFrontend) {
      try {
        (window as any).elementorFrontend.init();
      } catch (error) {
        console.warn('Elementor frontend initialization failed:', error);
      }
    }
  }, [scriptsLoaded, page.content.rendered]);

  // Load CSS files dynamically
  useEffect(() => {
    const loadedLinks: HTMLLinkElement[] = [];

    // Load essential CSS files
    ESSENTIAL_CSS_FILES.forEach(cssFile => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${wpBaseUrl}${cssFile}`;
      link.onload = () => console.log(`Loaded: ${cssFile}`);
      link.onerror = () => console.warn(`Failed to load: ${cssFile}`);
      document.head.appendChild(link);
      loadedLinks.push(link);
    });

    // Load page-specific CSS
    const pageSpecificCSS = document.createElement('link');
    pageSpecificCSS.rel = 'stylesheet';
    pageSpecificCSS.href = `${wpBaseUrl}/wp-content/uploads/elementor/css/post-${page.id}.css`;
    pageSpecificCSS.onload = () => console.log(`Loaded page-specific CSS for page ${page.id}`);
    pageSpecificCSS.onerror = () => console.warn(`Failed to load page-specific CSS for page ${page.id}`);
    document.head.appendChild(pageSpecificCSS);
    loadedLinks.push(pageSpecificCSS);

    // Cleanup function
    return () => {
      loadedLinks.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [page.id, wpBaseUrl]);

  const handleScriptLoad = () => {
    setScriptsLoaded(true);
  };

  return (
    <div className="elementor-renderer">
      {/* Elementor Configuration */}
      <Script id="elementor-config" strategy="afterInteractive">
        {`
          window.elementorFrontendConfig = {
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
              "close": "Close"
            },
            "is_rtl": false,
            "breakpoints": { "xs": 0, "sm": 480, "md": 768, "lg": 1025, "xl": 1440, "xxl": 1600 },
            "responsive": {
              "breakpoints": {
                "mobile": { "label": "Mobile Portrait", "value": 767, "default_value": 767, "direction": "max", "is_enabled": true },
                "tablet": { "label": "Tablet Portrait", "value": 1024, "default_value": 1024, "direction": "max", "is_enabled": true }
              }
            },
            "version": "3.31.5",
            "is_static": false,
            "urls": {
              "assets": "${wpBaseUrl}/wp-content/plugins/elementor/assets/",
              "ajaxurl": "${wpBaseUrl}/wp-admin/admin-ajax.php",
              "uploadUrl": "${wpBaseUrl}/wp-content/uploads"
            },
            "kit": {
              "active_breakpoints": ["viewport_mobile", "viewport_tablet"],
              "global_image_lightbox": "yes",
              "lightbox_enable_counter": "yes",
              "lightbox_enable_fullscreen": "yes",
              "lightbox_enable_zoom": "yes",
              "lightbox_enable_share": "yes"
            },
            "post": {
              "id": ${page.id},
              "title": "${encodeURIComponent(page.title.rendered)}",
              "excerpt": "",
              "featuredImage": false
            }
          };
        `}
      </Script>

      {/* Load Essential Scripts */}
      {ESSENTIAL_JS_FILES.map((jsFile, index) => (
        <Script
          key={jsFile}
          src={`${wpBaseUrl}${jsFile}`}
          strategy={index < 2 ? "beforeInteractive" : "afterInteractive"}
          onLoad={index === ESSENTIAL_JS_FILES.length - 1 ? handleScriptLoad : undefined}
          onError={() => console.warn(`Failed to load: ${jsFile}`)}
        />
      ))}

      {/* Page Content */}
      <div 
        ref={contentRef}
        className="elementor-content"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }} 
      />
    </div>
  );
}