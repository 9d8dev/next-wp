import {getMenusByLocations} from "@/lib/wordpress-menus";

/**
 * Get all menus in parallel
 */
export async function getAllMenus() {
    return await getMenusByLocations(["primary", "footer"]);
}

/**
 * Get main navigation menu
 */
export async function getMainMenu() {
    const menus = await getMenusByLocations(["primary"]);
    return menus.primary || [];
}

/**
 * Get footer menu
 */
export async function getFooterMenu() {
    const menus = await getMenusByLocations(["footer"]);
    return menus.footer || [];
}
