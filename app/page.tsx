import Link from "next/link";

import {
  getPostsPaginated,
  getAllCategories,
  getPostsByCategoryPaginated,
  linkToPath,
} from "@/lib/wordpress";
import { StoryCard } from "@/components/magazine/story";
import {
  SectionFront,
  type SectionVariant,
} from "@/components/magazine/section-front";
import type { Post } from "@/lib/wordpress.d";
import { mainMenu } from "@/menu.config";

export const revalidate = 3600;

// Category section fronts, in order. Resolved by slug at runtime so we never
// hardcode WordPress IDs; empty/missing sections are dropped.
const SECTION_DEFS: { slug: string; title: string; variant: SectionVariant; count: number }[] =
  [
    { slug: "p", title: "Projects", variant: "split", count: 4 },
    { slug: "guide", title: "Guides", variant: "numbered", count: 6 },
    { slug: "architect", title: "Architect", variant: "grid", count: 3 },
    { slug: "gcas", title: "GCAS", variant: "list", count: 4 },
    { slug: "gujarati-samaj", title: "Gujarati Samaj", variant: "list", count: 4 },
  ];

type Section = {
  title: string;
  href: string;
  variant: SectionVariant;
  count: number;
  posts: Post[];
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <h2 className="font-kicker text-xs font-bold uppercase tracking-[0.12em] text-ink">
        {children}
      </h2>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function CityStrip() {
  const cities = mainMenu.find((m) => m.label === "Projects")?.children ?? [];
  if (cities.length === 0) return null;
  return (
    <div className="border-y border-line bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-2 px-6 py-5">
        <span className="font-kicker text-xs font-bold uppercase tracking-[0.12em] text-brown">
          Editions
        </span>
        {cities.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="font-display text-lg leading-none transition-colors hover:text-saffron-deep"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  const [{ data: posts }, categories] = await Promise.all([
    getPostsPaginated(1, 12),
    getAllCategories(),
  ]);

  const issueDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="font-display text-2xl">The desk is quiet.</p>
        <p className="mt-2 text-ink/70">No stories have been filed yet.</p>
      </div>
    );
  }

  const [lead, ...rest] = posts;
  const features = rest.slice(0, 4);
  const rail = rest.slice(4, 10);

  // Track what's already on the page so section fronts don't repeat stories.
  const shown = new Set<number>(
    [lead, ...features, ...rail].map((p) => p.id)
  );

  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const rawSections = await Promise.all(
    SECTION_DEFS.map(async (def) => {
      const cat = bySlug.get(def.slug);
      if (!cat) return null;
      // Over-fetch so we can drop already-shown stories and still fill the section.
      const { data } = await getPostsByCategoryPaginated(
        cat.id,
        1,
        def.count + 8
      );
      return { def, cat, data };
    })
  );

  const sections: Section[] = [];
  for (const r of rawSections) {
    if (!r) continue;
    const picked = r.data
      .filter((p) => !shown.has(p.id))
      .slice(0, r.def.count);
    if (picked.length === 0) continue;
    picked.forEach((p) => shown.add(p.id));
    sections.push({
      title: r.def.title,
      href: linkToPath(r.cat.link),
      variant: r.def.variant,
      count: r.cat.count,
      posts: picked,
    });
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <p className="kicker mb-8 text-brown">
          {issueDate} · Gujarat Real-Estate Bulletin
        </p>

        <StoryCard post={lead} variant="lead" />

        <hr className="my-10 border-0 border-t border-saffron/60" />

        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <SectionHeading>More stories</SectionHeading>
            <div className="grid gap-8 sm:grid-cols-2">
              {features.map((post) => (
                <StoryCard key={post.id} post={post} variant="feature" />
              ))}
            </div>
          </div>

          <aside className="md:col-span-1">
            <SectionHeading>Latest</SectionHeading>
            <div className="flex flex-col">
              {rail.map((post) => (
                <StoryCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
          </aside>
        </div>
      </div>

      <CityStrip />

      {sections.length > 0 && (
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-12 md:py-16">
          {sections.map((s) => (
            <SectionFront
              key={s.href}
              title={s.title}
              href={s.href}
              posts={s.posts}
              variant={s.variant}
              count={s.count}
            />
          ))}
        </div>
      )}
    </>
  );
}
