// WordPress front page (home) helpers
// Gets the front page from WordPress via custom wp-next plugin endpoint

import {getPageById} from "./wordpress";
import {getSiteInfo} from "./wordpress-site-info";
import type {Page} from "./wordpress.d";

/**
 * Get the WordPress front page (homepage)
 * Uses existing getSiteInfo() to get front page ID
 * Returns the page object if front page is configured, otherwise returns null
 */
export async function getFrontPage(): Promise<Page | null> {
    try {
        const siteInfo = await getSiteInfo();

        // Check if front page ID is available
        if (!siteInfo.front_page_id) {
            console.warn(
                "No front page configured in WordPress. Set a front page in WordPress > Settings > Reading > Front page displays"
            );
            return null;
        }

        // Fetch the front page by ID
        const page = await getPageById(siteInfo.front_page_id);
        return page;
    } catch (error) {
        console.error("Error fetching front page:", error);
        return null;
    }
}
