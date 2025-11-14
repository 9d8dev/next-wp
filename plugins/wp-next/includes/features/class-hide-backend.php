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

        // Allow logged-in admins to access wp-admin
        if (is_user_logged_in() && current_user_can('manage_options')) {
            return;
        }

        $hide_backend_path = self::get_backend_path();

        // Block direct access to wp-admin
        if (strpos($request_uri, '/wp-admin') === 0) {
            self::redirect_to_frontend($request_uri);
        }

        // Handle wp-login access (block /wp-login* variations)
        if (strpos($request_uri, '/wp-login') === 0) {
            // Only allow /wp-login.php with valid token
            if (strpos($request_uri, '/wp-login.php') === 0) {
                // Check for valid token parameter
                $token_param = isset($_GET[WP_NEXT_HIDE_BACKEND_TOKEN_PARAM]) ? $_GET[WP_NEXT_HIDE_BACKEND_TOKEN_PARAM] : '';

                if (!empty($token_param) && $token_param === $hide_backend_path) {
                    // Valid token - allow access
                    return;
                }
            }

            // Invalid or missing token, or wrong wp-login variation - redirect to frontend
            self::redirect_to_frontend($request_uri);
        }
    }

    /**
     * Redirect request to frontend or show 403 Forbidden
     */
    private static function redirect_to_frontend($request_uri) {
        // Check if hide frontend is enabled and frontend URL is set
        $hide_frontend_enabled = WP_Next_Settings::get('enable_hide_frontend');
        $frontend_url = WP_Next_Settings::get('frontend_url');

        if ($hide_frontend_enabled && !empty($frontend_url)) {
            // Extract path and query string
            $request_path = parse_url($request_uri, PHP_URL_PATH) ?? '/';
            $request_query = parse_url($request_uri, PHP_URL_QUERY) ?? '';

            // Build redirect URL
            $redirect_url = rtrim($frontend_url, '/') . $request_path;
            if (!empty($request_query)) {
                $redirect_url .= '?' . $request_query;
            }

            wp_redirect($redirect_url, 302);
            exit;
        }

        // Return 403 Forbidden (no UI, no template)
        status_header(403);
        exit('Forbidden');
    }
}
