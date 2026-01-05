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

// Mobile Menu class - defined inline to avoid file loading issues
if (!class_exists('Nalla_Mobile_Menu')) {
    class Nalla_Mobile_Menu {
        private $option_name = 'bellano_mobile_menu';
        
        public function __construct() {
            add_action('admin_init', [$this, 'register_settings']);
            add_action('rest_api_init', [$this, 'register_rest_routes']);
        }
        
        public function register_settings() {
            register_setting($this->option_name, $this->option_name);
        }
        
        public function register_rest_routes() {
            register_rest_route('bellano/v1', '/mobile-menu', [
                'methods' => 'GET',
                'callback' => [$this, 'get_mobile_menu'],
                'permission_callback' => '__return_true',
            ]);
        }
        
        public function get_mobile_menu() {
            $settings = get_option($this->option_name, []);
            return rest_ensure_response([
                'items' => $settings['items'] ?? [],
                'phone' => $settings['phone'] ?? '',
                'whatsapp' => $settings['whatsapp'] ?? '',
            ]);
        }
        
        public function render_tab() {
            $settings = get_option($this->option_name, []);
            $items = $settings['items'] ?? [];
            ?>
            <h2>📱 תפריט מובייל</h2>
            <p class="description">הגדר את התפריט שיוצג במובייל באתר Next.js</p>
            
            <form method="post" action="options.php">
                <?php settings_fields($this->option_name); ?>
                
                <div style="background:#fff;padding:20px;border:1px solid #ccc;border-radius:8px;margin-top:20px;">
                    <h3 style="margin-top:0;">פריטי תפריט</h3>
                    <div id="menu-items-container">
                        <?php if (empty($items)): ?>
                            <?php $this->render_menu_item(0); ?>
                        <?php else: ?>
                            <?php foreach ($items as $index => $item): ?>
                                <?php $this->render_menu_item($index, $item); ?>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                    <button type="button" id="add-menu-item" class="button" style="margin-top:15px;">➕ הוסף פריט</button>
                </div>
                
                <div style="background:#fff;padding:20px;border:1px solid #ccc;border-radius:8px;margin-top:20px;">
                    <h3 style="margin-top:0;">פרטי קשר</h3>
                    <table class="form-table">
                        <tr>
                            <th>טלפון</th>
                            <td><input type="text" name="<?php echo $this->option_name; ?>[phone]" value="<?php echo esc_attr($settings['phone'] ?? ''); ?>" class="regular-text" dir="ltr"></td>
                        </tr>
                        <tr>
                            <th>וואטסאפ</th>
                            <td><input type="text" name="<?php echo $this->option_name; ?>[whatsapp]" value="<?php echo esc_attr($settings['whatsapp'] ?? ''); ?>" class="regular-text" dir="ltr"></td>
                        </tr>
                    </table>
                </div>
                <?php submit_button('שמור תפריט'); ?>
            </form>
            
            <script type="text/template" id="menu-item-template"><?php $this->render_menu_item('{{INDEX}}'); ?></script>
            
            <style>
                .menu-item-box { background: #f9f9f9; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin-bottom: 15px; position: relative; }
                .menu-item-box .remove-item { position: absolute; top: 10px; left: 10px; color: #dc3545; cursor: pointer; }
                .mobile-field-row { display: flex; gap: 15px; margin-bottom: 10px; flex-wrap: wrap; }
                .mobile-field { flex: 1; min-width: 200px; }
                .mobile-field.small { flex: 0 0 80px; min-width: 80px; }
                .mobile-field label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 12px; }
                .mobile-field input { width: 100%; }
            </style>
            
            <script>
            jQuery(document).ready(function($) {
                var itemCount = <?php echo count($items) ?: 1; ?>;
                $('#add-menu-item').on('click', function() {
                    var template = $('#menu-item-template').html().replace(/\{\{INDEX\}\}/g, itemCount);
                    $('#menu-items-container').append(template);
                    itemCount++;
                });
                $(document).on('click', '.remove-item', function() { $(this).closest('.menu-item-box').remove(); });
            });
            </script>
            <?php
        }
        
        private function render_menu_item($index, $item = []) {
            ?>
            <div class="menu-item-box">
                <span class="remove-item">✕</span>
                <div class="mobile-field-row">
                    <div class="mobile-field">
                        <label>שם הפריט</label>
                        <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $index; ?>][title]" value="<?php echo esc_attr($item['title'] ?? ''); ?>" placeholder="סלון">
                    </div>
                    <div class="mobile-field">
                        <label>קישור</label>
                        <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $index; ?>][url]" value="<?php echo esc_attr($item['url'] ?? ''); ?>" placeholder="/product-category/living-room" dir="ltr">
                    </div>
                    <div class="mobile-field small">
                        <label>אייקון</label>
                        <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $index; ?>][icon]" value="<?php echo esc_attr($item['icon'] ?? ''); ?>" placeholder="🛋️">
                    </div>
                </div>
            </div>
            <?php
        }
    }
}

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
        $this->mobile_menu = new Nalla_Mobile_Menu();
        
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

// Initialize
Bellano_Settings::get_instance();
