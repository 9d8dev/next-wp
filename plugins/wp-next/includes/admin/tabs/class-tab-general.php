<?php
/**
 * WP Next General Settings Tab
 */

class WP_Next_Tab_General {

    public function get_id() {
        return 'general';
    }

    public function get_label() {
        return 'General';
    }

    public function render($settings) {
        $use_custom = $settings['use_custom_endpoint'] ?? false;
        $custom_endpoint = $settings['custom_endpoint'] ?? '';
        $default_endpoint = rtrim(get_rest_url(), '/');
        $active_endpoint = $use_custom && !empty($custom_endpoint) ? rtrim($custom_endpoint, '/') : $default_endpoint;
        ?>
        <div x-data="{ useCustom: <?php echo json_encode($use_custom); ?>, customEndpoint: '<?php echo esc_attr($custom_endpoint); ?>' }"
             @change="useCustom = $el.checked"
             class="wp-next-general-tab">

            <div class="form-group">
                <label>
                    <input type="checkbox"
                           name="wp_next_settings[use_custom_endpoint]"
                           value="1"
                           <?php checked($use_custom); ?>
                           @change="useCustom = $el.checked">
                    Use Custom REST API Endpoint
                </label>
                <p class="description">Enable this to use a custom REST API endpoint URL.</p>
            </div>

            <div class="form-group" x-show="useCustom">
                <label for="custom_endpoint">Custom Endpoint URL</label>
                <input type="url"
                       id="custom_endpoint"
                       name="wp_next_settings[custom_endpoint]"
                       value="<?php echo esc_attr($custom_endpoint); ?>"
                       placeholder="https://api.example.com"
                       @change="customEndpoint = $el.value"
                       x-model="customEndpoint">
                <p class="description">e.g., https://api.example.com or https://example.com/wp-json</p>
            </div>

            <div class="form-group">
                <label>Current Endpoint</label>
                <div class="preview-box">
                    <strong>Your endpoint:</strong><br>
                    <span x-text="useCustom && customEndpoint ? customEndpoint.replace(/\/$/, '') : '<?php echo esc_js($default_endpoint); ?>'"></span>
                </div>
            </div>
        </div>
        <?php
    }
}