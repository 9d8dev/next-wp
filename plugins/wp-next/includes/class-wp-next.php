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
        // Custom REST API prefix
        add_filter('rest_url_prefix', array($this, 'custom_rest_url_prefix'));

        // Admin
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));

        // REST API
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    /**
     * Filter REST API URL prefix to use custom endpoint if configured
     */
    public function custom_rest_url_prefix() {
        $custom_endpoint = WP_Next_Settings::get('custom_endpoint');
        if (!empty($custom_endpoint)) {
            return ltrim($custom_endpoint, '/');
        }
        return 'wp-json';
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
            'dashicons-rest-api',
            100
        );
    }

    /**
     * Enqueue admin assets (currently none needed - using plain HTML)
     */
    public function enqueue_admin_assets($hook) {
        // Currently not needed - using plain HTML forms
        return;
    }

    /**
     * Register custom REST API routes
     */
    public function register_rest_routes() {
        WP_Next_Custom_Routes::register_routes();
    }
}