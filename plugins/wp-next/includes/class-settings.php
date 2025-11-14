<?php
/**
 * WP Next Settings Manager
 * Handles getting and setting plugin options with defaults
 */

class WP_Next_Settings {
    private static $option_name = 'wp_next_settings';

    private static $defaults = array(
        // General Settings
        'use_custom_endpoint' => false,
        'custom_endpoint' => '',

        // Custom Routes Settings
        'enable_custom_routes' => false,
        'expose_data' => array(
            'title' => true,           // Enabled by default (public in WP)
            'description' => true,     // Enabled by default (public in WP)
            'favicon' => true,         // Enabled by default (optional, not exposed by WP)
        ),
    );

    /**
     * Get all settings with defaults merged
     */
    public static function get_all() {
        $settings = get_option(self::$option_name, array());
        return wp_parse_args($settings, self::$defaults);
    }

    /**
     * Get a specific setting by key (supports nested keys with dot notation)
     * Example: get('expose_data.title')
     */
    public static function get($key, $default = null) {
        $settings = self::get_all();

        // Handle nested keys with dot notation
        if (strpos($key, '.') !== false) {
            $keys = explode('.', $key);
            $value = $settings;

            foreach ($keys as $k) {
                if (is_array($value) && isset($value[$k])) {
                    $value = $value[$k];
                } else {
                    return $default !== null ? $default : null;
                }
            }

            return $value;
        }

        return isset($settings[$key]) ? $settings[$key] : $default;
    }

    /**
     * Update settings (merge with existing)
     */
    public static function update($new_settings) {
        $current = self::get_all();
        $merged = wp_parse_args($new_settings, $current);
        return update_option(self::$option_name, $merged);
    }

    /**
     * Get the active REST API endpoint (custom or default)
     */
    public static function get_endpoint() {
        $use_custom = self::get('use_custom_endpoint');

        if ($use_custom && !empty(self::get('custom_endpoint'))) {
            // Custom endpoint is just the path, combine with home URL
            $custom_path = self::get('custom_endpoint');
            $home = rtrim(home_url(), '/');
            return $home . '/' . ltrim($custom_path, '/');
        }

        return rtrim(get_rest_url(), '/');
    }

    /**
     * Get the site info endpoint path
     */
    public static function get_site_info_path() {
        $endpoint = self::get_endpoint();
        return $endpoint . '/wp-next/site-info';
    }

    /**
     * Get exposed data fields
     */
    public static function get_exposed_data() {
        return self::get('expose_data', self::$defaults['expose_data']);
    }

    /**
     * Check if custom routes are enabled
     */
    public static function is_custom_routes_enabled() {
        return (bool) self::get('enable_custom_routes');
    }
}