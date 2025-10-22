import "../globals.css"

import { Section, Container } from "@/components/craft";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Analytics } from "@vercel/analytics/react";

import { mainMenu, contentMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import Balancer from "react-wrap-balancer";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";
import { Header } from "@/components/elementor/nav/header";
import Script from "next/script";

const font = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WordPress & Next.js Starter by 9d8",
  description:
    "A starter template for Next.js with WordPress as a headless CMS.",
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

export default function ElementorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen font-sans antialiased", font.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
        <Script id="elementor-pro-frontend-js-before" strategy="beforeInteractive">
          {`
          var ElementorProFrontendConfig = {
            ajaxurl: "https://cms.dapflow.com/wp-admin/admin-ajax.php",
            nonce: "af73986408",
            urls: {
              assets: "https://cms.dapflow.com/wp-content/plugins/pro-elements/assets/",
              rest: "https://cms.dapflow.com/wp-json/"
            },
            settings: {
              lazy_load_background_images: true
            },
            popup: {
              hasPopUps: false
            },
            shareButtonsNetworks: {
              facebook: { title: "Facebook", has_counter: true },
              twitter: { title: "Twitter" },
              linkedin: { title: "LinkedIn", has_counter: true },
              pinterest: { title: "Pinterest", has_counter: true },
              reddit: { title: "Reddit", has_counter: true },
              vk: { title: "VK", has_counter: true },
              odnoklassniki: { title: "OK", has_counter: true },
              tumblr: { title: "Tumblr" },
              digg: { title: "Digg" },
              skype: { title: "Skype" },
              stumbleupon: { title: "StumbleUpon", has_counter: true },
              mix: { title: "Mix" },
              telegram: { title: "Telegram" },
              pocket: { title: "Pocket", has_counter: true },
              xing: { title: "XING", has_counter: true },
              whatsapp: { title: "WhatsApp" },
              email: { title: "Email" },
              print: { title: "Print" },
              "x-twitter": { title: "X" },
              threads: { title: "Threads" }
            },
            facebook_sdk: {
              lang: "en_US",
              app_id: ""
            },
            lottie: {
              defaultAnimationUrl:
                "https://cms.dapflow.com/wp-content/plugins/pro-elements/modules/lottie/assets/animations/default.json"
            }
          };
        `}
        </Script>

        {/* 2️⃣ Elementor Pro Core Frontend */}
        <Script
          id="elementor-pro-frontend-js"
          src="https://cms.dapflow.com/wp-content/plugins/pro-elements/assets/js/frontend.min.js?ver=3.32.1"
          strategy="afterInteractive"
        />

        {/* 3️⃣ Elementor Pro Handlers */}
        <Script
          id="pro-elements-handlers-js"
          src="https://cms.dapflow.com/wp-content/plugins/pro-elements/assets/js/elements-handlers.min.js?ver=3.32.1"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
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
              ></Image>
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
        <Container className="border-t not-prose flex flex-col md:flex-row md:gap-2 gap-6 justify-between md:items-center">
          <ThemeToggle />
          <p className="text-muted-foreground">
            &copy; <a href="https://9d8.dev">9d8</a>. All rights reserved.
            2025-present.
          </p>
        </Container>
      </Section>
    </footer>
  );
};
