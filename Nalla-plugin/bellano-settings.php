<?php
/**
 * Plugin Name: Nalla Settings
 * Description: הגדרות מרכזיות לאתר נלה - באנרים, קאש, שאלות נפוצות, סרטונים ועוד
 * Version: 2.0.1
 * Author: Nalla
 * Text Domain: nalla-settings
 * Updated: 2026-01-05
 */

if (!defined('ABSPATH')) exit;

// Increase PHP memory limit
@ini_set('memory_limit', '1024M');

// Register Mega Menu locations
function bellano_register_mega_menu_locations() {
    register_nav_menus([
        'nalla-mega-menu' => 'Mega Menu (Next.js)',
        'nalla-mega-menu-mobile' => 'Mega Menu Mobile (Next.js)',
    ]);
}
add_action('after_setup_theme', 'bellano_register_mega_menu_locations', 99);

// Define plugin constants
define('BELLANO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BELLANO_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load modules - all in the same way
require_once BELLANO_PLUGIN_DIR . 'modules/class-admin-pages.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-banners.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-faq.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-cache.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-upgrades.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-auth.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-product-video.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-related-products.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-rest-api.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-featured-categories.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-contact-form.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-product-availability.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-tambour-color.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-glass-option.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-product-assembly.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-mega-menu.php';
require_once BELLANO_PLUGIN_DIR . 'modules/class-mobile-menu.php';

/**
 * Main plugin class
 */
class Bellano_Settings {
    
    private static $instance = null;
    
    // Module instances
    public $admin_pages;
    public $banners;
    public $faq;
    public $cache;
    public $upgrades;
    public $auth;
    public $product_video;
    public $rest_api;
    public $contact_form;
    public $product_availability;
    public $tambour_color;
    public $glass_option;
    public $mega_menu;
    public $mobile_menu;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Initialize modules
        $this->admin_pages = new Bellano_Admin_Pages();
        $this->banners = new Bellano_Banners();
        $this->faq = new Bellano_FAQ();
        $this->cache = new Bellano_Cache();
        $this->upgrades = new Bellano_Upgrades();
        $this->auth = new Bellano_Auth();
        $this->product_video = new Bellano_Product_Video();
        $this->rest_api = new Bellano_REST_API($this);
        $this->contact_form = new Bellano_Contact_Form();
        $this->product_availability = new Bellano_Product_Availability();
        $this->tambour_color = new Bellano_Tambour_Color();
        $this->glass_option = new Bellano_Glass_Option();
        $this->mega_menu = new Bellano_Mega_Menu();
        $this->mobile_menu = new Bellano_Mobile_Menu();
        
        // Register hooks
        add_action('admin_menu', [$this->admin_pages, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'admin_scripts']);
        add_action('rest_api_init', [$this->rest_api, 'register_routes']);
        
        // Product metaboxes
        add_action('add_meta_boxes', [$this->faq, 'add_product_metabox']);
        add_action('add_meta_boxes', [$this->product_video, 'add_product_metabox']);
        add_action('save_post_product', [$this->faq, 'save_product_faq']);
        add_action('save_post_product', [$this->product_video, 'save_product_video']);
        
        // Auto-clear cache hooks
        add_action('update_option_bellano_banners', [$this->cache, 'clear_homepage_cache']);
        add_action('woocommerce_update_product', [$this->cache, 'clear_product_cache']);
        add_action('woocommerce_new_product', [$this->cache, 'clear_product_cache']);
        add_action('edited_product_cat', [$this->cache, 'clear_category_cache']);
        add_action('created_product_cat', [$this->cache, 'clear_category_cache']);
    }
    
    public function register_settings() {
        register_setting('bellano_settings', 'bellano_banners');
        register_setting('bellano_settings', 'bellano_vercel_revalidate_url');
        register_setting('bellano_settings', 'bellano_vercel_revalidate_token');
        register_setting('bellano_settings', 'bellano_faq_templates');
        register_setting('bellano_settings', 'bellano_faq_default_template');
    }
    
    public function admin_scripts($hook) {
        if (strpos($hook, 'bellano') === false && $hook !== 'post.php' && $hook !== 'post-new.php') {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_script('jquery-ui-sortable');
    }
}

// Handle multi-item cart URL
add_action('template_redirect', function() {
    if (isset($_GET['bellano_cart'])) {
        $cart_data = json_decode(base64_decode($_GET['bellano_cart']), true);
        
        if (!empty($cart_data) && is_array($cart_data) && function_exists('WC') && WC()->cart) {
            WC()->cart->empty_cart();
            
            foreach ($cart_data as $item) {
                $product_id = intval($item['id']);
                $quantity = isset($item['qty']) ? intval($item['qty']) : 1;
                
                $product = wc_get_product($product_id);
                if ($product) {
                    if ($product->is_type('variation')) {
                        WC()->cart->add_to_cart($product->get_parent_id(), $quantity, $product_id);
                    } else {
                        WC()->cart->add_to_cart($product_id, $quantity);
                    }
                }
            }
            
            wp_redirect(wc_get_checkout_url());
            exit;
        }
    }
});

/**
 * Add CORS headers to REST API responses
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        $allowed_origins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'https://nalla.co.il',
            'https://www.nalla.co.il',
            'https://nalla-next.vercel.app',
            'https://nalla-fronted.vercel.app',
        ];
        
        // Allow any localhost port for development
        if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } elseif (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
        
        return $value;
    });
}, 15);

// Handle OPTIONS preflight requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $origin = get_http_origin();
        
        // Allow any localhost port for development
        if (preg_match('/^http:\/\/localhost:\d+$/', $origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } elseif (in_array($origin, [
            'https://nalla.co.il',
            'https://www.nalla.co.il',
            'https://nalla-next.vercel.app',
            'https://nalla-fronted.vercel.app',
        ])) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
        header('Access-Control-Max-Age: 86400');
        exit(0);
    }
});

// Initialize
Bellano_Settings::get_instance();
