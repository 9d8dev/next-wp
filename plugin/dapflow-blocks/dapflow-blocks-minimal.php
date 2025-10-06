<?php
/**
 * Plugin Name: DapFlow Blocks (Minimal)
 * Description: Minimal version for debugging
 * Version: 1.0.0-minimal
 * Author: DapFlow Team
 */

if (!defined('ABSPATH')) {
    exit;
}

define('DAPFLOW_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('DAPFLOW_BLOCKS_URL', plugin_dir_url(__FILE__));

// Register block category
add_filter('block_categories_all', function($categories) {
    return array_merge(
        [[
            'slug' => 'dapflow',
            'title' => 'DapFlow Blocks',
        ]],
        $categories
    );
}, 10, 2);

// Register blocks
add_action('init', function() {
    $blocks_dir = DAPFLOW_BLOCKS_PATH . 'blocks/';
    
    if (!is_dir($blocks_dir)) {
        return;
    }
    
    $block_files = glob($blocks_dir . '*/block.json');
    
    foreach ($block_files as $block_json) {
        $block_dir = dirname($block_json);
        register_block_type($block_dir);
    }
});

// Enqueue editor assets
add_action('enqueue_block_editor_assets', function() {
    $asset_file = DAPFLOW_BLOCKS_PATH . 'build/index.asset.php';
    
    if (!file_exists($asset_file)) {
        return;
    }
    
    $asset = require $asset_file;
    
    wp_enqueue_script(
        'dapflow-blocks-editor',
        DAPFLOW_BLOCKS_URL . 'build/index.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );
});

