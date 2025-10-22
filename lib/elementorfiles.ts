// elementorfiles.ts
// Functions to fetch Elementor CSS/JS and body classes from WordPress Headless API

import type {
  ElementorFileResponse,
  ElementorAssets,
} from "./elementorfiles.d";
import querystring from "query-string";

const baseUrl = process.env.WORDPRESS_URL;

if (!baseUrl) {
  throw new Error("WORDPRESS_URL environment variable is not defined");
}

class ElementorAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "ElementorAPIError";
  }
}

/**
 * Generic fetch wrapper for Elementor Headless API
 */
async function elementorFetch<T>(path: string, query?: Record<string, any>): Promise<T> {
  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query)}` : ""}`;
  const userAgent = "Next.js Elementor Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["elementor"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new ElementorAPIError(
      `Elementor API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

/**
 * Fetch Elementor asset info (CSS, JS, body classes)
 */
export async function getElementorFiles(pageId: number): Promise<ElementorFileResponse> {
  return elementorFetch<ElementorFileResponse>(`/wp-json/headless/v1/files-api/${pageId}`);
}

/**
 * Fetch + normalize Elementor assets for frontend rendering
 */
export async function getNormalizedElementorAssets(pageId: number): Promise<ElementorAssets> {
  const data = await getElementorFiles(pageId);

  return {
    id: data.id,
    pageUrl: data.css_files_api.page_url,
    bodyClasses: data.body_classes,
    cssFiles: data.css_files_api.css_files,
    jsFiles: data.js_files_api.js_files,
  };
}

export { ElementorAPIError };
