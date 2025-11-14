<?php
/**
 * WP Next Custom REST API Routes
 * Handles the custom data exposure endpoint
 */

class WP_Next_Custom_Routes {

    /**
     * Register custom REST routes
     */
    public static function register_routes() {
        if (!WP_Next_Settings::is_custom_routes_enabled()) {
            return;
        }

        // Route is /wp-next/info (returns site info)
        register_rest_route(
            'wp-next',
            '/info',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array(__CLASS__, 'get_site_info'),
                'permission_callback' => '__return_true', // Public endpoint
            )
        );
    }

    /**
     * Get site info callback
     */
    public static function get_site_info() {
        $exposed_data = WP_Next_Settings::get_exposed_data();
        $response = array();

        // Title - always enabled
        $response['title'] = get_bloginfo('name');

        // Description - always enabled
        $response['description'] = get_bloginfo('description');

        // Favicon - optional
        if (isset($exposed_data['favicon']) && $exposed_data['favicon']) {
            $response['favicon'] = self::get_favicon_url();
        }

        return new WP_REST_Response($response, 200);
    }

    /**
     * Get favicon URL from WordPress site icon
     */
    private static function get_favicon_url() {
        // Try to get the custom logo/site icon
        $site_icon_id = get_option('site_icon');

        if ($site_icon_id) {
            $image_url = wp_get_attachment_image_url($site_icon_id, 'full');
            if ($image_url) {
                return $image_url;
            }
        }

        // Fall back to default favicon location
        return home_url('/favicon.ico');
    }
}