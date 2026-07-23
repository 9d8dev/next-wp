# Cutover checklist — Next.js takes over www.gujrera.com

**Target architecture**
- `www.gujrera.com` → this Next.js app (public site)
- `urwdy.gujrera.com` → WordPress (headless content management only)

**Why no redirects are needed:** routing mirrors WordPress permalinks and
`linkToPath()` strips the origin, so the Next app serves the *same paths* the old
WordPress site served at www (`/news/{slug}/`, `/p/{city}/{slug}/`,
`/category/…/`, `/tag/…/`, `/author/…/`, `/{page-slug}/`). SEO carries over intact.

## Steps

- [ ] **1. Finish the content image fix.** Post content must not reference
      `www.urwdy.gujrera.com` (that host does not resolve):
      ```bash
      wp search-replace 'www.urwdy.gujrera.com' 'urwdy.gujrera.com' --all-tables --precise
      wp cache flush
      ```
      Verify: no `www.urwdy` occurrences remain in `/wp-json/wp/v2/posts` content.

- [ ] **2. Point DNS.** `www.gujrera.com` → the Next.js deployment.
      Keep `urwdy.gujrera.com` → WordPress.

- [ ] **3. Update the frontend domain** in `site.config.ts`:
      ```ts
      site_domain: "https://www.gujrera.com"
      ```
      This drives canonical URLs, OpenGraph URLs, and the sitemap. **Do this at
      cutover, not before** — otherwise canonicals point at a domain the app
      doesn't serve yet.

- [ ] **4. Repoint the revalidation webhook** (WordPress → Next) to
      `https://www.gujrera.com/api/revalidate`, and set a real
      `WORDPRESS_WEBHOOK_SECRET` in both WordPress and the deployment env
      (currently a placeholder, so instant revalidation is not active — content
      otherwise refreshes within 1 hour via `CACHE_TTL`).

- [ ] **5. Submit the sitemap** at `https://www.gujrera.com/sitemap.xml`
      (4,346 URLs) in Search Console.

## Already handled

- `/admin` redirects to `${WORDPRESS_URL}/wp-admin` (i.e. urwdy), so editors keep
  working with no change.
- Env vars `WORDPRESS_URL` + `WORDPRESS_HOSTNAME` both point at urwdy. **Keep them
  in sync** — the hostname drives `next/image` `remotePatterns`; if it drifts,
  every featured image 400s.
- No post content references `www.gujrera.com`, so nothing breaks when that
  domain stops being WordPress (verified across a 100-post sample).
- The "GujRERA Portal" CTA was removed from the header/footer — it pointed at
  `www.gujrera.com` and would have become a circular self-link.
