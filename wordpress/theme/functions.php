<?php
/**
 * Next.js Headless Theme
 *
 * Redirects all frontend requests to the Next.js application.
 * Allows admin, login, REST API, and other WordPress internals.
 */

// Redirect frontend requests to Next.js
add_action('template_redirect', function () {
    // Allow WordPress admin area
    if (is_admin()) {
        return;
    }

    // Allow login/logout pages
    if (strpos($_SERVER['REQUEST_URI'], 'wp-login') !== false ||
        strpos($_SERVER['REQUEST_URI'], 'wp-signup') !== false ||
        strpos($_SERVER['REQUEST_URI'], 'wp-activate') !== false) {
        return;
    }

    // Allow REST API
    if (strpos($_SERVER['REQUEST_URI'], 'wp-json') !== false ||
        strpos($_SERVER['REQUEST_URI'], rest_get_url_prefix()) !== false) {
        return;
    }

    // Allow cron
    if (strpos($_SERVER['REQUEST_URI'], 'wp-cron') !== false) {
        return;
    }

    // Allow AJAX requests
    if (defined('DOING_AJAX') && DOING_AJAX) {
        return;
    }

    // Allow XML-RPC (if needed for some integrations)
    if (strpos($_SERVER['REQUEST_URI'], 'xmlrpc.php') !== false) {
        return;
    }

    // Get Next.js URL from environment
    $nextjs_url = getenv('NEXTJS_URL');

    if ($nextjs_url) {
        // Redirect to Next.js with 301 (permanent redirect)
        wp_redirect($nextjs_url, 301);
        exit;
    }
});

// Remove unnecessary frontend features for headless
add_action('after_setup_theme', function () {
    // Remove emoji scripts
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');

    // Remove feed links
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);

    // Remove RSD link
    remove_action('wp_head', 'rsd_link');

    // Remove wlwmanifest link
    remove_action('wp_head', 'wlwmanifest_link');

    // Remove WordPress version
    remove_action('wp_head', 'wp_generator');
});
