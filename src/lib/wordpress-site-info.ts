// Description: WordPress site info functions
// Fetches site metadata from WP Next plugin endpoint

export interface SiteInfo {
    title: string;
    description: string;
    favicon?: string;
}

class SiteInfoError extends Error {
    constructor(message: string, public status: number, public endpoint: string) {
        super(message);
        this.name = "SiteInfoError";
    }
}

/**
 * Get site information from WP Next info endpoint
 */
export async function getSiteInfo(): Promise<SiteInfo> {
    const restApiEndpoint = process.env.WORDPRESS_REST_API_ENDPOINT?.replace(/\/$/, ""); // Remove trailing slash

    if (!restApiEndpoint) {
        throw new SiteInfoError(
            "WORDPRESS_REST_API_ENDPOINT environment variable is not defined",
            0,
            ""
        );
    }

    const url = `${restApiEndpoint}/wp-next/info`;
    const userAgent = "Next.js WordPress Client";

    const response = await fetch(url, {
        headers: {
            "User-Agent": userAgent,
        },
        next: {
            tags: ["wordpress", "site-info"],
            revalidate: 3600, // 1 hour cache
        },
    });

    if (!response.ok) {
        throw new SiteInfoError(
            `Site info request failed: ${response.statusText}`,
            response.status,
            url
        );
    }

    return response.json();
}

export {SiteInfoError};
