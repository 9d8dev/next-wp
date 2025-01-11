<?php
/**
 * Plugin Name: Next.js Revalidation
 * Description: Triggers Next.js revalidation when WordPress content changes
 * Version: 1.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit;
}

class NextRevalidate {
    private $nextjs_url;
    private $webhook_secret;

    public function __construct() {
        $this->nextjs_url = defined('NEXTJS_URL') ? NEXTJS_URL : '';
        $this->webhook_secret = defined('NEXTJS_WEBHOOK_SECRET') ? NEXTJS_WEBHOOK_SECRET : '';

        // Post actions
        add_action('save_post', array($this, 'handle_post_update'), 10, 3);
        add_action('delete_post', array($this, 'handle_post_delete'));
        add_action('trash_post', array($this, 'handle_post_delete'));

        // Term actions
        add_action('edited_term', array($this, 'handle_term_update'), 10, 3);
        add_action('delete_term', array($this, 'handle_term_delete'), 10, 3);

        // Add settings page
        add_action('admin_menu', array($this, 'add_settings_page'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function handle_post_update($post_id, $post, $update) {
        if (wp_is_post_revision($post_id)) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

        $this->trigger_revalidation('post', null, $post_id);
    }

    public function handle_post_delete($post_id) {
        if (wp_is_post_revision($post_id)) return;

        $this->trigger_revalidation('post', null, $post_id);
    }

    public function handle_term_update($term_id, $tt_id, $taxonomy) {
        $this->trigger_revalidation('term', $taxonomy, $term_id);
    }

    public function handle_term_delete($term_id, $tt_id, $taxonomy) {
        $this->trigger_revalidation('term', $taxonomy, $term_id);
    }

    private function trigger_revalidation($type, $subtype, $id) {
        if (empty($this->nextjs_url) || empty($this->webhook_secret)) {
            return;
        }

        $revalidate_url = trailingslashit($this->nextjs_url) . 'api/revalidate';

        $response = wp_remote_post($revalidate_url, array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'x-webhook-secret' => $this->webhook_secret
            ),
            'body' => json_encode(array(
                'type' => $type,
                'subtype' => $subtype,
                'id' => $id
            ))
        ));

        if (is_wp_error($response)) {
            error_log('Next.js revalidation failed: ' . $response->get_error_message());
        }
    }

    public function add_settings_page() {
        add_options_page(
            'Next.js Revalidation Settings',
            'Next.js Revalidation',
            'manage_options',
            'nextjs-revalidation',
            array($this, 'render_settings_page')
        );
    }

    public function register_settings() {
        register_setting('nextjs_revalidate_options', 'nextjs_url');
        register_setting('nextjs_revalidate_options', 'nextjs_webhook_secret');
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h2>Next.js Revalidation Settings</h2>
            <form method="post" action="options.php">
                <?php settings_fields('nextjs_revalidate_options'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row">Next.js URL</th>
                        <td>
                            <input type="url" name="nextjs_url" value="<?php echo esc_attr(get_option('nextjs_url')); ?>" class="regular-text">
                            <p class="description">The URL of your Next.js application (e.g., https://your-site.com)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Webhook Secret</th>
                        <td>
                            <input type="text" name="nextjs_webhook_secret" value="<?php echo esc_attr(get_option('nextjs_webhook_secret')); ?>" class="regular-text">
                            <p class="description">A secret key to secure the webhook (must match WORDPRESS_WEBHOOK_SECRET in your Next.js app)</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}

new NextRevalidate();
