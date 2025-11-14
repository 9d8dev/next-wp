import "./globals.css";
import {Inter as FontSans} from "next/font/google";
import {ThemeProvider} from "@/components/theme/theme-provider";
import {siteConfig} from "@root/site.config";
import {cn} from "@/lib/utils";

import type {Metadata} from "next";
import {Header} from "@/components/site/header";
import {Footer} from "@/components/site/footer";

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

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head/>
        <body className={cn("min-h-screen font-sans antialiased", font.variable)}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Header/>
            {children}
            <Footer/>
        </ThemeProvider>
        </body>
        </html>
    );
}