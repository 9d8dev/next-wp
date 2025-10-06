<?php
/**
 * DapFlow Admin Interface
 * 
 * Admin settings and dashboard for DapFlow Blocks
 */

class DapFlow_Admin {
    
    /**
     * Initialize admin interface
     */
    public static function init() {
        add_action('admin_menu', [__CLASS__, 'add_admin_menu']);
        add_action('admin_init', [__CLASS__, 'register_settings']);
    }
    
    /**
     * Add admin menu
     */
    public static function add_admin_menu() {
        add_menu_page(
            __('DapFlow Blocks', 'dapflow-blocks'),
            __('DapFlow Blocks', 'dapflow-blocks'),
            'manage_options',
            'dapflow-blocks',
            [__CLASS__, 'admin_page'],
            'dashicons-layout',
            30
        );
    }
    
    /**
     * Register settings
     */
    public static function register_settings() {
        register_setting('dapflow_blocks_settings', 'dapflow_blocks_enabled');
    }
    
    /**
     * Admin page content
     */
    public static function admin_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <div class="dapflow-blocks-dashboard">
                <div class="card">
                    <h2><?php _e('Registered Blocks', 'dapflow-blocks'); ?></h2>
                    <ul>
                        <?php
                        $blocks = DapFlow_Block_Registry::get_registered_blocks();
                        if (empty($blocks)) {
                            echo '<li>' . __('No blocks registered yet.', 'dapflow-blocks') . '</li>';
                        } else {
                            foreach ($blocks as $block) {
                                echo '<li><code>' . esc_html($block) . '</code></li>';
                            }
                        }
                        ?>
                    </ul>
                </div>
                
                <div class="card">
                    <h2><?php _e('Integration Status', 'dapflow-blocks'); ?></h2>
                    <table class="widefat">
                        <tr>
                            <th><?php _e('WordPress Version', 'dapflow-blocks'); ?></th>
                            <td><?php echo esc_html(get_bloginfo('version')); ?></td>
                        </tr>
                        <tr>
                            <th><?php _e('Plugin Version', 'dapflow-blocks'); ?></th>
                            <td><?php echo esc_html(DAPFLOW_BLOCKS_VERSION); ?></td>
                        </tr>
                        <tr>
                            <th><?php _e('REST API', 'dapflow-blocks'); ?></th>
                            <td><span style="color: green;">✓ Active</span></td>
                        </tr>
                        <tr>
                            <th><?php _e('Blocks Field', 'dapflow-blocks'); ?></th>
                            <td><code>/wp-json/wp/v2/pages?_fields=blocks</code></td>
                        </tr>
                    </table>
                </div>
                
                <div class="card">
                    <h2><?php _e('Documentation', 'dapflow-blocks'); ?></h2>
                    <ul>
                        <li><a href="https://dapflow.com/docs/blocks" target="_blank"><?php _e('Block Development Guide', 'dapflow-blocks'); ?></a></li>
                        <li><a href="https://dapflow.com/docs/next-integration" target="_blank"><?php _e('Next.js Integration', 'dapflow-blocks'); ?></a></li>
                        <li><a href="https://developer.wordpress.org/block-editor/" target="_blank"><?php _e('WordPress Block Editor Handbook', 'dapflow-blocks'); ?></a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <style>
            .dapflow-blocks-dashboard {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .dapflow-blocks-dashboard .card {
                padding: 20px;
            }
            
            .dapflow-blocks-dashboard ul {
                list-style: disc;
                padding-left: 20px;
            }
            
            .dapflow-blocks-dashboard table {
                margin-top: 10px;
            }
        </style>
        <?php
    }
}

