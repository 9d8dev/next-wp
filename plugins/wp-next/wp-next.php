<?php
/**
 * Plugin Name: WP Next
 * Description: Headless WordPress to Next.js integration plugin
 * Version: 1.0.0
 * Author: phucbm
 * Author URI: https://github.com/phucbm
 * Text Domain: wp-next
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('WP_NEXT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WP_NEXT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('WP_NEXT_VERSION', '1.0.0');

// Require main class
require_once WP_NEXT_PLUGIN_DIR . 'includes/class-wp-next.php';

// Initialize plugin
add_action('plugins_loaded', function() {
    WP_Next::get_instance();
});