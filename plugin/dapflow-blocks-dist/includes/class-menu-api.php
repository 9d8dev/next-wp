<?php
/**
 * WordPress Menu REST API Extension
 * 
 * Exposes WordPress menus via REST API for Next.js consumption
 * 
 * @package DapFlow_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

class DapFlow_Menu_API {
    
    /**
     * Initialize the menu API
     */
    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
    }

    /**
     * Register REST API routes for menus
     */
    public static function register_routes() {
        register_rest_route('wp/v2', '/menus', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'get_all_menus'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('wp/v2', '/menus/(?P<slug>[a-zA-Z0-9_-]+)', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'get_menu_by_slug'],
            'permission_callback' => '__return_true',
            'args' => [
                'slug' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);

        register_rest_route('wp/v2', '/menus/id/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'get_menu_by_id'],
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'required' => true,
                    'type' => 'integer',
                ],
            ],
        ]);
    }

    /**
     * Get all registered menus
     */
    public static function get_all_menus() {
        $menus = wp_get_nav_menus();
        $result = [];

        foreach ($menus as $menu) {
            $result[] = [
                'id' => $menu->term_id,
                'name' => $menu->name,
                'slug' => $menu->slug,
                'count' => $menu->count,
            ];
        }

        return rest_ensure_response($result);
    }

    /**
     * Get menu by slug
     */
    public static function get_menu_by_slug($request) {
        $slug = $request->get_param('slug');
        
        // Get menu by slug
        $locations = get_nav_menu_locations();
        $menu = null;

        // First, try to find by location name
        if (isset($locations[$slug])) {
            $menu = wp_get_nav_menu_object($locations[$slug]);
        }

        // If not found, try by slug
        if (!$menu) {
            $menu = wp_get_nav_menu_object($slug);
        }

        if (!$menu || is_wp_error($menu)) {
            return new WP_Error(
                'menu_not_found',
                'Menu not found',
                ['status' => 404]
            );
        }

        return rest_ensure_response(self::format_menu($menu));
    }

    /**
     * Get menu by ID
     */
    public static function get_menu_by_id($request) {
        $menu_id = $request->get_param('id');
        $menu = wp_get_nav_menu_object($menu_id);

        if (!$menu || is_wp_error($menu)) {
            return new WP_Error(
                'menu_not_found',
                'Menu not found',
                ['status' => 404]
            );
        }

        return rest_ensure_response(self::format_menu($menu));
    }

    /**
     * Format menu object with items
     */
    private static function format_menu($menu) {
        $menu_items = wp_get_nav_menu_items($menu->term_id);
        
        return [
            'id' => $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug,
            'items' => self::format_menu_items($menu_items),
        ];
    }

    /**
     * Format menu items into hierarchical structure
     */
    private static function format_menu_items($items) {
        if (!$items) {
            return [];
        }

        $formatted_items = [];

        foreach ($items as $item) {
            $formatted_items[] = [
                'id' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'target' => $item->target ?: '_self',
                'classes' => $item->classes ?: [],
                'parent' => $item->menu_item_parent,
                'description' => $item->description ?: '',
                'icon' => get_post_meta($item->ID, '_menu_item_icon', true) ?: '',
                'order' => $item->menu_order,
            ];
        }

        return $formatted_items;
    }
}

