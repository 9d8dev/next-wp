<?php
/**
 * WP Next Admin Page Handler
 */

class WP_Next_Admin_Page {

    /**
     * Render the admin page
     */
    public static function render() {
        $settings = WP_Next_Settings::get_all();
        $home_url = rtrim(home_url(), '/');
        $default_endpoint = rtrim(get_rest_url(), '/');
        $custom_endpoint = $settings['custom_endpoint'] ?? '';
        $enable_routes = $settings['enable_custom_routes'] ?? false;
        $expose_data = $settings['expose_data'] ?? array();

        // Get the active endpoint (considering custom endpoint)
        $active_endpoint = WP_Next_Settings::get_endpoint();
        $site_info_endpoint = $active_endpoint . '/wp-next/site-info';
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <form method="post" action="options.php">
                <?php settings_fields('wp_next_group'); ?>

                <!-- Section 1: REST API Endpoint Configuration -->
                <div class="wp-next-section">
                    <h2>REST API Endpoint</h2>
                    <p>Configure your custom REST API endpoint.</p>

                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="custom_endpoint">Endpoint Path</label>
                            </th>
                            <td>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <span style="color: #666; font-weight: 500;"><?php echo esc_html($home_url); ?>/</span>
                                    <input type="text"
                                           id="custom_endpoint"
                                           name="wp_next_settings[custom_endpoint]"
                                           value="<?php echo esc_attr($custom_endpoint); ?>"
                                           placeholder="wp-json"
                                           style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; flex: 1; max-width: 500px;">
                                </div>
                                <p class="description">
                                    Leave empty to use default. Current endpoint path:
                                    <a target="_blank" href="<?php echo $active_endpoint; ?>">
                                        <code><?php echo $active_endpoint; ?></code>
                                    </a>
                                </p>
                                <p class="description" style="background: #fff3cd; padding: 8px; margin-top: 10px; border-radius: 4px; border-left: 3px solid #ffc107;">
                                    <strong>⚠️ After saving:</strong> <a href="<?php echo esc_url(admin_url('options-permalink.php')); ?>" target="_blank">Go to Settings > Permalinks</a> and click "Save Changes" to flush rewrite rules and activate the new endpoint.
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Section 2: Data Exposure Configuration -->
                <div class="wp-next-section">
                    <h2>Data Exposure via Custom Route</h2>
                    <p>Select which site information to expose via a public REST API endpoint.</p>

                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="enable_custom_routes">Enable Route</label>
                            </th>
                            <td>
                                <input type="checkbox"
                                       id="enable_custom_routes"
                                       name="wp_next_settings[enable_custom_routes]"
                                       value="1"
                                       <?php checked($enable_routes); ?>>
                                <label for="enable_custom_routes">Enable custom route data exposure</label>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Exposed Fields</th>
                            <td>
                                <div style="margin: 10px 0;">
                                    <div style="margin: 10px 0;">
                                        <label>
                                            <input type="checkbox"
                                                   disabled
                                                   checked>
                                            <strong>Site Title</strong>
                                            <em style="color: #999;">(always enabled)</em>
                                        </label>
                                        <input type="hidden" name="wp_next_settings[expose_data][title]" value="1">
                                    </div>

                                    <div style="margin: 10px 0;">
                                        <label>
                                            <input type="checkbox"
                                                   disabled
                                                   checked>
                                            <strong>Site Description</strong>
                                            <em style="color: #999;">(always enabled)</em>
                                        </label>
                                        <input type="hidden" name="wp_next_settings[expose_data][description]" value="1">
                                    </div>

                                    <div style="margin: 10px 0;">
                                        <!-- Hidden input for unchecked state -->
                                        <input type="hidden" name="wp_next_settings[expose_data][favicon]" value="0">
                                        <label>
                                            <input type="checkbox"
                                                   id="expose_favicon"
                                                   name="wp_next_settings[expose_data][favicon]"
                                                   value="1"
                                                   <?php checked($expose_data['favicon'] ?? false); ?>>
                                            <strong>Favicon URL</strong>
                                            <em style="color: #999;">(optional)</em>
                                        </label>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Endpoint</th>
                            <td>
                                <div style="background: #f5f5f5; padding: 12px; border-radius: 4px; border-left: 3px solid #4CAF50; font-family: monospace; font-size: 13px;">
                                    <strong>GET</strong> <?php echo esc_html($site_info_endpoint); ?>
                                </div>
                                <p class="description">This endpoint returns JSON with selected fields above.</p>
                            </td>
                        </tr>
                    </table>
                </div>

                <?php submit_button('Save Settings'); ?>
            </form>
        </div>

        <style>
            .wp-next-section {
                background: #fff;
                padding: 20px;
                margin: 20px 0;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .wp-next-section h2 {
                margin-top: 0;
                margin-bottom: 10px;
                font-size: 18px;
            }

            .wp-next-section p {
                margin-bottom: 15px;
                color: #666;
            }

            .wp-next-section input[type="text"],
            .wp-next-section input[type="checkbox"] {
                padding: 5px;
            }

            .wp-next-section .description {
                display: block;
                margin-top: 8px;
                color: #666;
                font-size: 13px;
            }
        </style>
        <?php
    }
}
