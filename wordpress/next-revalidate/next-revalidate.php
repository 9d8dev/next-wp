<?php
/**
 * Plugin Name: Next.js Revalidation
 * Plugin URI: https://github.com/9d8dev/next-wp
 * Description: Automatically revalidate Next.js cache when WordPress content changes
 * Version: 1.1.0
 * Author: 9d8
 * Author URI: https://9d8.dev
 * License: MIT
 */

if (!defined('ABSPATH')) {
    exit;
}

class NextRevalidate {
    private $option_name = 'next_revalidate_settings';
    private $log_option = 'next_revalidate_log';
    private $last_option = 'next_revalidate_last';

    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);

        // Hook into content changes
        add_action('save_post', [$this, 'on_post_change'], 10, 3);
        add_action('delete_post', [$this, 'on_post_delete']);
        add_action('transition_post_status', [$this, 'on_status_change'], 10, 3);

        // Hook into taxonomy changes
        add_action('created_term', [$this, 'on_term_change'], 10, 3);
        add_action('edited_term', [$this, 'on_term_change'], 10, 3);
        add_action('delete_term', [$this, 'on_term_change'], 10, 3);
    }

    public function add_admin_menu() {
        add_options_page(
            'Next.js Revalidation',
            'Next.js Revalidation',
            'manage_options',
            'next-revalidate',
            [$this, 'settings_page']
        );
    }

    public function register_settings() {
        register_setting($this->option_name, $this->option_name, [
            'sanitize_callback' => [$this, 'sanitize_settings']
        ]);

        add_settings_section(
            'next_revalidate_main',
            'Configuration',
            null,
            'next-revalidate'
        );

        add_settings_field('nextjs_url', 'Next.js Site URL', [$this, 'field_nextjs_url'], 'next-revalidate', 'next_revalidate_main');
        add_settings_field('webhook_secret', 'Webhook Secret', [$this, 'field_webhook_secret'], 'next-revalidate', 'next_revalidate_main');
        add_settings_field('cooldown', 'Cooldown (seconds)', [$this, 'field_cooldown'], 'next-revalidate', 'next_revalidate_main');
        add_settings_field('max_retries', 'Max Retries', [$this, 'field_max_retries'], 'next-revalidate', 'next_revalidate_main');
        add_settings_field('debug_mode', 'Debug Mode', [$this, 'field_debug_mode'], 'next-revalidate', 'next_revalidate_main');
    }

    public function sanitize_settings($input) {
        $sanitized = [];
        $sanitized['nextjs_url'] = esc_url_raw(rtrim($input['nextjs_url'] ?? '', '/'));
        $sanitized['webhook_secret'] = sanitize_text_field($input['webhook_secret'] ?? '');
        $sanitized['cooldown'] = absint($input['cooldown'] ?? 2);
        $sanitized['max_retries'] = min(10, max(0, absint($input['max_retries'] ?? 3)));
        $sanitized['debug_mode'] = !empty($input['debug_mode']);
        return $sanitized;
    }

    public function field_nextjs_url() {
        $options = get_option($this->option_name);
        $value = $options['nextjs_url'] ?? '';
        echo '<input type="url" name="' . $this->option_name . '[nextjs_url]" value="' . esc_attr($value) . '" class="regular-text" placeholder="https://your-nextjs-site.com" />';
        echo '<p class="description">The URL of your Next.js application (without trailing slash)</p>';
    }

    public function field_webhook_secret() {
        $options = get_option($this->option_name);
        $value = $options['webhook_secret'] ?? '';
        echo '<input type="text" name="' . $this->option_name . '[webhook_secret]" value="' . esc_attr($value) . '" class="regular-text" />';
        echo '<p class="description">Must match WORDPRESS_WEBHOOK_SECRET in your Next.js environment</p>';
    }

    public function field_cooldown() {
        $options = get_option($this->option_name);
        $value = $options['cooldown'] ?? 2;
        echo '<input type="number" name="' . $this->option_name . '[cooldown]" value="' . esc_attr($value) . '" min="0" max="60" class="small-text" /> seconds';
        echo '<p class="description">Minimum time between revalidation requests (prevents spam)</p>';
    }

    public function field_max_retries() {
        $options = get_option($this->option_name);
        $value = $options['max_retries'] ?? 3;
        echo '<input type="number" name="' . $this->option_name . '[max_retries]" value="' . esc_attr($value) . '" min="0" max="10" class="small-text" />';
        echo '<p class="description">Number of retry attempts for failed requests (with exponential backoff)</p>';
    }

    public function field_debug_mode() {
        $options = get_option($this->option_name);
        $checked = !empty($options['debug_mode']) ? 'checked' : '';
        echo '<label><input type="checkbox" name="' . $this->option_name . '[debug_mode]" value="1" ' . $checked . ' /> Enable debug logging</label>';
        echo '<p class="description">Logs detailed request/response info to PHP error log</p>';
    }

    public function settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $last = get_option($this->last_option);
        $log = get_option($this->log_option, []);
        ?>
        <div class="wrap">
            <h1>Next.js Revalidation Settings</h1>

            <?php if ($last): ?>
            <div class="notice notice-<?php echo $last['success'] ? 'success' : 'error'; ?>">
                <p>
                    <strong>Last revalidation:</strong>
                    <?php echo esc_html(date('Y-m-d H:i:s', $last['time'])); ?> —
                    Type: <?php echo esc_html($last['type']); ?> —
                    Status: <?php echo $last['success'] ? '✓ Success' : '✗ Failed'; ?>
                    <?php if (!empty($last['error'])): ?>
                        — Error: <?php echo esc_html($last['error']); ?>
                    <?php endif; ?>
                    <?php if (!empty($last['http_code'])): ?>
                        — HTTP <?php echo esc_html($last['http_code']); ?>
                    <?php endif; ?>
                </p>
            </div>
            <?php endif; ?>

            <form method="post" action="options.php">
                <?php
                settings_fields($this->option_name);
                do_settings_sections('next-revalidate');
                submit_button();
                ?>
            </form>

            <hr>
            <h2>Test Connection</h2>
            <p>
                <button type="button" class="button button-secondary" onclick="testRevalidation()">Send Test Request</button>
                <span id="test-result" style="margin-left: 10px;"></span>
            </p>

            <hr>
            <h2>Recent Activity</h2>
            <?php if (!empty($log)): ?>
            <p>
                <button type="button" class="button button-secondary" onclick="clearLog()">Clear Log</button>
                <span id="clear-result" style="margin-left: 10px;"></span>
            </p>
            <table class="widefat striped" style="margin-top: 10px;">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Action</th>
                        <th>Status</th>
                        <th>HTTP</th>
                        <th>Retries</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (array_slice($log, 0, 50) as $entry): ?>
                    <tr>
                        <td><?php echo esc_html(date('Y-m-d H:i:s', $entry['time'])); ?></td>
                        <td><?php echo esc_html($entry['type']); ?></td>
                        <td><?php echo esc_html($entry['data']['action'] ?? '-'); ?></td>
                        <td><?php echo $entry['success'] ? '<span style="color:green;">✓</span>' : '<span style="color:red;">✗</span>'; ?></td>
                        <td><?php echo esc_html($entry['http_code'] ?? '-'); ?></td>
                        <td><?php echo esc_html($entry['retries'] ?? 0); ?></td>
                        <td>
                            <?php if (!empty($entry['error'])): ?>
                                <span style="color:red;"><?php echo esc_html($entry['error']); ?></span>
                            <?php elseif (!empty($entry['data']['slug'])): ?>
                                <?php echo esc_html($entry['data']['slug']); ?>
                            <?php else: ?>
                                -
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <?php else: ?>
            <p>No revalidation requests yet.</p>
            <?php endif; ?>

            <script>
            function testRevalidation() {
                const result = document.getElementById('test-result');
                result.textContent = 'Sending...';
                result.style.color = '';

                fetch(ajaxurl, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: 'action=next_revalidate_test'
                })
                .then(r => r.json())
                .then(data => {
                    result.textContent = data.success ? '✓ ' + data.data : '✗ ' + data.data;
                    result.style.color = data.success ? 'green' : 'red';
                })
                .catch(e => {
                    result.textContent = '✗ Error: ' + e.message;
                    result.style.color = 'red';
                });
            }

            function clearLog() {
                if (!confirm('Clear all log entries?')) return;

                const result = document.getElementById('clear-result');
                result.textContent = 'Clearing...';

                fetch(ajaxurl, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: 'action=next_revalidate_clear_log'
                })
                .then(r => r.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        result.textContent = '✗ ' + data.data;
                        result.style.color = 'red';
                    }
                })
                .catch(e => {
                    result.textContent = '✗ Error: ' + e.message;
                    result.style.color = 'red';
                });
            }
            </script>
        </div>
        <?php
    }

    public function on_post_change($post_id, $post, $update) {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        if ($post->post_status !== 'publish') {
            return;
        }

        $this->trigger_revalidation('post', [
            'id' => $post_id,
            'slug' => $post->post_name,
            'type' => $post->post_type,
            'action' => $update ? 'update' : 'create'
        ]);
    }

    public function on_post_delete($post_id) {
        $post = get_post($post_id);
        if (!$post || $post->post_status !== 'publish') {
            return;
        }

        $this->trigger_revalidation('post', [
            'id' => $post_id,
            'slug' => $post->post_name,
            'type' => $post->post_type,
            'action' => 'delete'
        ]);
    }

    public function on_status_change($new_status, $old_status, $post) {
        if ($new_status === $old_status) {
            return;
        }

        if ($old_status === 'publish' || $new_status === 'publish') {
            $this->trigger_revalidation('post', [
                'id' => $post->ID,
                'slug' => $post->post_name,
                'type' => $post->post_type,
                'action' => 'status_change',
                'old_status' => $old_status,
                'new_status' => $new_status
            ]);
        }
    }

    public function on_term_change($term_id, $tt_id, $taxonomy) {
        $term = get_term($term_id, $taxonomy);
        $this->trigger_revalidation('term', [
            'id' => $term_id,
            'slug' => $term ? $term->slug : '',
            'taxonomy' => $taxonomy,
            'action' => current_action()
        ]);
    }

    private function trigger_revalidation($type, $data) {
        $options = get_option($this->option_name);

        if (empty($options['nextjs_url'])) {
            return;
        }

        // Check cooldown
        $cooldown = $options['cooldown'] ?? 2;
        $last = get_option($this->last_option);
        if ($last && (time() - $last['time']) < $cooldown) {
            $this->debug_log('Skipped: cooldown active');
            return;
        }

        $max_retries = $options['max_retries'] ?? 3;
        $result = $this->send_with_retry($type, $data, $max_retries);

        // Update last status
        update_option($this->last_option, [
            'time' => time(),
            'type' => $type,
            'success' => $result['success'],
            'http_code' => $result['http_code'],
            'error' => $result['error']
        ]);

        // Add to log
        $this->add_log_entry([
            'time' => time(),
            'type' => $type,
            'data' => $data,
            'success' => $result['success'],
            'http_code' => $result['http_code'],
            'error' => $result['error'],
            'retries' => $result['retries']
        ]);
    }

    private function send_with_retry($type, $data, $max_retries, $attempt = 0) {
        $result = $this->send_request($type, $data);

        if (!$result['success'] && $attempt < $max_retries) {
            $delay = pow(2, $attempt); // Exponential backoff: 1, 2, 4, 8...
            $this->debug_log("Retry {$attempt}/{$max_retries} after {$delay}s delay");
            sleep($delay);
            return $this->send_with_retry($type, $data, $max_retries, $attempt + 1);
        }

        $result['retries'] = $attempt;
        return $result;
    }

    private function send_request($type, $data) {
        $options = get_option($this->option_name);
        $url = $options['nextjs_url'] . '/api/revalidate';
        $secret = $options['webhook_secret'] ?? '';

        $payload = [
            'type' => $type,
            'data' => $data,
            'timestamp' => time()
        ];

        $this->debug_log("Sending request to {$url}", $payload);

        $response = wp_remote_post($url, [
            'timeout' => 15,
            'headers' => [
                'Content-Type' => 'application/json',
                'x-webhook-secret' => $secret
            ],
            'body' => json_encode($payload)
        ]);

        if (is_wp_error($response)) {
            $error = $response->get_error_message();
            $this->debug_log("Request failed: {$error}");
            return [
                'success' => false,
                'http_code' => null,
                'error' => $error
            ];
        }

        $http_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $success = $http_code === 200;

        $this->debug_log("Response: HTTP {$http_code}", $body);

        return [
            'success' => $success,
            'http_code' => $http_code,
            'error' => $success ? null : "HTTP {$http_code}"
        ];
    }

    private function add_log_entry($entry) {
        $log = get_option($this->log_option, []);
        array_unshift($log, $entry);
        $log = array_slice($log, 0, 50); // Keep last 50
        update_option($this->log_option, $log);
    }

    private function debug_log($message, $data = null) {
        $options = get_option($this->option_name);
        if (empty($options['debug_mode'])) {
            return;
        }

        $log_message = '[Next.js Revalidation] ' . $message;
        if ($data !== null) {
            $log_message .= ' - ' . (is_string($data) ? $data : json_encode($data));
        }
        error_log($log_message);
    }
}

// Initialize plugin
add_action('init', function() {
    new NextRevalidate();
});

// AJAX handler for test button
add_action('wp_ajax_next_revalidate_test', function() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized');
    }

    $options = get_option('next_revalidate_settings');

    if (empty($options['nextjs_url'])) {
        wp_send_json_error('Next.js URL not configured');
    }

    $url = $options['nextjs_url'] . '/api/revalidate';
    $secret = $options['webhook_secret'] ?? '';

    $response = wp_remote_post($url, [
        'timeout' => 15,
        'headers' => [
            'Content-Type' => 'application/json',
            'x-webhook-secret' => $secret
        ],
        'body' => json_encode([
            'type' => 'test',
            'data' => ['message' => 'Test from WordPress'],
            'timestamp' => time()
        ])
    ]);

    if (is_wp_error($response)) {
        wp_send_json_error($response->get_error_message());
    }

    $code = wp_remote_retrieve_response_code($response);
    if ($code !== 200) {
        wp_send_json_error('HTTP ' . $code . ' - ' . wp_remote_retrieve_body($response));
    }

    wp_send_json_success('Connection successful!');
});

// AJAX handler for clearing log
add_action('wp_ajax_next_revalidate_clear_log', function() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized');
    }

    delete_option('next_revalidate_log');
    wp_send_json_success('Log cleared');
});
