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

        // General Settings
        if (isset($input['use_custom_endpoint'])) {
            $output['use_custom_endpoint'] = (bool) $input['use_custom_endpoint'];
        }

        if (isset($input['custom_endpoint'])) {
            $endpoint = trim($input['custom_endpoint']);
            if (!empty($endpoint)) {
                $endpoint = esc_url_raw($endpoint);
                $endpoint = rtrim($endpoint, '/');
            }
            $output['custom_endpoint'] = $endpoint;
        }

        // Custom Routes Settings
        if (isset($input['enable_custom_routes'])) {
            $output['enable_custom_routes'] = (bool) $input['enable_custom_routes'];
        }

        if (isset($input['custom_route_path'])) {
            $path = sanitize_text_field(trim($input['custom_route_path']));
            // Ensure it starts with /
            $path = '/' . ltrim($path, '/');
            $output['custom_route_path'] = $path;
        }

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
            'title' => false,
            'description' => false,
            'favicon' => false,
            'language' => false,
            'timezone' => false,
        );

        $sanitized = array();
        foreach ($allowed_fields as $field => $default) {
            $sanitized[$field] = isset($data[$field]) ? (bool) $data[$field] : $default;
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