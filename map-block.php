<?php

/**
 * Plugin Name: Map Block
 * Plugin URI: https://github.com/aduth/wp-map-block.git
 * Description: Editor block for inserting map frame into content
 * Version: 1.0.0
 * Author: Andrew Duthie
 * Author URI: http://andrewduthie.com
 * License: MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: map-block
 */

if ( ! defined( 'MAP_BLOCK_VERSION' ) ) {
	define( 'MAP_BLOCK_VERSION', '1.0.0' );
}

/**
 * Enqueue admin editor block scripts and styles.
 */
function map_block_enqueue_editor_scripts() {
	wp_enqueue_script( 'map-block-editor', plugins_url( 'js/editor-block.js', __FILE__ ), array( 'wp-blocks', 'wp-elements', 'jquery', 'underscore' ), MAP_BLOCK_VERSION );
	wp_localize_script( 'map-block-editor', 'mapBlockL10n', array(
		'title'       => __( 'Map', 'map-block' ),
		'description' => __( 'Embed a map from OpenStreetMaps', 'map-block' ),
		'emptyPrompt' => __( 'Enter a search query below', 'map-block' ),
		'emptyError'  => __( 'Cannot save an empty map', 'map-block' ),
	) );

	wp_enqueue_style( 'map-block-editor', plugins_url( 'css/editor-block.css', __FILE__ ), array(), MAP_BLOCK_VERSION );
}
add_action( 'wp_enqueue_editor', 'map_block_enqueue_editor_scripts' );

/**
 * Enqueue universal block styling
 */
function map_block_enqueue_scripts() {
	wp_enqueue_style( 'map-block', plugins_url( 'css/block.css', __FILE__ ), array(), MAP_BLOCK_VERSION );
}
add_action( 'wp_enqueue_scripts', 'map_block_enqueue_scripts' );
