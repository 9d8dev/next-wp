<?php
/**
 * DapFlow Block Registry
 * 
 * Registers custom Gutenberg blocks and handles block categories
 */

class DapFlow_Block_Registry {
    
    /**
     * Array of registered blocks
     */
    private static $blocks = [];
    
    /**
     * Initialize block registry
     */
    public static function init() {
        add_filter('block_categories_all', [__CLASS__, 'register_block_category'], 10, 2);
        add_action('init', [__CLASS__, 'register_blocks']);
        add_action('enqueue_block_editor_assets', [__CLASS__, 'enqueue_editor_assets']);
    }
    
    /**
     * Register custom block category
     * 
     * @param array $categories Existing categories
     * @param WP_Post $post Current post
     * @return array Modified categories
     */
    public static function register_block_category($categories, $post) {
        return array_merge(
            [
                [
                    'slug' => 'dapflow',
                    'title' => __('DapFlow Blocks', 'dapflow-blocks'),
                    'icon' => 'layout',
                ],
            ],
            $categories
        );
    }
    
    /**
     * Register all blocks
     * Auto-discovers blocks in blocks/ directory
     */
    public static function register_blocks() {
        $blocks_dir = DAPFLOW_BLOCKS_PATH . 'blocks/';
        
        if (!is_dir($blocks_dir)) {
            return;
        }
        
        // Find all block.json files
        $block_files = glob($blocks_dir . '*/block.json');
        
        foreach ($block_files as $block_json) {
            $block_dir = dirname($block_json);
            $block_name = basename($block_dir);
            
            // Skip template
            if ($block_name === '_template') {
                continue;
            }
            
            // Register block type
            $registered = register_block_type($block_dir);
            
            if ($registered) {
                self::$blocks[] = 'dapflow/' . $block_name;
            }
        }
    }
    
    /**
     * Enqueue block editor assets
     */
    public static function enqueue_editor_assets() {
        // Check if build file exists
        $asset_file = DAPFLOW_BLOCKS_PATH . 'build/index.asset.php';
        
        if (!file_exists($asset_file)) {
            return;
        }
        
        $asset = require $asset_file;
        
        // Enqueue editor JavaScript
        wp_enqueue_script(
            'dapflow-blocks-editor',
            DAPFLOW_BLOCKS_URL . 'build/index.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );
        
        // Enqueue editor styles
        if (file_exists(DAPFLOW_BLOCKS_PATH . 'build/index.css')) {
            wp_enqueue_style(
                'dapflow-blocks-editor',
                DAPFLOW_BLOCKS_URL . 'build/index.css',
                [],
                $asset['version']
            );
        }
        
        // Pass data to JavaScript
        wp_localize_script(
            'dapflow-blocks-editor',
            'dapflowBlocks',
            [
                'pluginUrl' => DAPFLOW_BLOCKS_URL,
                'blocks' => self::$blocks,
            ]
        );
    }
    
    /**
     * Get list of registered blocks
     * 
     * @return array Block names
     */
    public static function get_registered_blocks() {
        return self::$blocks;
    }
}

