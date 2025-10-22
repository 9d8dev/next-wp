// components/ElementorCSS.tsx
"use client";
import { useEffect } from "react";

export default function ElementorCSS({ pageId }: { pageId: number }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `http://localhost/hoplon-ai/wp-content/uploads/elementor/css/post-${pageId}.css`;
    link.id = `elementor-post-${pageId}-css`;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [pageId]);

  return null;
}
