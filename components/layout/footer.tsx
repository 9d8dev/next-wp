import { Section, Container } from "@/components/craft";
import { mainMenu, contentMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#10232b]">
      <Section>
        <Container className="grid md:grid-cols-[1.5fr_0.5fr_0.5fr] gap-12">
          <div className="flex flex-col gap-6 not-prose">
            <Link href="/" className="text-lg font-bold text-white">
              {siteConfig.site_name}
            </Link>
            <p className="max-w-sm text-slate-300">{siteConfig.site_description}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="text-base font-medium text-white">Navigation</h5>
            {Object.entries(mainMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="text-base font-medium text-white">Rechtliches</h5>
            {Object.entries(contentMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
        </Container>
        <Container className="not-prose flex flex-col justify-between gap-6 border-t border-slate-700 md:flex-row md:items-center md:gap-2">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} {siteConfig.site_name}. Alle Rechte vorbehalten.
          </p>
        </Container>
      </Section>
    </footer>
  );
}
