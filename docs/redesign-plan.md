# Gujrera Re-design Plan

> **CHOSEN DIRECTION (2026-07-23): "The Bulletin" — editorial news magazine.**
> The site is heading toward a real-estate *news publication*, so the identity is a
> contemporary regional news magazine, not the register/survey concepts below (kept for
> reference). Scope: **foundations + homepage first** as a proof.

## Direction: "The Bulletin" (news magazine)

A confident, contemporary **Gujarat real-estate news magazine** — bilingual (English +
Gujarati), RERA-authoritative, city-aware. It avoids the grey-broadsheet cliché: instead of
dense hairline columns, it leads with a dominant **lead story** and organizes many articles
with a strong editorial hierarchy and one recognizable signature.

### Color — warm editorial, ink masthead, saffron dateline
| Token          | Hex       | Role |
|----------------|-----------|------|
| `ink`          | `#1C1712` | Masthead nameplate bar + primary text (warm near-black) |
| `paper`        | `#F7F3EA` | Base — warm editorial off-white |
| `card`         | `#FCFAF4` | Lifted story surface |
| `saffron`      | `#E07A10` | The dateline/kicker system, links, the one spot color (brand) |
| `saffron-deep` | `#B85E08` | Hover / pressed |
| `brown`        | `#6E4728` | Secondary text, bylines, from the logo |
| `line`         | `#E2D9C6` | Warm hairline |

Boldness is spent on **one** thing: the saffron dateline. Everything else is ink on paper.

### Type — editorial personality, bilingual
- **Display — `Fraunces` (600–900, high optical size)**: characterful old-style serif for
  headlines/leads (not the tired Didone). Gujarati headlines → `Noto Serif Gujarati`.
- **Body — `Noto Sans` + `Noto Sans Gujarati`**: clean, bilingual, high-legibility reading
  across many stories.
- **Kicker/meta — `Archivo` (600/700, uppercase, tracked)**: datelines, section labels,
  bylines, nav — the grotesque contrast that makes the saffron dateline pop.

### Signature
**The saffron dateline kicker** — every story is tagged `SECTION · CITY · DATE` in tracked
Archivo with a saffron rule, a consistent thread across the whole publication — paired with
a **solid ink masthead nameplate** (bilingual wordmark reversed out on ink). Recognizable,
subject-true (section/city/date is exactly how a real-estate desk files stories), and not
decorative.

### Homepage = the front page
```
┌───────────────────────────────────────────────┐
│ ▓▓ [logo]  GUJRERA — Gujarat Real-Estate Bulletin ▓▓ │ ← ink masthead nameplate bar
│ Gujarati Samaj · GCAS · Projects▾ · About · ⌕  │ ← section nav under
├───────────────────────────────────────────────┤
│ NEWS · AHMEDABAD · 12 JUL      ┌──────────────┐│ ← LEAD story: saffron dateline,
│ Big Fraunces lead headline      │ lead image   ││   oversized headline, dek, byline
│ that runs two lines             │              ││
│ Standfirst / dek in Noto Sans   └──────────────┘│
│ By Desk                                         │
├──────────────────────────┬────────────────────┤
│ SECTION FRONT: Latest     │  LATEST (rail)      │
│ ┃ GUIDE·SURAT·10 JUL       │ NEWS·RAJKOT·9 JUL   │ ← dateline + headline rows,
│ ┃ Story headline           │ headline…           │   hairline separated
│ ┃ GUIDE·—·8 JUL            │ NEWS·VADODARA·8 JUL │
├──────────────────────────┴────────────────────┤
│ EDITIONS:  Ahmedabad · Gandhinagar · Surat · …  │ ← city strip (bureaus)
└───────────────────────────────────────────────┘
```

### Self-critique vs. defaults
The live risk is warm-paper + serif = the cream/serif cliché, and "news" = the broadsheet
cliché. Differentiated by: a **solid ink masthead** breaking the flat-cream field; **Fraunces**
(soft old-style) not a high-contrast Didone; a **grotesque (Archivo) dateline system** as the
signature, not newspaper hairline columns; **imagery-forward lead-story hierarchy**, not dense
grey columns; **bilingual masthead + Gujarati type** as a real content constraint. Saffron is a
functional filing system (section·city·date), not a decorative terracotta accent.

---


## The subject (what we're actually designing)

**Gujrera / "Gujarat Information"** is a Gujarat real-estate *information and authority
portal*, not a glossy property-listing brand. Its content is RERA project
registrations, city-wise projects (Ahmedabad, Gandhinagar, Surat, Rajkot, Vadodara,
Bhavnagar), Town-Planning (TP) schemes, step-by-step RERA guides (filing complaints,
payments, forms), and property news — much of it bilingual (English + Gujarati script).

- **Audience:** property buyers/investors, agents, and developers in Gujarat who need
  authoritative, RERA-grounded information and verification.
- **The page's single job:** help someone find and trust information about a project,
  city, or RERA process.

**Design thesis:** evoke the authority of an *official Gujarat property record* — the
world of the RERA registry, the 7/12 land extract, TP-scheme plot maps, and the state's
saffron-and-earth identity — rendered as a clean digital register. Trust through
precision, not gloss.

---

## Token system

### Color — "saffron seal on official document"
Derived from the brand logo (saffron map + earth-brown), used in a civic-record register
rather than a decorative one. Saffron behaves like an **official stamp/seal**, not a
fashion accent.

| Token          | Hex       | Role |
|----------------|-----------|------|
| `paper`        | `#F2EFE6` | Base background — warm document paper (leans grey/record, not cream) |
| `card`         | `#FBF9F3` | Lifted record surface |
| `ink`          | `#211D17` | Primary text, strong UI (warm near-black) |
| `saffron`      | `#DE7A12` | Accent / links / the "seal" (from the logo) |
| `saffron-deep` | `#B45C0A` | Hover / pressed |
| `clay`         | `#7C4A26` | Secondary text, eyebrows, the Gujarat-map motif |
| `registered`   | `#1E6B54` | Status only: RERA-registered / verified (deep, sparing) |
| `line`         | `#DDD5C4` | Warm hairline — the primary divider (rules, grids, borders) |

### Type — authority + bilingual (a real, subject-specific constraint)
Gujarati titles are core content, so the system must render Gujarati properly — most
templates ignore this.

- **Display — `Zilla Slab` (600/700)**: a civic humanist slab (reads as document/record
  authority, not fashion-serif). Gujarati headlines fall back to **`Noto Serif Gujarati`**.
- **Body — `Noto Sans` + `Noto Sans Gujarati` (400/500/600)**: neutral, official,
  highly readable for long guides; genuine Gujarati support.
- **Data — `IBM Plex Mono` (500, tabular)**: RERA registration numbers, dates, survey/
  plot IDs, prices, eyebrows/labels. This is the "catalog number" layer.

Scale (fluid): display 2.25–3.5rem / titles 1.5–2rem / body 1.0625–1.125rem /
small 0.8125rem / mono-label 0.75rem (tracked +0.04em, uppercase).

### Radius & elevation
Records have crisp edges: radius **2px** (near-0), **no drop shadows** — separation comes
from hairlines and a saffron/clay **left spine** on record cards. This alone breaks from
the shadcn rounded-card look.

### Signature
**The "record" card + registration-number treatment.** Every post/project is an entry in
an official register: a saffron/clay left spine, a mono metadata line
(`RERA · CITY · DATE`), the (English/Gujarati) title in slab display, and a status chip
(`Registered` / `Guide` / `News`). Rows are separated by hairlines and tabularly aligned —
it reads like a property card / ledger, not a SaaS card grid. A faint TP-plot grid and the
Gujarat-map silhouette (from the logo) recur as quiet motifs.

---

## Layout concepts (ASCII)

### Homepage — "registry masthead"
```
┌───────────────────────────────────────────────┐
│ [logo]  Gujarati Samaj  GCAS  Projects▾  About │  ← masthead nav, hairline under
├───────────────────────────────────────────────┤
│  GUJARAT'S REAL-ESTATE RECORD        ░Gujarat  │
│  RERA-first news, projects & guides   ░ map    │  ← thesis + map motif
│  ┌─────────────────────────────────────────┐   │
│  │ ⌕  Search projects, cities, guides…     │   │  ← the functional thesis (lookup)
│  └─────────────────────────────────────────┘   │
│  Ahmedabad · Gandhinagar · Surat · Rajkot · …  │  ← city index (cadastral strip)
├───────────────────────────────────────────────┤
│  LATEST IN THE RECORD                          │
│  │ RERA·AHMEDABAD·12 Jul   [Registered]        │  ← record rows, hairline-separated
│  ┃ Title in slab display (English/ગુજરાતી)     │     ┃ = saffron spine
│  │ RERA·SURAT·10 Jul       [News]              │
│  ┃ Another record title…                       │
├───────────────────────────────────────────────┤
│  GUIDES  (numbered — these are real sequences) │
│  01 ─ How to file Form 5 …                     │
│  02 ─ How to submit a bank-change request …    │
└───────────────────────────────────────────────┘
```

### Article / guide — document reading view
```
  RERA · GUIDE · 12 JUL 2026            ← mono dateline
  How to Create a Support Request       ← slab headline
  on the GujRERA Portal
  ────────────────────────────────────  ← saffron rule
  [ On this page ]   Body set in Noto Sans at a generous measure.
   1. Step one       Guides get legitimate numbered steps.
   2. Step two       Pull-quotes / notes use the clay + hairline system.
```

### Archive (city / category / tag / author) — register index
```
  CATEGORY · 392 RECORDS                ← mono count
  Ahmedabad                             ← slab masthead
  ────────────────────────────────────
  [filter]                     [page 2 of 40 →]
  ┃ record row · ┃ record row · ┃ record row …
```

---

## Self-critique vs. AI defaults

The skill flags three clichés. This plan is warm + slab-ish, so the cream/serif/terracotta
default is the live risk. How it's differentiated, deliberately:
- **Saffron is a status seal, brand-derived from the logo** — not a decorative terracotta
  accent. It carries meaning (registered/verified), used sparingly.
- **Slab (not high-contrast fashion serif)** for a document/record register.
- **The mono registration-number layer + register-row structure + 7/12-record framing +
  TP-grid/Gujarat-map motif** are subject-specific and absent from the generic look.
- **Bilingual (Gujarati) type** is a real content constraint, not decoration.
- **Numbered markers only on guides**, because guides *are* sequences (the content earns it).
- Paper is a cooler document-grey (`#F2EFE6`), not the default cream (`#F4F1EA`).

Boldness is spent in one place — the **record/register system + saffron seal**. Everything
else (masthead, article, footer) stays quiet and disciplined.

---

## Implementation phases

- **A — Foundations:** rewrite `globals.css` tokens (color, radius, hairline system);
  wire fonts in `layout.tsx` via `next/font` (Zilla Slab, Noto Sans + Gujarati, IBM Plex
  Mono); base type styles + Prose theme.
- **B — Components:** `RecordCard` (replaces `PostCard`), status chip, mono meta line,
  restyle button/badge/input/pagination, masthead nav + footer.
- **C — Pages:** homepage (masthead + search + city index + record list + guides),
  article/guide view, archive/index views, browse/search.
- **D — Motion & polish:** masthead load-in, saffron "stamp" on status chips, hover spine
  on record rows; a11y floor (visible focus, `prefers-reduced-motion`, responsive to
  mobile); screenshot critique pass.

---

# Alternative direction: "The Survey" (cadastral)

A cool, architectural counterpoint to The Record. Metaphor: the **TP-scheme plot map /
cadastral survey sheet** — town-planning schemes, survey numbers, and city plots are
genuinely core to this site (there are whole `tp-schemes` / `*-tp` categories). Where The
Record feels like a ledger you read, The Survey feels like a drawing you navigate.

### Color — graphite survey on drafting paper (cool), saffron as the one pin
| Token         | Hex       | Role |
|---------------|-----------|------|
| `survey`      | `#E9EBE8` | Base — cool drafting-paper grey |
| `plot`        | `#F6F7F4` | Plot/card fill |
| `graphite`    | `#23282A` | Ink + linework + text |
| `grid`        | `#C7CEC9` | Cadastral hairline grid |
| `benchmark`   | `#356B7B` | Cool survey-teal — secondary text, links, contours |
| `pin`         | `#DE7A12` | Saffron survey marker — active / you-are-here (brand tie), sparing |

### Type — technical, still bilingual
- **Display — `Space Grotesk` (500/700)**: drafting/technical character; Gujarati →
  `Noto Sans Gujarati`.
- **Body — `Noto Sans` + `Noto Sans Gujarati`**.
- **Data — `Space Mono` / `IBM Plex Mono`**: survey numbers, coordinates, RERA/plot IDs.

### Signature
**The survey grid + plot markers.** A visible modular drafting grid; cities are pins on a
Gujarat survey drawing (from the logo outline); project cards are framed like plot parcels
with **corner registration ticks** and a mono survey/RERA number. TP-scheme content gets a
real mini plot-diagram. Saffron appears only as the locating pin.

### Homepage wireframe
```
┌────────────────────────────────────────────────┐
│ [logo] Gujarati Samaj  GCAS  Projects▾  About   │
├──────────┬─────────────────────────────────────┤
│  survey  │  GUJARAT REAL-ESTATE SURVEY          │  ← grid gutter on left
│  grid    │  RERA projects · TP schemes · guides │
│  + city  │  ⌕ locate a project, city, guide…    │
│  pins    │  ┌──┐ ┌──┐ ┌──┐  city plots           │
│  (map)   │  │AH│ │SU│ │GN│ … with survey counts  │
├──────────┴─────────────────────────────────────┤
│  ┌ tick        ┌ tick     survey no. AH-2451     │  ← plot-parcel cards,
│  │ Project title            [Registered]         │     corner ticks + mono no.
│  └ tick        └ tick                            │
└────────────────────────────────────────────────┘
```

### Self-critique vs. defaults
Cool + light avoids the near-black/acid-accent cliché; it is not cream/serif/terracotta and
not broadsheet. The live risk is "generic blueprint template" — mitigated by using a *light*
survey paper (not dark blueprint), real TP-plot/survey-number content, and saffron pins that
keep the brand tie. Boldness is spent on the grid+pin survey system; article and footer stay
quiet.

---

## Quality floor
Responsive to mobile, visible keyboard focus, reduced-motion respected, contrast checked
(ink-on-paper is high; saffron reserved for large text/accents/seals, never body).
