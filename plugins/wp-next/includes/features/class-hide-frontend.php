<?php
/**
 * WP Next Hide Frontend
 * Redirects public pages to Next.js frontend site
 */

class WP_Next_Hide_Frontend {

    /**
     * Check if frontend hiding is enabled
     */
    public static function is_enabled() {
        return (bool) WP_Next_Settings::get('enable_hide_frontend');
    }

    /**
     * Handle frontend hiding - redirect public pages to frontend
     */
    public static function handle($request_uri) {
        if (!self::is_enabled()) {
            return;
        }

        // Frontend URL is required
        $frontend_url = WP_Next_Settings::get('frontend_url');
        if (empty($frontend_url)) {
            return;
        }

        // Skip if hide backend is handling this request
        if (WP_Next_Hide_Backend::is_enabled()) {
            // Skip backend paths - let hide backend handle them
            if (strpos($request_uri, '/wp-admin') === 0 || strpos($request_uri, '/wp-login.php') === 0 || strpos($request_uri, '/wp-signup.php') === 0) {
                return;
            }
        }

        // Check if this is a path that should NOT be redirected
        if (self::should_exclude_from_redirect($request_uri)) {
            return;
        }

        // Extract path and query string
        $request_path = parse_url($request_uri, PHP_URL_PATH) ?? '/';
        $request_query = parse_url($request_uri, PHP_URL_QUERY) ?? '';

        // Build redirect URL
        $redirect_url = rtrim($frontend_url, '/') . $request_path;
        if (!empty($request_query)) {
            $redirect_url .= '?' . $request_query;
        }

        // Perform redirect
        wp_redirect($redirect_url, 302);
        exit;
    }

    /**
     * Check if a path should be excluded from frontend redirect
     */
    private static function should_exclude_from_redirect($request_uri) {
        // Always allow backend paths (hide backend handles them)
        if (strpos($request_uri, '/wp-admin') === 0 || strpos($request_uri, '/wp-login.php') === 0 || strpos($request_uri, '/wp-signup.php') === 0) {
            return true;
        }

        // Allow uploads
        if (strpos($request_uri, '/wp-content/uploads/') === 0) {
            return true;
        }

        // Allow default REST API
        if (strpos($request_uri, '/wp-json') === 0) {
            return true;
        }

        // Allow custom REST API endpoint (if configured)
        $custom_endpoint = WP_Next_Settings::get('custom_endpoint');
        if (!empty($custom_endpoint)) {
            $endpoint_path = '/' . ltrim($custom_endpoint, '/');
            if (strpos($request_uri, $endpoint_path) === 0) {
                return true;
            }
        }

        // Allow other WordPress core files
        if (strpos($request_uri, '/wp-') === 0 || strpos($request_uri, '/xmlrpc.php') === 0) {
            return true;
        }

        return false;
    }

}
