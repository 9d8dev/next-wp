# Plan: Mirror WordPress URL Structure in Next.js

**Goal:** Make the Next.js frontend (`next.gujrera.com`) use the exact same URL
structure as the live WordPress site (`www.gujrera.com`).

**Decisions (locked):**
- **Deployment:** Runs *alongside* WordPress (not replacing www yet) → match URL
  structure for consistency; SEO-preserving 301 redirects from old routes are
  **not** required.
- **Rendering:** On-demand + cache (ISR). Pre-render only recent posts; the rest
  render on first visit and cache. All posts still enumerated in the sitemap.
- **Trailing slash:** `trailingSlash: true` — match WordPress exactly.

---

## Live WordPress URL structure (source of truth)

Verified against the public REST API (`link` field is authoritative):

| Content  | WordPress permalink                          | Rule                                            |
|----------|----------------------------------------------|-------------------------------------------------|
| Home     | `/`                                          | —                                               |
| Post     | `/{full-category-path}/{slug}/`              | e.g. `/news/x/`, `/guide/x/`, `/p/ahmedabad/x/` |
| Page     | `/{slug}/`                                   | root-level; all 20 pages are single-segment     |
| Category | `/category/{full-path}/`                     | nested, e.g. `/category/tp-schemes/ahmedabad-tp/` |
| Tag      | `/tag/{slug}/`                               | flat                                            |

**Facts from research:**
- No custom post types (only `post` + `page`).
- **4340 posts**, 20 pages, 60 categories, 338 tags.
- Post URLs expand the **full nested category path**.
- Multi-category posts pick the **lowest term-ID** category (`[374,1]`→`/uncategorized/`,
  `[127,374]`→`/guides/`) — unless Yoast "primary category" overrides.
- No hierarchical (child) pages → a single segment is unambiguously a page.

**Core design decision:** Use the REST API `link` field as the single source of
truth for URL generation, and resolve incoming URLs by *last-segment slug lookup +
`link` verification*. This is correct by construction and immune to the Yoast
primary-category edge case (no permalink reconstruction needed).

---

## Routing architecture

Next.js can't mix `[slug]` and `[...slug]` siblings, and posts/pages/categories
share the root namespace, so use **one optional catch-all** dispatcher:

```
app/
  page.tsx                    → home
  [[...slug]]/page.tsx        → dispatcher:
       segments[0] === "category"           → category archive (verify, list, paginate)
       segments[0] === "tag"                → tag archive
       length === 1 && matches a page slug  → PAGE
       length >= 2                          → POST (last segment = slug, verify link === path)
       no match                             → notFound()
  api/…, sitemap.ts, robots, og            → unchanged (static segments win over catch-all)
```

Resolution (1 API call each):
- **Post:** `GET /posts?slug={last}&_embed` → compare `link` path to request path.
- **Page:** `GET /pages?slug={slug}&_embed`.
- **Category/Tag:** `GET /categories?slug={last}` (or tags) → verify `link` → list posts.

---

## Tasks & sub-tasks

### 1. Config
- [x] 1.1 Add `trailingSlash: true` to `next.config.ts`.

### 2. Data layer (`lib/wordpress.ts`)  ✅ DONE
- [x] 2.1 Add `linkToPath(link)` helper (+ `pathToSegments`) — normalize leading/trailing slash.
- [x] 2.2 Extend `getAllPostsForSitemap()` to include `path` (from `link`) alongside `modified`.
- [x] 2.3 Add `getPostByPath(path)` — last-segment slug lookup + `link` verification.
- [x] 2.4 Add `getCategoryByPath(path)` and `getTagByPath(path)`.
- [x] 2.5 Add `getRecentPostPaths(limit)` + `getAllPagePaths()` for `generateStaticParams`.

Validated against live API: posts (flat + nested category), pages, nested
categories, and tags all resolve correctly via trailing-slug + link verification.

### 3. New routing dispatcher (`app/[...slug]/page.tsx`)  ✅ DONE
> Note: used a **required** catch-all `[...slug]` (not optional `[[...slug]]`) so
> `app/page.tsx` keeps handling `/` without a route conflict.
- [x] 3.1 Create the catch-all with the dispatch order above.
- [x] 3.2 Category branch: verify slug, list + paginate posts (pagination via `?page=`).
- [x] 3.3 Tag branch: verify slug, list + paginate posts.
- [x] 3.4 Page branch (single segment).
- [x] 3.5 Post branch (>=2 segments, verify `link` === path).
- [x] 3.6 `generateStaticParams`: recent ~100 posts + all 20 pages.
- [x] 3.7 `export const dynamicParams = true`.
- [x] 3.8 `generateMetadata`: canonical (`alternates.canonical`) + OG from `link` path.

Verified live: post (flat + nested category), page, nested category archive
(+ pagination), and tag all return 200 with correct content and canonical URLs;
bogus post/page paths correctly 404. Also updated `lib/metadata.ts`
(`generateContentMetadata` now takes `path`) and its tests; deleted the old
`app/posts/[slug]` and `app/pages/[slug]` routes (replaced by the dispatcher).

### 4. Remove / repoint old routes  ✅ DONE
- [x] 4.1 Deleted `app/posts/[slug]` and `app/pages/[slug]` (replaced by dispatcher).
      Kept `app/pages/page.tsx` and the `/posts/*` browse indexes as app-nav pages.
- [x] 4.2 Repointed index item links to WP-structure URLs (categories → `/category/…/`,
      tags → `/tag/…/`, pages → root `/slug/`). Authors index keeps the
      `/posts?author=` browse filter (no WP author-archive route mirrored).

### 5. Fix URL emitters (use `linkToPath`)  ✅ DONE
- [x] 5.1 `components/posts/post-card.tsx` → `linkToPath(post.link)`
- [x] 5.2 `filter.tsx` — unchanged; it drives the `/posts` browse filter (app UX).
- [x] 5.3 `archive-list.tsx` — generic; item hrefs fixed at each index page.
- [x] 5.4 nav/footer/mobile-nav read `menu.config.ts` → point at existing browse pages.
- [x] 5.6 `app/sitemap.ts` — emits real permalink paths (`post.path`).
- [x] 5.7 `lib/metadata.ts` — canonical + OG from `path`.
- [x] 5.8 Post author/category badge links kept as `/posts?author|category=` browse filters.

### 6. Tests & verification  ✅ DONE
- [x] 6.1 Added `linkToPath`, `pathToSegments`, and `getPostByPath` tests.
- [x] 6.2 Updated metadata + sitemap tests to the new shapes.
- [x] 6.3 `pnpm lint`, `tsc --noEmit`, `pnpm test` (54 passing) all green.
- [x] 6.4 Live spot-checks pass (post/page/category/tag resolve; bogus paths 404;
      internal links now emit WP paths and click through).
- [x] 6.5 `pnpm build` compiles successfully.

---

## Notes / risks
- **WordPress admin not required** for core work (`link` field is authoritative).
- **Build-time pre-render + sitemap are limited by the WP host, not the code.**
  `www.gujrera.com` returns HTTP 500 under the build's concurrent request volume
  (11 workers + ~44 sitemap page fetches). A 50-parallel burst reproduces ~56% 500s;
  single/small bursts are 200. This is **pre-existing** (the old sitemap paginated
  the same way) and is exactly why the **on-demand + cache** strategy was chosen —
  at runtime requests are spread out (one per first-visit) so the host returns 200
  and caches. Build still succeeds (graceful fallback); the `/[...slug]` route is
  fully dynamic and the sitemap comes up empty until hardened.
### 7. Host-load hardening  ✅ DONE
- [x] 7.1 Added retry-with-backoff + jitter on 5xx/429/network errors to
      `wordpressFetch` / `wordpressFetchPaginated` (3 retries; backoff tiny under
      Vitest). Improves runtime resilience to host flakiness.
- [x] 7.2 Capped build concurrency via `experimental.cpus: 2` in `next.config.ts`.
      With 11 workers the host 500'd; with 2 the build is clean.
- [x] 7.3 Added retry unit tests (5xx-then-success, no-retry-on-4xx, give-up).
- Result: `pnpm build` now has **zero fetch failures** and a **full sitemap
  (4346 URLs)** with real WP permalink paths. 57 tests pass.

### Open item — post/page pages render dynamically (`ƒ`), not static (`●`)
The catch-all reads `searchParams` (archive `?page=`), which opts the whole route
into dynamic rendering — so `generateStaticParams` no longer pre-renders recent
posts (the "pre-render recent posts" half of the chosen strategy). Data is still
cached (`revalidate: 3600` + tags), so there's no host load per request after the
first, but HTML is re-rendered per request.
**Fix to unlock static pre-render:** mirror WordPress's own archive pagination
(`/category/foo/page/2/`) by parsing a trailing `page/N` segment in the dispatcher
instead of `?page=`, then drop `searchParams`. This makes posts/pages `●` static
and aligns archive URLs with WordPress too. (Not yet done — pending decision.)
