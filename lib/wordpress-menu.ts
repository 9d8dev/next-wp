/**
 * WordPress Menu API Client
 * Fetches navigation menu data from WordPress REST API
 */

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://cms.dapflow.com/wp-json';

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
  classes: string[];
  children?: MenuItem[];
  icon?: string;
  description?: string;
}

export interface Menu {
  id: number;
  name: string;
  slug: string;
  items: MenuItem[];
}

/**
 * Fetch a WordPress menu by slug
 */
export async function getMenu(slug: string = 'primary'): Promise<Menu | null> {
  try {
    const res = await fetch(`${WP_API_URL}/wp/v2/menus/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      // Menu API doesn't exist yet or menu not found - this is OK
      if (res.status === 404) {
        console.warn(`Menu API not available or menu '${slug}' not found. Using fallback menu.`);
      } else {
        // Downgrade to warn to avoid noisy server errors during local dev
        console.warn(`[Menu] Failed to fetch menu '${slug}': ${res.status} ${res.statusText}`);
      }
      return null;
    }

    const menu = await res.json();
    return menu;
  } catch (error) {
    // Network error or API not available - fail gracefully
    console.warn('[Menu] API not available, using fallback menu:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Fetch primary navigation menu
 */
export async function getPrimaryMenu(): Promise<Menu | null> {
  // Try common slugs/locations in order
  const attempts = ['primary-menu', 'primary', 'main', 'menu-1'];
  for (const slug of attempts) {
    const menu = await getMenu(slug);
    if (menu && Array.isArray(menu.items)) return menu;
  }
  return null;
}

/**
 * Fetch footer menu
 */
export async function getFooterMenu(): Promise<Menu | null> {
  const attempts = ['footer', 'footer-menu', 'menu-2'];
  for (const slug of attempts) {
    const menu = await getMenu(slug);
    if (menu && Array.isArray(menu.items)) return menu;
  }
  return null;
}

/**
 * Build hierarchical menu structure from flat menu items
 */
export function buildMenuTree(items: any[]): MenuItem[] {
  const itemMap = new Map<number, MenuItem>();
  const rootItems: MenuItem[] = [];

  // First pass: create all items
  items.forEach((item) => {
    // Convert WordPress CMS URLs to frontend URLs
    let url = item.url;
    
    // If URL is from WordPress CMS, convert to frontend path
    if (url && url.includes('cms.dapflow.com')) {
      // Extract path after domain
      url = url.replace(/https?:\/\/cms\.dapflow\.com/, '');
      
      // If it's a root URL, make it /
      if (!url || url === '/') {
        url = '/';
      }
      // Remove trailing slash for consistency
      else if (url !== '/' && url.endsWith('/')) {
        url = url.slice(0, -1);
      }
      
      // Convert WordPress page URLs to /pages/ format if needed
      // (assuming pages are under /pages/ in Next.js)
      if (url && url !== '/' && !url.startsWith('/posts') && !url.startsWith('/pages')) {
        url = `/pages${url}`;
      }
    }
    
    itemMap.set(item.id, {
      id: item.id,
      title: item.title,
      url: url,
      target: item.target || '_self',
      classes: item.classes || [],
      children: [],
      icon: item.icon,
      description: item.description,
    });
  });

  // Second pass: build tree structure
  items.forEach((item) => {
    const menuItem = itemMap.get(item.id)!;
    
    // Parent can be string "0" or number 0
    const parentId = typeof item.parent === 'string' ? parseInt(item.parent) : item.parent;
    
    if (parentId === 0) {
      rootItems.push(menuItem);
    } else {
      const parent = itemMap.get(parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(menuItem);
      }
    }
  });

  return rootItems;
}

