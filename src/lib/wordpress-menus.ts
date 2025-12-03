// WordPress Menu API functions
import querystring from "query-string";
import type { MenuItem, WPMenuItem } from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL;
const restApiEndpoint = process.env.WORDPRESS_REST_API_ENDPOINT?.replace(/\/$/, "");

class WordPressAPIError extends Error {
    constructor(message: string, public status: number, public endpoint: string) {
        super(message);
        this.name = "WordPressAPIError";
    }
}

async function wordpressFetch<T>(
    path: string,
    query?: Record<string, any>
): Promise<T> {
    const url = `${restApiEndpoint}${path}${query ? `?${querystring.stringify(query)}` : ""}`;
    const userAgent = "Next.js WordPress Client";
    const response = await fetch(url, {
        headers: {
            "User-Agent": userAgent,
        },
        next: {
            tags: ["wordpress"],
            revalidate: 3600,
        },
    });

    if (!response.ok) {
        throw new WordPressAPIError(
            `WordPress API request failed: ${response.statusText}`,
            response.status,
            url
        );
    }

    return response.json();
}

function transformUrl(url: string): string {
    if (baseUrl && url.startsWith(baseUrl)) {
        return url.replace(baseUrl, '') || '/';
    }
    return url;
}

function buildMenuHierarchy(rawItems: WPMenuItem[]): MenuItem[] {
    const items: MenuItem[] = rawItems.map(item => ({
        id: item.id,
        title: item.title.rendered,
        url: transformUrl(item.url),
        target: item.target || "",
        classes: item.classes || [],
        description: item.description || "",
        children: []
    }));

    const itemMap = new Map<number, MenuItem>();
    items.forEach(item => itemMap.set(item.id, item));

    const topLevelItems: MenuItem[] = [];

    rawItems.forEach((rawItem, index) => {
        const item = items[index];

        if (rawItem.parent === 0) {
            topLevelItems.push(item);
        } else {
            const parent = itemMap.get(rawItem.parent);
            if (parent) {
                parent.children.push(item);
            } else {
                topLevelItems.push(item);
            }
        }
    });

    return topLevelItems;
}

export async function getMenuByLocation(location: string): Promise<MenuItem[]> {
    try {
        const response = await wordpressFetch<{ items: WPMenuItem[] }>(
            `/wp-next/menus/${location}`
        );

        if (!response.items || response.items.length === 0) {
            return [];
        }

        return buildMenuHierarchy(response.items);
    } catch (error) {
        console.error(`Failed to fetch menu: ${location}`, error);
        return [];
    }
}

export async function getMenusByLocations(
    locations: string[]
): Promise<Record<string, MenuItem[]>> {
    const results = await Promise.all(
        locations.map(async (location) => ({
            location,
            items: await getMenuByLocation(location)
        }))
    );

    return results.reduce((acc, { location, items }) => {
        acc[location] = items;
        return acc;
    }, {} as Record<string, MenuItem[]>);
}
