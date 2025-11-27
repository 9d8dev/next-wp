<?php
/**
 * Plugin Name: Next.js Revalidation
 * Plugin URI: https://github.com/9d8dev/next-wp
 * Description: Automatically revalidate Next.js cache when WordPress content changes
 * Version: 1.0.0
 * Author: 9d8
 * Author URI: https://9d8.dev
 * License: MIT
 */

if (!defined('ABSPATH')) {
    exit;
}

class NextRevalidate {
    private $option_name = 'next_revalidate_settings';
    private $last_revalidation = 'next_revalidate_last';

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

        add_settings_field(
            'nextjs_url',
            'Next.js Site URL',
            [$this, 'field_nextjs_url'],
            'next-revalidate',
            'next_revalidate_main'
        );

        add_settings_field(
            'webhook_secret',
            'Webhook Secret',
            [$this, 'field_webhook_secret'],
            'next-revalidate',
            'next_revalidate_main'
        );

        add_settings_field(
            'cooldown',
            'Cooldown (seconds)',
            [$this, 'field_cooldown'],
            'next-revalidate',
            'next_revalidate_main'
        );
    }

    public function sanitize_settings($input) {
        $sanitized = [];
        $sanitized['nextjs_url'] = esc_url_raw(rtrim($input['nextjs_url'] ?? '', '/'));
        $sanitized['webhook_secret'] = sanitize_text_field($input['webhook_secret'] ?? '');
        $sanitized['cooldown'] = absint($input['cooldown'] ?? 2);
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
        echo '<input type="number" name="' . $this->option_name . '[cooldown]" value="' . esc_attr($value) . '" min="0" max="60" class="small-text" />';
        echo '<p class="description">Minimum seconds between revalidation requests (prevents spam)</p>';
    }

    public function settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        $last = get_option($this->last_revalidation);
        ?>
        <div class="wrap">
            <h1>Next.js Revalidation Settings</h1>

            <?php if ($last): ?>
            <div class="notice notice-info">
                <p>Last revalidation: <?php echo esc_html(date('Y-m-d H:i:s', $last['time'])); ?>
                - Type: <?php echo esc_html($last['type']); ?>
                - Status: <?php echo $last['success'] ? 'Success' : 'Failed'; ?></p>
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
            <h2>Test Revalidation</h2>
            <p>
                <button type="button" class="button" onclick="testRevalidation()">Send Test Request</button>
                <span id="test-result"></span>
            </p>

            <script>
            function testRevalidation() {
                const result = document.getElementById('test-result');
                result.textContent = 'Sending...';

                fetch(ajaxurl, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: 'action=next_revalidate_test'
                })
                .then(r => r.json())
                .then(data => {
                    result.textContent = data.success ? 'Success!' : 'Failed: ' + data.data;
                })
                .catch(e => {
                    result.textContent = 'Error: ' + e.message;
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
        $this->trigger_revalidation('term', [
            'id' => $term_id,
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
        $last = get_option($this->last_revalidation);
        if ($last && (time() - $last['time']) < $cooldown) {
            return;
        }

        $url = $options['nextjs_url'] . '/api/revalidate';
        $secret = $options['webhook_secret'] ?? '';

        $payload = [
            'type' => $type,
            'data' => $data,
            'timestamp' => time()
        ];

        $response = wp_remote_post($url, [
            'timeout' => 10,
            'headers' => [
                'Content-Type' => 'application/json',
                'x-webhook-secret' => $secret
            ],
            'body' => json_encode($payload)
        ]);

        $success = !is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200;

        update_option($this->last_revalidation, [
            'time' => time(),
            'type' => $type,
            'success' => $success
        ]);
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
        'timeout' => 10,
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
        wp_send_json_error('HTTP ' . $code);
    }

    wp_send_json_success('Revalidation triggered successfully');
});
