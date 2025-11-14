<?php
/**
 * WP Next Validators
 * Handles validation and sanitization of plugin settings
 */

class WP_Next_Validators {

    /**
     * Sanitize settings input
     */
    public static function sanitize_settings($input) {
        $output = array();

        // REST API Settings - Custom Endpoint
        if (isset($input['custom_endpoint'])) {
            $endpoint = trim($input['custom_endpoint']);
            if (!empty($endpoint)) {
                // Remove leading/trailing slashes from path
                $endpoint = trim($endpoint, '/');
                // Sanitize the path
                $endpoint = sanitize_text_field($endpoint);
            }
            $output['custom_endpoint'] = $endpoint;
        }

        // Hide Backend Settings
        if (isset($input['enable_hide_backend'])) {
            $output['enable_hide_backend'] = (bool) $input['enable_hide_backend'];
        }

        if (isset($input['hide_backend_path'])) {
            $path = trim($input['hide_backend_path']);
            if (!empty($path)) {
                // Remove leading/trailing slashes from path
                $path = trim($path, '/');
                // Sanitize the path
                $path = sanitize_text_field($path);
            }
            $output['hide_backend_path'] = $path;
        }

        // Hide Frontend Settings
        if (isset($input['enable_hide_frontend'])) {
            $output['enable_hide_frontend'] = (bool) $input['enable_hide_frontend'];
        }

        if (isset($input['frontend_url'])) {
            $frontend_url = trim($input['frontend_url']);
            if (!empty($frontend_url)) {
                // Validate and sanitize the URL
                $frontend_url = esc_url_raw($frontend_url);
            }
            // If hide frontend is enabled, frontend_url is required
            if ($output['enable_hide_frontend'] && empty($frontend_url)) {
                add_settings_error(
                    'wp_next_settings',
                    'missing_frontend_url',
                    'Frontend URL is required when Hide Frontend is enabled.',
                    'error'
                );
                // Keep previous frontend_url if not provided
                $frontend_url = WP_Next_Settings::get('frontend_url');
            }
            $output['frontend_url'] = $frontend_url;
        }

        // Custom Routes Settings
        if (isset($input['enable_custom_routes'])) {
            $output['enable_custom_routes'] = (bool) $input['enable_custom_routes'];
        }

        // Note: custom_route_path is now auto-generated, no need to sanitize from input

        if (isset($input['expose_data']) && is_array($input['expose_data'])) {
            $output['expose_data'] = self::sanitize_expose_data($input['expose_data']);
        }

        return $output;
    }

    /**
     * Sanitize expose_data field (checkboxes)
     */
    private static function sanitize_expose_data($data) {
        $allowed_fields = array(
            'title' => true,          // Always enabled
            'description' => true,    // Always enabled
            'favicon' => true,        // Optional but enabled by default
        );

        $sanitized = array();
        foreach ($allowed_fields as $field => $default) {
            // For title and description, always set to true (they're always enabled)
            if ($field === 'title' || $field === 'description') {
                $sanitized[$field] = true;
            } else {
                // For optional fields like favicon, use the provided value or default
                $sanitized[$field] = isset($data[$field]) ? (bool) $data[$field] : $default;
            }
        }

        return $sanitized;
    }

    /**
     * Validate custom endpoint URL
     */
    public static function validate_endpoint($url) {
        if (empty($url)) {
            return array('valid' => true, 'error' => null);
        }

        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return array(
                'valid' => false,
                'error' => 'Invalid URL format'
            );
        }

        return array('valid' => true, 'error' => null);
    }

    /**
     * Validate custom route path
     */
    public static function validate_route_path($path) {
        if (empty($path)) {
            return array('valid' => false, 'error' => 'Route path cannot be empty');
        }

        // Must start with /
        if (substr($path, 0, 1) !== '/') {
            return array('valid' => false, 'error' => 'Route path must start with /');
        }

        return array('valid' => true, 'error' => null);
    }
}