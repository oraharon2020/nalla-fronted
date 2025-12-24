<?php
/**
 * Plugin Name: Bellano Next.js Integration
 * Description: Custom settings and API extensions for Bellano Next.js headless store
 * Version: 2.0
 * Author: Bellano
 */

if (!defined('ABSPATH')) {
    exit;
}

define('BELLANO_NEXTJS_VERSION', '2.0');
define('BELLANO_NEXTJS_PATH', plugin_dir_path(__FILE__));

// Load modules
require_once BELLANO_NEXTJS_PATH . 'modules/class-related-products.php';
require_once BELLANO_NEXTJS_PATH . 'modules/class-rest-api.php';
require_once BELLANO_NEXTJS_PATH . 'modules/class-product-assembly.php';
