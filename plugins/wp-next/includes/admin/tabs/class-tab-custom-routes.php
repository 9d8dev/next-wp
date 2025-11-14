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
        $route_path = $settings['custom_route_path'] ?? '/wp-json/wp-next/site-info';
        $expose_data = $settings['expose_data'] ?? array();

        // Get exposed fields for preview
        $exposed_fields = array_keys(array_filter($expose_data, function($v) {
            return $v === true;
        }));
        ?>
        <div x-data="{ enableRoutes: <?php echo json_encode($enable_routes); ?>, routePath: '<?php echo esc_attr($route_path); ?>', exposedFields: <?php echo json_encode($exposed_fields); ?> }"
             @change="if($el.name === 'wp_next_settings[enable_custom_routes]') enableRoutes = $el.checked"
             class="wp-next-custom-routes-tab">

            <div class="form-group">
                <label>
                    <input type="checkbox"
                           name="wp_next_settings[enable_custom_routes]"
                           value="1"
                           <?php checked($enable_routes); ?>
                           @change="enableRoutes = $el.checked">
                    Enable Custom Route Data Exposure
                </label>
                <p class="description">Exposes selected site data via a public REST API endpoint.</p>
            </div>

            <div x-show="enableRoutes">
                <div class="form-group">
                    <label for="custom_route_path">Route Path</label>
                    <input type="text"
                           id="custom_route_path"
                           name="wp_next_settings[custom_route_path]"
                           value="<?php echo esc_attr($route_path); ?>"
                           placeholder="/wp-json/wp-next/site-info"
                           x-model="routePath"
                           @change="routePath = $el.value">
                    <p class="description">The endpoint path where data will be exposed. Must start with /</p>
                </div>

                <div class="form-group">
                    <label>Expose Data Fields</label>
                    <p class="description">Select which site information to expose via the custom route.</p>

                    <div class="checkbox-group">
                        <div class="checkbox-item">
                            <input type="checkbox"
                                   id="expose_title"
                                   name="wp_next_settings[expose_data][title]"
                                   value="1"
                                   <?php checked($expose_data['title'] ?? false); ?>
                                   @change="exposedFields = Array.from(document.querySelectorAll('input[name^=\"wp_next_settings[expose_data]\"]')).filter(el => el.checked).map(el => el.id.replace('expose_', ''))">
                            <label for="expose_title">Site Title</label>
                        </div>

                        <div class="checkbox-item">
                            <input type="checkbox"
                                   id="expose_description"
                                   name="wp_next_settings[expose_data][description]"
                                   value="1"
                                   <?php checked($expose_data['description'] ?? false); ?>
                                   @change="exposedFields = Array.from(document.querySelectorAll('input[name^=\"wp_next_settings[expose_data]\"]')).filter(el => el.checked).map(el => el.id.replace('expose_', ''))">
                            <label for="expose_description">Site Description</label>
                        </div>

                        <div class="checkbox-item">
                            <input type="checkbox"
                                   id="expose_favicon"
                                   name="wp_next_settings[expose_data][favicon]"
                                   value="1"
                                   <?php checked($expose_data['favicon'] ?? false); ?>
                                   @change="exposedFields = Array.from(document.querySelectorAll('input[name^=\"wp_next_settings[expose_data]\"]')).filter(el => el.checked).map(el => el.id.replace('expose_', ''))">
                            <label for="expose_favicon">Favicon URL</label>
                        </div>

                        <div class="checkbox-item">
                            <input type="checkbox"
                                   id="expose_language"
                                   name="wp_next_settings[expose_data][language]"
                                   value="1"
                                   <?php checked($expose_data['language'] ?? false); ?>
                                   @change="exposedFields = Array.from(document.querySelectorAll('input[name^=\"wp_next_settings[expose_data]\"]')).filter(el => el.checked).map(el => el.id.replace('expose_', ''))">
                            <label for="expose_language">Language</label>
                        </div>

                        <div class="checkbox-item">
                            <input type="checkbox"
                                   id="expose_timezone"
                                   name="wp_next_settings[expose_data][timezone]"
                                   value="1"
                                   <?php checked($expose_data['timezone'] ?? false); ?>
                                   @change="exposedFields = Array.from(document.querySelectorAll('input[name^=\"wp_next_settings[expose_data]\"]')).filter(el => el.checked).map(el => el.id.replace('expose_', ''))">
                            <label for="expose_timezone">Timezone</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Endpoint Preview</label>
                    <div class="preview-box">
                        <strong>GET</strong> <span x-text="routePath"></span><br><br>
                        <strong>Returns:</strong> { <span x-text="exposedFields.length > 0 ? exposedFields.join(', ') : '(no fields selected)'"></span> }
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
}