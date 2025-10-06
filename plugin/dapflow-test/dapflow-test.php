<?php
/**
 * Plugin Name: DapFlow Test Block
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

add_action('init', function() {
    register_block_type(__DIR__ . '/block.json');
});
