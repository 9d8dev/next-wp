import Link from "next/link";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display text-2xl font-semibold text-paper transition-colors hover:text-saffron"
            >
              Gujrera
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/70">
              {siteConfig.site_description}
            </p>
          </div>

          <nav className="flex flex-col gap-2.5">
            <h2 className="font-kicker text-[0.72rem] font-bold uppercase tracking-[0.12em] text-paper/50">
              Sections
            </h2>
            {mainMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.95rem] text-paper/85 transition-colors hover:text-saffron"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-paper/15 pt-6">
          <p className="font-kicker text-[0.72rem] uppercase tracking-[0.08em] text-paper/50">
            &copy; {new Date().getFullYear()} {siteConfig.site_name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
