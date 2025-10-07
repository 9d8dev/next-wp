<?php
/**
 * Plugin Name: DapFlow Blocks
 * Plugin URI: https://dapflow.com
 * Description: Custom Gutenberg blocks for DapFlow marketing pages that integrate with Next.js frontend
 * Version: 1.0.0
 * Author: DapFlow Team
 * Author URI: https://dapflow.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: dapflow-blocks
 * Requires at least: 6.0
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DAPFLOW_BLOCKS_VERSION', '1.0.0');
define('DAPFLOW_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('DAPFLOW_BLOCKS_URL', plugin_dir_url(__FILE__));

// Autoload classes
require_once DAPFLOW_BLOCKS_PATH . 'includes/class-block-registry.php';
require_once DAPFLOW_BLOCKS_PATH . 'includes/class-rest-api.php';
require_once DAPFLOW_BLOCKS_PATH . 'includes/class-admin.php';
require_once DAPFLOW_BLOCKS_PATH . 'includes/class-menu-api.php';

/**
 * Initialize plugin
 */
function dapflow_blocks_init() {
    // Register blocks
    DapFlow_Block_Registry::init();
    
    // Extend REST API (with error handling)
    DapFlow_REST_API::init();
    
    // Menu API
    DapFlow_Menu_API::init();
    
    // Admin interface
    if (is_admin()) {
        DapFlow_Admin::init();
    }
}
add_action('plugins_loaded', 'dapflow_blocks_init');

/**
 * Activation hook
 */
register_activation_hook(__FILE__, 'dapflow_blocks_activate');
function dapflow_blocks_activate() {
    // Set default options
    add_option('dapflow_blocks_version', DAPFLOW_BLOCKS_VERSION);
    add_option('dapflow_blocks_enabled', true);
    
    // Flush rewrite rules
    flush_rewrite_rules();
}

/**
 * Deactivation hook
 */
register_deactivation_hook(__FILE__, 'dapflow_blocks_deactivate');
function dapflow_blocks_deactivate() {
    // Cleanup
    delete_option('dapflow_blocks_enabled');
    flush_rewrite_rules();
}

