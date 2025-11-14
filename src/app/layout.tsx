import "./globals.css";
import {Inter as FontSans} from "next/font/google";
import {ThemeProvider} from "@/components/theme/theme-provider";
import {getSiteConfig} from "@root/site.config";
import {cn} from "@/lib/utils";

import type {Metadata} from "next";
import {Header} from "@/components/site/header";
import {Footer} from "@/components/site/footer";

const font = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
    const config = await getSiteConfig();

    const metadata: Metadata = {
        title: config.site_name,
        description: config.site_description,
        metadataBase: new URL(config.site_domain),
        alternates: {
            canonical: "/",
        },
    };

    // Add favicon if available from WordPress
    if (config.site_favicon) {
        metadata.icons = {
            icon: config.site_favicon,
        };
    }

    return metadata;
}

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