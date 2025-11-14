<?php
/**
 * WP Next Custom Routes Tab
 */

class WP_Next_Tab_Custom_Routes {

    public function get_id() {
        return 'custom-routes';
    }

    public function get_label() {
        return 'Custom Routes';
    }

    public function render($settings) {
        $enable_routes = $settings['enable_custom_routes'] ?? false;
        $expose_data = $settings['expose_data'] ?? array();
        $endpoint = rtrim(get_rest_url(), '/');

        // Get exposed fields for preview
        $exposed_fields = array_keys(array_filter($expose_data, function($v) {
            return $v === true;
        }));

        // Auto-generate route path
        $auto_route_path = $endpoint . '/wp-next/site-info';
        ?>
        <div class="wp-next-custom-routes-tab" x-data="wpNextCustomRoutes(<?php echo json_encode($enable_routes); ?>, <?php echo json_encode($exposed_fields); ?>)" x-cloak>

            <div class="form-group">
                <label>
                    <input type="checkbox"
                           name="wp_next_settings[enable_custom_routes]"
                           value="1"
                           <?php checked($enable_routes); ?>
                           @change="toggleRoutes($event)">
                    Enable Custom Route Data Exposure
                </label>
                <p class="description">Exposes selected site data via a public REST API endpoint.</p>
            </div>

            <div x-show="enableRoutes" style="display: <?php echo $enable_routes ? 'block' : 'none'; ?>; transition: all 0.3s ease;">
                <div class="form-group">
                    <label>Endpoint Path</label>
                    <div class="preview-box" style="border-left: 3px solid #4CAF50;">
                        <strong>GET</strong> <?php echo esc_html($auto_route_path); ?>
                    </div>
                    <p class="description">This endpoint automatically exposes the selected site data below.</p>
                </div>

                <div class="form-group">
                    <label>Expose Data Fields</label>
                    <p class="description">Select which site information to expose. Title and Description are enabled by default.</p>

                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox"
                                   id="expose_title"
                                   name="wp_next_settings[expose_data][title]"
                                   value="1"
                                   disabled
                                   checked>
                            <label for="expose_title"><strong>Site Title</strong> <em style="color: #999;">(always enabled)</em></label>
                            <!-- Hidden input to ensure title is always saved as true -->
                            <input type="hidden" name="wp_next_settings[expose_data][title]" value="1">
                        </div>

                        <div class="checkbox-item">
                            <input type="checkbox"
                                   id="expose_description"
                                   name="wp_next_settings[expose_data][description]"
                                   value="1"
                                   disabled
                                   checked>
                            <label for="expose_description"><strong>Site Description</strong> <em style="color: #999;">(always enabled)</em></label>
                            <!-- Hidden input to ensure description is always saved as true -->
                            <input type="hidden" name="wp_next_settings[expose_data][description]" value="1">
                        </div>

                        <div class="checkbox-item">
                            <input type="checkbox"
                                   id="expose_favicon"
                                   name="wp_next_settings[expose_data][favicon]"
                                   value="1"
                                   <?php checked($expose_data['favicon'] ?? false); ?>
                                   @change="exposedFields.includes('favicon') ? exposedFields = exposedFields.filter(f => f !== 'favicon') : exposedFields.push('favicon');">
                            <label for="expose_favicon">Favicon URL <em style="color: #999;">(optional - not exposed by WordPress by default)</em></label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Response Preview</label>
                    <div class="preview-box">
                        <strong>Returns:</strong><br>
                        {<br>
                        &nbsp;&nbsp;"title": "...",<br>
                        &nbsp;&nbsp;"description": "...",<br>
                        <span x-show="exposedFields.includes('favicon')">&nbsp;&nbsp;"favicon": "...",<br></span>
                        }
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
}