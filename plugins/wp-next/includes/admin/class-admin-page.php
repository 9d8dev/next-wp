<?php
/**
 * WP Next Admin Page Handler
 * Manages the settings page and tabs
 */

class WP_Next_Admin_Page {
    private static $tabs = array();

    /**
     * Initialize tabs
     */
    private static function init_tabs() {
        if (empty(self::$tabs)) {
            require_once WP_NEXT_PLUGIN_DIR . 'includes/admin/tabs/class-tab-general.php';
            require_once WP_NEXT_PLUGIN_DIR . 'includes/admin/tabs/class-tab-custom-routes.php';

            self::$tabs = array(
                new WP_Next_Tab_General(),
                new WP_Next_Tab_Custom_Routes(),
            );
        }
    }

    /**
     * Render the admin page
     */
    public static function render() {
        self::init_tabs();
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : self::$tabs[0]->get_id();
        $settings = WP_Next_Settings::get_all();
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <!-- Tab Navigation -->
            <nav class="nav-tab-wrapper wp-clearfix">
                <?php foreach (self::$tabs as $tab) : ?>
                    <a href="<?php echo esc_url(add_query_arg('tab', $tab->get_id())); ?>"
                       class="nav-tab <?php echo $active_tab === $tab->get_id() ? 'nav-tab-active' : ''; ?>">
                        <?php echo esc_html($tab->get_label()); ?>
                    </a>
                <?php endforeach; ?>
            </nav>

            <!-- Tab Content -->
            <form method="post" action="options.php" class="wp-next-form">
                <?php settings_fields('wp_next_group'); ?>

                <div class="tab-content">
                    <?php foreach (self::$tabs as $tab) : ?>
                        <div class="tab-pane <?php echo $active_tab === $tab->get_id() ? 'active' : ''; ?>"
                             id="tab-<?php echo esc_attr($tab->get_id()); ?>">
                            <?php $tab->render($settings); ?>
                        </div>
                    <?php endforeach; ?>
                </div>

                <?php submit_button('Save Settings'); ?>
            </form>
        </div>

        <style>
            .wp-next-form .tab-pane {
                display: none;
                padding: 20px;
                background: #fff;
                border: 1px solid #ccc;
                border-top: none;
            }

            .wp-next-form .tab-pane.active {
                display: block;
            }

            .form-group {
                margin: 20px 0;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
            }

            .form-group input[type="text"],
            .form-group input[type="url"],
            .form-group input[type="number"] {
                width: 100%;
                max-width: 500px;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }

            .form-group .description {
                display: block;
                margin-top: 8px;
                color: #666;
                font-size: 13px;
            }

            .checkbox-group {
                margin: 15px 0;
            }

            .checkbox-item {
                margin: 8px 0;
            }

            .checkbox-item input[type="checkbox"] {
                margin-right: 8px;
            }

            .checkbox-item label {
                display: inline;
                margin-bottom: 0;
                font-weight: normal;
            }

            .preview-box {
                background: #f5f5f5;
                padding: 12px;
                border-radius: 4px;
                margin-top: 10px;
                border-left: 3px solid #0073aa;
                font-family: monospace;
                font-size: 12px;
            }
        </style>
        <?php
    }
}