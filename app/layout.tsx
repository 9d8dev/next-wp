import "./globals.css";

import { Inter as FontSans } from "next/font/google";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

const font = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <body className={cn("min-h-screen font-sans antialiased", font.variable)}>
        <Nav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
