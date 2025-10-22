// components/ElementorContent.tsx
"use client";
import { useEffect } from "react";

export default function ElementorContent({ content }: { content: string }) {
  useEffect(() => {
    if ((window as any).elementorFrontend) {
      (window as any).elementorFrontend.init();
    }
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
