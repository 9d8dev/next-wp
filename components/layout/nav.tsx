import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { MainNav } from "@/components/layout/main-nav";
import { siteConfig } from "@/site.config";
import Logo from "@/public/gujrera-logo.png";
import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <header>
      {/* Publication strip — the ink device */}
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5">
          <span className="font-kicker text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-saffron">
            Gujarat Real-Estate Bulletin
          </span>
          <span className="hidden font-kicker text-[0.7rem] uppercase tracking-[0.09em] text-paper/60 sm:block">
            RERA news · guides · projects
          </span>
        </div>
      </div>

      {/* Nameplate — the brand logo, prominent */}
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl justify-center px-6 py-5">
          <Link
            href="/"
            className="transition-opacity hover:opacity-80"
            aria-label={siteConfig.site_name}
          >
            <Image
              src={Logo}
              alt={siteConfig.site_name}
              priority
              className="h-12 w-auto md:h-14"
            />
          </Link>
        </div>
      </div>

      {/* Sticky section nav */}
      <nav className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="font-display text-xl font-semibold leading-none transition-colors hover:text-saffron-deep"
            >
              Gujrera
            </Link>
            <MainNav />
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden rounded-sm font-kicker text-[0.7rem] font-semibold uppercase tracking-[0.08em] sm:inline-flex"
            >
              <Link href="https://www.gujrera.com">GujRERA Portal</Link>
            </Button>
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
