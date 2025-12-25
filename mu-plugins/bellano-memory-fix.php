<?php
/**
 * Plugin Name: Bellano Memory Fix
 * Description: Increases PHP memory limit before anything else loads
 */

// Set memory limit as early as possible
@ini_set('memory_limit', '1024M');

// Try to define WP memory constants if not already defined
if (!defined('WP_MEMORY_LIMIT')) {
    define('WP_MEMORY_LIMIT', '1024M');
}
if (!defined('WP_MAX_MEMORY_LIMIT')) {
    define('WP_MAX_MEMORY_LIMIT', '1024M');
}
