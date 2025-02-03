import "./globals.css"

import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import Balancer from "react-wrap-balancer"
import { Analytics } from "@vercel/analytics/react"

import { ThemeProvider } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/nav/mobile-nav"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Section, Container } from "@/components/craft"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { mainMenu, contentMenu } from "@/menu.config"
import { siteConfig } from "@/site.config"
import Logo from "@/public/logo.svg"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Goodfit | No Ghosting. Just Instant AI Interviews.",
  description:
    "The hiring process is broken. Get real AI interviews and instant results—no waiting, no gatekeeping.",
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          plusJakartaSans.className,
          "bg-[radial-gradient(at_68%_92%,rgba(151,71,255,0.8)_0px,transparent_50%),radial-gradient(at_35%_84%,rgba(255,183,3,0.9)_0px,transparent_50%)]"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
          {/* <Footer /> */}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

const Nav = ({ className, children, id }: NavProps) => {
  return (
    <nav
      className={cn("sticky z-50 top-0 bg-background", "border-b", className)}
      id={id}
    >
      <div
        id="nav-container"
        className="mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
        >
          <Image
            src="/images/goodfit.png"
            alt="Logo"
            loading="eager"
            className="block dark:hidden"
            width={96}
            height={26.44}
          />
          <Image
            src="/images/goodfit-dark.png"
            alt="Logo"
            loading="eager"
            className="hidden dark:block"
            width={96}
            height={26.44}
          />
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
          {/* sneaky trick to focus on the input element without javascript */}
          <Label
            className="hidden md:flex justify-center items-center h-10 px-4 py-2 rounded-full bg-violet-500 text-white hover:bg-violet-600 transition-all"
            htmlFor="email"
          >
            Request Early Access
          </Label>
          <MobileNav />
        </div>
      </div>
    </nav>
  )
}

const Footer = () => {
  return (
    <footer>
      <Section>
        <Container className="grid md:grid-cols-[1.5fr_0.5fr_0.5fr] gap-12">
          <div className="flex flex-col gap-6 not-prose">
            <Link href="/">
              <h3 className="sr-only">{siteConfig.site_name}</h3>
              <Image
                src={Logo}
                alt="Logo"
                className="dark:invert"
                width={42}
                height={26.44}
              />
            </Link>
            <p>
              <Balancer>{siteConfig.site_description}</Balancer>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Website</h5>
            {Object.entries(mainMenu).map(([key, href]) => (
              <Link
                className="hover:underline underline-offset-4"
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h5 className="font-medium text-base">Blog</h5>
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
        <Container className="border-t not-prose flex flex-col md:flex-row md:gap-2 gap-6 justify-between md:items-center text-xs">
          <ThemeToggle />
          <p className="text-muted-foreground">
            &copy; <a href="https://goodfit.so">Goodfit</a>. All rights
            reserved. 2025-present.
          </p>
        </Container>
      </Section>
    </footer>
  )
}
