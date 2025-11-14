<?php
/**
 * WP Next Main Plugin Class
 * Orchestrates all plugin functionality
 */

class WP_Next {
    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }

    /**
     * Load all plugin dependencies
     */
    private function load_dependencies() {
        require_once WP_NEXT_PLUGIN_DIR . 'includes/class-settings.php';
        require_once WP_NEXT_PLUGIN_DIR . 'includes/class-validators.php';
        require_once WP_NEXT_PLUGIN_DIR . 'includes/admin/class-admin-page.php';
        require_once WP_NEXT_PLUGIN_DIR . 'includes/rest-api/class-custom-routes.php';
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Admin
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));

        // REST API
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    /**
     * Register plugin settings with WordPress Settings API
     */
    public function register_settings() {
        register_setting(
            'wp_next_group',
            'wp_next_settings',
            array(
                'sanitize_callback' => array('WP_Next_Validators', 'sanitize_settings'),
                'type' => 'object',
            )
        );
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'WP Next Settings',
            'WP Next',
            'manage_options',
            'wp-next-settings',
            array('WP_Next_Admin_Page', 'render'),
            'dashicons-link',
            100
        );
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_wp-next-settings') {
            return;
        }

        // Enqueue Alpine.js from CDN
        wp_enqueue_script(
            'alpine-js',
            'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
            array(),
            '3.x.x',
            true
        );

        // Enqueue admin script
        wp_enqueue_script(
            'wp-next-admin',
            WP_NEXT_PLUGIN_URL . 'assets/admin.js',
            array('alpine-js'),
            WP_NEXT_VERSION,
            true
        );

        // Enqueue admin styles
        wp_enqueue_style(
            'wp-next-admin',
            WP_NEXT_PLUGIN_URL . 'assets/admin.css',
            array(),
            WP_NEXT_VERSION
        );
    }

    /**
     * Register custom REST API routes
     */
    public function register_rest_routes() {
        WP_Next_Custom_Routes::register_routes();
    }
}