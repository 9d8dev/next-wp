/**
 * URL Rewriter - Converts WordPress URLs to Next.js relative URLs
 * Replaces WordPress domain references with relative paths for internal navigation
 */

/**
 * Rewrite WordPress URLs in HTML content to Next.js relative URLs
 * Only rewrites navigation links (href), not media (src)
 * Example: https://nextwp-cms.phucbm.com/about-us/ → /about-us
 */
export function rewriteWpUrls(html: string): string {
  const wpUrl = process.env.WORDPRESS_URL?.replace(/\/$/, ""); // Remove trailing slash

  if (!wpUrl) {
    return html;
  }

  // Create regex to match WordPress URLs in href attributes only
  // Matches: https://nextwp-cms.phucbm.com/path/to/page or http://...
  const wpDomain = new URL(wpUrl).hostname;
  const wpProtocol = new URL(wpUrl).protocol; // includes ':'

  // Pattern to match WordPress URLs in href only (navigation links)
  // Does NOT match src (media served from WordPress)
  const regex = new RegExp(
    `href="${wpProtocol}//${wpDomain}([^"]*)"`,
    "g"
  );

  return html.replace(regex, (_match, path) => {
    // Extract just the path, removing trailing slash for cleaner URLs
    const cleanPath = path.replace(/\/$/, "") || "/";

    return `href="${cleanPath}"`;
  });
}

/**
 * Rewrite WordPress URLs in plain text content
 * Replaces WordPress domain with frontend site domain
 * IMPORTANT: Does NOT replace media URLs (/wp-content/uploads, /wp-json, etc.)
 * Example: https://nextwp-cms.phucbm.com/about → https://example.com/about
 */
export function rewriteWpUrlInText(text: string): string {
  const wpUrl = process.env.WORDPRESS_URL?.replace(/\/$/, "");
  const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");

  if (!wpUrl || !siteUrl) {
    return text; // Missing config, return as is
  }

  // Replace WordPress domain with frontend site URL
  // Handles various URL patterns: https://, http://, with/without trailing slash
  const wpDomain = new URL(wpUrl).hostname;
  const wpProtocol = new URL(wpUrl).protocol; // includes ':'

  // Pattern to match WordPress URLs in plain text, but exclude media paths
  // Matches: https://nextwp-cms.phucbm.com/path or http://...
  // Does NOT match: /wp-content/, /wp-json/, /wp-includes/
  const regex = new RegExp(
    `${wpProtocol}//${wpDomain}(/(?!wp-content|wp-json|wp-includes)[^\\s"]*)`,
    "g"
  );

  return text.replace(regex, (_match, path) => {
    // Clean path (remove trailing slash for consistency)
    const cleanPath = path.replace(/\/$/, "") || "/";
    return `${siteUrl}${cleanPath}`;
  });
}

/**
 * Check if a URL is internal (belongs to WordPress site)
 */
export function isInternalUrl(url: string): boolean {
  const wpUrl = process.env.WORDPRESS_URL?.replace(/\/$/, "");

  if (!wpUrl) {
    return false;
  }

  return url.startsWith(wpUrl);
}
