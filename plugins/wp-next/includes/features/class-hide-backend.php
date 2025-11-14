<?php
/**
 * WP Next Hide Backend
 * Blocks wp-admin and wp-login access, redirects custom path to login with token
 */

class WP_Next_Hide_Backend {

    /**
     * Check if backend hiding is enabled
     */
    public static function is_enabled() {
        return (bool) WP_Next_Settings::get('enable_hide_backend');
    }

    /**
     * Get the backend path (defaults to 'manager' if not set)
     */
    public static function get_backend_path() {
        $path = WP_Next_Settings::get('hide_backend_path');
        return !empty($path) ? $path : 'manager';
    }

    /**
     * Handle backend hiding - block direct access, redirect custom path
     */
    public static function handle($request_uri) {
        if (!self::is_enabled()) {
            return;
        }

        $hide_backend_path = self::get_backend_path();

        // Block direct access to wp-admin
        if (strpos($request_uri, '/wp-admin') === 0) {
            WP_Next_Hide_Frontend::show_404_or_redirect();
        }

        // Handle wp-login access
        if (strpos($request_uri, '/wp-login.php') === 0) {
            // Check for valid token parameter
            $token_param = isset($_GET[WP_NEXT_HIDE_BACKEND_TOKEN_PARAM]) ? sanitize_text_field($_GET[WP_NEXT_HIDE_BACKEND_TOKEN_PARAM]) : '';

            if ($token_param === $hide_backend_path) {
                // Valid token - allow access
                return;
            }

            // Invalid or missing token - show 404
            WP_Next_Hide_Frontend::show_404_or_redirect();
        }

        // Redirect custom path to wp-login with token
        $custom_path = '/' . ltrim($hide_backend_path, '/');
        if (strpos($request_uri, $custom_path) === 0) {
            $login_url = home_url('/wp-login.php');
            $redirect_url = add_query_arg(WP_NEXT_HIDE_BACKEND_TOKEN_PARAM, $hide_backend_path, $login_url);
            wp_redirect($redirect_url, 302);
            exit;
        }
    }
}
