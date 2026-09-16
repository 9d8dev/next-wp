import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function Nav({ className, children, id }: NavProps) {
  return (
    <nav
      className={cn("sticky z-50 top-0 bg-background", "border-b", className)}
      id={id}
    >
      <div
        id="nav-container"
        className="max-w-5xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d90429] text-lg font-black text-white">
            BZ
          </div>
          <h2 className="text-sm font-bold tracking-tight">{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key}
                </Link>
              </Button>
            ))}
          </div>
          <Button asChild className="hidden bg-[#d90429] text-white hover:bg-[#ef233c] sm:flex">
            <Link href="/#termin">Probestunde buchen</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
