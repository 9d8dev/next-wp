<?php
/**
 * Next WP Theme Functions
 *
 * @package Next WP
 */

// Exit if accessed directly
if(!defined('ABSPATH')){
	exit;
}

/**
 * Set up theme defaults
 */
function next_wp_setup(){
	// Add support for featured images
	add_theme_support('post-thumbnails');
	
	// Register navigation menus
	register_nav_menus([
		'primary'   => __('Primary Menu', 'next-wp'),
		'secondary' => __('Secondary Menu', 'next-wp'),
	]);
}
add_action('after_setup_theme', 'next_wp_setup');

/**
 * Enqueue theme styles and scripts
 */
function next_wp_enqueue_assets(){
	wp_enqueue_style('next-wp-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'next_wp_enqueue_assets');