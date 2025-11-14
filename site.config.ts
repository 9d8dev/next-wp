import {getSiteInfo} from "@/lib/wordpress-site-info";

type SiteConfig = {
    site_domain: string;
    site_name: string;
    site_description: string;
    site_favicon?: string;
};

const defaultConfig: SiteConfig = {
    site_name: "next-wp",
    site_description: "Starter template for Headless WordPress with Next.js",
    site_domain: `${process.env.WORDPRESS_URL}`,
};

async function getSiteConfig(): Promise<SiteConfig> {
    try {
        const siteInfo = await getSiteInfo();
        return {
            ...defaultConfig,
            site_name: siteInfo.title,
            site_description: siteInfo.description,
            site_favicon: siteInfo.favicon,
        };
    } catch (error) {
        // If fetch fails, return defaults
        console.warn("Failed to fetch site info, using defaults:", error);
        return defaultConfig;
    }
}

export {getSiteConfig, defaultConfig as siteConfig};
