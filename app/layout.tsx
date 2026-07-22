import "./globals.css";

import {
  Fraunces,
  Noto_Sans,
  Noto_Sans_Gujarati,
  Noto_Serif_Gujarati,
  Archivo,
} from "next/font/google";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

// Display — characterful old-style serif for headlines/leads.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
// Body — clean, bilingual reading face.
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
});
// Gujarati script support for body + headlines.
const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati", "latin"],
  variable: "--font-noto-sans-gujarati",
  display: "swap",
});
const notoSerifGujarati = Noto_Serif_Gujarati({
  subsets: ["gujarati"],
  variable: "--font-noto-serif-gujarati",
  display: "swap",
});
// Kicker/meta — grotesque for datelines, labels, bylines.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const fontVariables = cn(
  fraunces.variable,
  notoSans.variable,
  notoSansGujarati.variable,
  notoSerifGujarati.variable,
  archivo.variable
);

export const metadata: Metadata = {
  title: {
    default: siteConfig.site_name,
    template: `%s | ${siteConfig.site_name}`,
  },
  description: siteConfig.site_description,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          "min-h-screen bg-paper font-sans text-ink antialiased",
          fontVariables
        )}
      >
        <Nav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
