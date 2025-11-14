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
        $home_url = rtrim(home_url(), '/');
        $default_endpoint = rtrim(get_rest_url(), '/');
        ?>
        <div x-data="{
            useCustom: <?php echo json_encode($use_custom); ?>,
            customEndpoint: '<?php echo esc_attr($custom_endpoint); ?>',
            homeUrl: '<?php echo esc_attr($home_url); ?>'
        }" class="wp-next-general-tab">

            <div class="form-group">
                <label>
                    <input type="checkbox"
                           name="wp_next_settings[use_custom_endpoint]"
                           value="1"
                           <?php checked($use_custom); ?>
                           @change="useCustom = $el.checked">
                    Change default REST API endpoint
                </label>
                <p class="description">Recommended: enable to give your endpoint a custom name to avoid conflicts.</p>
            </div>

            <div class="form-group" x-show="useCustom" style="display: <?php echo $use_custom ? 'block' : 'none'; ?>">
                <label for="custom_endpoint">Endpoint Path Name</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="color: #666;"><?php echo esc_html($home_url); ?>/</span>
                    <input type="text"
                           id="custom_endpoint"
                           name="wp_next_settings[custom_endpoint]"
                           value="<?php echo esc_attr($custom_endpoint); ?>"
                           placeholder="my-json"
                           style="flex: 1; max-width: none;"
                           @change="customEndpoint = $el.value"
                           @input="customEndpoint = $el.value"
                           x-model="customEndpoint">
                </div>
                <p class="description">e.g., <code>my-json</code> or <code>custom-api</code> - this will create your endpoint at <code><?php echo esc_html($home_url); ?>/my-json</code></p>
            </div>

            <div class="form-group">
                <label>Current Endpoint</label>
                <div class="preview-box">
                    <strong>Your endpoint:</strong><br>
                    <span x-text="useCustom && customEndpoint ? (homeUrl + '/' + customEndpoint.replace(/^\\//, '')) : '<?php echo esc_js($default_endpoint); ?>'"></span>
                </div>
            </div>
        </div>
        <?php
    }
}