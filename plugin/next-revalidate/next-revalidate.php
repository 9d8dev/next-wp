<?php
/**
 * Plugin Name: Next.js Revalidation
 * Description: Revalidates Next.js site when WordPress content changes
 * Version: 1.0.3
 * Author: 9d8
 * Author URI: https://9d8.dev
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Next_Revalidation {
    private $options;
    private $option_name = 'next_revalidation_settings';

    public function __construct() {
        // Initialize plugin
        add_action('init', array($this, 'init'));
        // Register AJAX actions for manual revalidation
        add_action('init', array($this, 'register_ajax_actions'));
        
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
        
        // Add admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Post save/update hooks - any post status change
        add_action('transition_post_status', array($this, 'on_post_status_change'), 10, 3);
        add_action('save_post', array($this, 'on_content_change'), 10, 3);
        add_action('wp_trash_post', array($this, 'on_post_trash'), 10);
        add_action('untrash_post', array($this, 'on_post_untrash'), 10);
        add_action('before_delete_post', array($this, 'on_post_delete'), 10);
        
        // Term changes
        add_action('created_term', array($this, 'on_term_change'), 10, 3);
        add_action('edited_term', array($this, 'on_term_change'), 10, 3);
        add_action('delete_term', array($this, 'on_term_change'), 10, 3);
        
        // User changes
        add_action('profile_update', array($this, 'on_user_change'), 10);
        add_action('user_register', array($this, 'on_user_change'), 10);
        add_action('deleted_user', array($this, 'on_user_change'), 10);
        
        // Media changes
        add_action('add_attachment', array($this, 'on_media_change'), 10);
        add_action('edit_attachment', array($this, 'on_media_change'), 10);
        add_action('delete_attachment', array($this, 'on_media_change'), 10);
    }

    public function init() {
        $this->options = get_option($this->option_name);
    }

    public function register_settings() {
        register_setting(
            'next_revalidation_group',
            $this->option_name,
            array($this, 'sanitize_settings')
        );

        add_settings_section(
            'next_revalidation_section',
            'Next.js Revalidation Settings',
            array($this, 'settings_section_callback'),
            'next-revalidation-settings'
        );

        add_settings_field(
            'next_url',
            'Next.js Site URL',
            array($this, 'next_url_callback'),
            'next-revalidation-settings',
            'next_revalidation_section'
        );

        add_settings_field(
            'webhook_secret',
            'Webhook Secret',
            array($this, 'webhook_secret_callback'),
            'next-revalidation-settings',
            'next_revalidation_section'
        );
        
        add_settings_field(
            'enable_notifications',
            'Enable Notifications',
            array($this, 'enable_notifications_callback'),
            'next-revalidation-settings',
            'next_revalidation_section'
        );
    }

    public function sanitize_settings($input) {
        $new_input = array();
        
        if (isset($input['next_url'])) {
            // Normalize and sanitize Next.js site URL (remove trailing slash)
            $url = rtrim(trim($input['next_url']), '/');
            $new_input['next_url'] = esc_url_raw($url);
        }
        
        if(isset($input['webhook_secret'])) {
            $new_input['webhook_secret'] = sanitize_text_field($input['webhook_secret']);
        }
        
        if(isset($input['enable_notifications'])) {
            $new_input['enable_notifications'] = (bool)$input['enable_notifications'];
        }
        
        return $new_input;
    }

    public function settings_section_callback() {
        echo '<p>Configure the connection to your Next.js site for revalidation.</p>';
    }

    public function next_url_callback() {
        $value = isset($this->options['next_url']) ? esc_attr($this->options['next_url']) : '';
        echo '<input type="url" id="next_url" name="' . $this->option_name . '[next_url]" value="' . $value . '" class="regular-text" placeholder="https://your-next-site.com" />';
        echo '<p class="description">Your Next.js site URL without trailing slash.</p>';
    }

    public function webhook_secret_callback() {
        $value = isset($this->options['webhook_secret']) ? esc_attr($this->options['webhook_secret']) : '';
        echo '<input type="text" id="webhook_secret" name="' . $this->option_name . '[webhook_secret]" value="' . $value . '" class="regular-text" />';
        echo '<p class="description">This should match the WORDPRESS_WEBHOOK_SECRET in your Next.js environment.</p>';
    }

    public function enable_notifications_callback() {
        $value = isset($this->options['enable_notifications']) ? (bool)$this->options['enable_notifications'] : false;
        echo '<input type="checkbox" id="enable_notifications" name="' . $this->option_name . '[enable_notifications]" ' . checked($value, true, false) . ' />';
        echo '<label for="enable_notifications">Show admin notifications for revalidation events</label>';
    }

    public function add_admin_menu() {
        add_options_page(
            'Next.js Revalidation',
            'Next.js Revalidation',
            'manage_options',
            'next-revalidation-settings',
            array($this, 'admin_page_content')
        );
    }

    public function admin_page_content() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('next_revalidation_group');
                do_settings_sections('next-revalidation-settings');
                submit_button('Save Settings');
                ?>
            </form>
            <hr>
            <h2>Manual Revalidation</h2>
            <p>Click the button below to manually trigger a full revalidation of your Next.js site.</p>
            <button id="manual-revalidate" class="button button-primary">Revalidate All Content</button>
            <div id="revalidation-result" style="margin-top: 10px;"></div>
            
            <script>
                jQuery(document).ready(function($) {
                    $('#manual-revalidate').on('click', function(e) {
                        e.preventDefault();
                        
                        $(this).prop('disabled', true).text('Revalidating...');
                        $('#revalidation-result').html('');
                        
                        $.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                action: 'manual_revalidation',
                                nonce: '<?php echo wp_create_nonce('next_revalidation_nonce'); ?>'
                            },
                            success: function(response) {
                                $('#revalidation-result').html('<div class="notice notice-success inline"><p>' + response.data + '</p></div>');
                                $('#manual-revalidate').prop('disabled', false).text('Revalidate All Content');
                            },
                            error: function() {
                                $('#revalidation-result').html('<div class="notice notice-error inline"><p>Failed to revalidate. Please check your settings and try again.</p></div>');
                                $('#manual-revalidate').prop('disabled', false).text('Revalidate All Content');
                            }
                        });
                    });
                });
            </script>
        </div>
        <?php
    }
    
    // AJAX action for manual revalidation
    public function register_ajax_actions() {
        add_action('wp_ajax_manual_revalidation', array($this, 'handle_manual_revalidation'));
    }
    
    public function handle_manual_revalidation() {
        check_ajax_referer('next_revalidation_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Permission denied');
            return;
        }
        
        $result = $this->send_revalidation_request('all');
        
        if ($result) {
            wp_send_json_success('Successfully revalidated all content on your Next.js site.');
        } else {
            wp_send_json_error('Failed to revalidate content. Please check your settings.');
        }
    }

    // Triggered when a post changes status (draft, publish, trash, etc.)
    public function on_post_status_change($new_status, $old_status, $post) {
        // Skip if it's a revision or autosave
        if (wp_is_post_revision($post->ID) || wp_is_post_autosave($post->ID)) {
            return;
        }
        
        // If the status is changing, we should revalidate
        if ($new_status !== $old_status) {
            $this->send_revalidation_request($post->post_type, $post->ID);
        }
    }

    public function on_content_change($post_id, $post = null, $update = null) {
        // Don't revalidate on autosave or revision
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }
        
        // Get the post if not provided
        if (null === $post) {
            $post = get_post($post_id);
        }
        
        // Revalidate regardless of post status
        $this->send_revalidation_request($post->post_type, $post_id);
    }

    public function on_post_trash($post_id) {
        $post_type = get_post_type($post_id);
        $this->send_revalidation_request($post_type, $post_id);
    }

    public function on_post_untrash($post_id) {
        $post_type = get_post_type($post_id);
        $this->send_revalidation_request($post_type, $post_id);
    }

    public function on_post_delete($post_id) {
        $post_type = get_post_type($post_id);
        $this->send_revalidation_request($post_type, $post_id);
    }

    public function on_term_change($term_id, $tt_id, $taxonomy) {
        // Map taxonomy to content type
        $content_type = $taxonomy;
        if ($taxonomy === 'category') {
            $content_type = 'category';
        } elseif ($taxonomy === 'post_tag') {
            $content_type = 'tag';
        }
        
        $this->send_revalidation_request($content_type, $term_id);
    }

    public function on_user_change($user_id) {
        $this->send_revalidation_request('author', $user_id);
    }

    public function on_media_change($attachment_id) {
        $this->send_revalidation_request('media', $attachment_id);
    }

    private function send_revalidation_request($content_type, $content_id = null) {
        // Check if we have the required settings
        if (empty($this->options['next_url']) || empty($this->options['webhook_secret'])) {
            if (!empty($this->options['enable_notifications'])) {
                add_action('admin_notices', function() {
                    echo '<div class="notice notice-error is-dismissible"><p>Next.js revalidation failed: Missing URL or webhook secret. Please configure the plugin settings.</p></div>';
                });
            }
            return false;
        }

        // Prepare API endpoint
        $endpoint = trailingslashit($this->options['next_url']) . 'api/revalidate';
        
        // Prepare request payload
        $payload = array(
            'contentType' => $content_type,
        );
        
        if ($content_id !== null) {
            $payload['contentId'] = $content_id;
        }

        // Send revalidation request
        $response = wp_remote_post($endpoint, array(
            'method' => 'POST',
            'timeout' => 5,
            'redirection' => 5,
            'httpversion' => '1.1',
            'headers' => array(
                'Content-Type' => 'application/json',
                'x-webhook-secret' => $this->options['webhook_secret']
            ),
            'body' => json_encode($payload),
            'sslverify' => true
        ));

        // Check for success
        if (is_wp_error($response)) {
            error_log('Next.js revalidation error: ' . $response->get_error_message());
            if (!empty($this->options['enable_notifications'])) {
                add_action('admin_notices', function() use ($response) {
                    echo '<div class="notice notice-error is-dismissible"><p>Next.js revalidation failed: ' . esc_html($response->get_error_message()) . '</p></div>';
                });
            }
            return false;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $success = $status_code >= 200 && $status_code < 300;
        
        if ($success) {
            if (!empty($this->options['enable_notifications'])) {
                add_action('admin_notices', function() use ($content_type, $content_id) {
                    echo '<div class="notice notice-success is-dismissible"><p>Next.js site revalidated successfully due to ' . esc_html($content_type) . ' update' . ($content_id ? ' (ID: ' . esc_html($content_id) . ')' : '') . '</p></div>';
                });
            }
            return true;
        } else {
            $body = wp_remote_retrieve_body($response);
            error_log('Next.js revalidation failed: ' . $body);
            if (!empty($this->options['enable_notifications'])) {
                add_action('admin_notices', function() use ($status_code, $body) {
                    echo '<div class="notice notice-error is-dismissible"><p>Next.js revalidation failed with status ' . esc_html($status_code) . ': ' . esc_html($body) . '</p></div>';
                });
            }
            return false;
        }
    }
}

// Initialize the plugin
$next_revalidation = new Next_Revalidation();