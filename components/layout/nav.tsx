import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.svg";
import Image from "next/image";
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
          <Image
            src={Logo}
            alt="Logo"
            loading="eager"
            className="dark:invert"
            width={42}
            height={26.44}
          />
          <h2 className="text-sm">{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <Button asChild className="hidden sm:flex">
            <Link href="https://github.com/9d8dev/next-wp">Get Started</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
