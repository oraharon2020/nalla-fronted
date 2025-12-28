<?php
/**
 * Glass Option Module
 * Allows customers to add glass to products (e.g. table tops)
 * Admin can enable/disable per product and set custom price
 */

if (!defined('ABSPATH')) exit;

class Bellano_Glass_Option {
    
    public function __construct() {
        // Add metabox to product edit page
        add_action('add_meta_boxes', [$this, 'add_product_metabox']);
        
        // Save using WooCommerce hook
        add_action('woocommerce_process_product_meta', [$this, 'save_glass_settings'], 10, 1);
        
        // Expose in REST API
        add_action('rest_api_init', [$this, 'register_rest_field']);
        
        // Frontend: Add field to product page (WooCommerce)
        add_action('woocommerce_before_add_to_cart_button', [$this, 'display_glass_field'], 16);
        
        // Add custom data to cart item
        add_filter('woocommerce_add_cart_item_data', [$this, 'add_cart_item_data'], 10, 3);
        
        // Display in cart
        add_filter('woocommerce_get_item_data', [$this, 'display_cart_item_data'], 10, 2);
        
        // Adjust price in cart
        add_action('woocommerce_before_calculate_totals', [$this, 'adjust_cart_price'], 21, 1);
        
        // Save to order
        add_action('woocommerce_checkout_create_order_line_item', [$this, 'save_to_order_item'], 10, 4);
    }
    
    /**
     * Add metabox (sidebar location)
     */
    public function add_product_metabox() {
        add_meta_box(
            'bellano_glass_metabox',
            '🪟 תוספת זכוכית',
            [$this, 'render_metabox'],
            'product',
            'side',
            'high'
        );
    }
    
    /**
     * Render the metabox
     */
    public function render_metabox($post) {
        $enabled = get_post_meta($post->ID, '_bellano_glass_enabled', true);
        $price = get_post_meta($post->ID, '_bellano_glass_price', true);
        $label = get_post_meta($post->ID, '_bellano_glass_label', true);
        
        // Default price if not set
        if ($price === '') {
            $price = 350;
        }
        
        // Default label
        if ($label === '') {
            $label = 'הוסף זכוכית';
        }
        
        wp_nonce_field('bellano_glass_nonce', 'bellano_glass_nonce');
        ?>
        <div style="padding: 10px 0;">
            <label style="display: flex; align-items: center; cursor: pointer; padding: 10px; border-radius: 6px; background: <?php echo $enabled ? '#d1fae5' : '#f3f4f6'; ?>; margin-bottom: 12px;">
                <input type="checkbox" name="_bellano_glass_enabled" value="1" <?php checked($enabled, '1'); ?> style="margin-left: 8px; width: 18px; height: 18px;">
                <div>
                    <span style="font-size: 14px; font-weight: 600; color: <?php echo $enabled ? '#047857' : '#374151'; ?>;">
                        <?php echo $enabled ? '✅ מופעל' : 'הפעל תוספת זכוכית'; ?>
                    </span>
                    <p style="margin: 2px 0 0 0; color: #666; font-size: 11px;">אפשר ללקוח להוסיף זכוכית</p>
                </div>
            </label>
            
            <div style="background: #f0fdf4; padding: 12px; border-radius: 6px; border: 1px solid #bbf7d0; margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #166534; font-size: 13px;">
                    📝 טקסט לתצוגה
                </label>
                <input 
                    type="text" 
                    name="_bellano_glass_label" 
                    value="<?php echo esc_attr($label); ?>" 
                    placeholder="הוסף זכוכית"
                    style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
                >
                <p style="margin: 6px 0 0 0; color: #166534; font-size: 11px;">
                    מה הלקוח יראה (למשל: "הוסף זכוכית מחוסמת")
                </p>
            </div>
            
            <div style="background: #ecfdf5; padding: 12px; border-radius: 6px; border: 1px solid #a7f3d0;">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #047857; font-size: 13px;">
                    💰 תוספת מחיר
                </label>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <input 
                        type="number" 
                        name="_bellano_glass_price" 
                        value="<?php echo esc_attr($price); ?>" 
                        min="0" 
                        step="10"
                        style="width: 100px; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 16px; font-weight: 600;"
                    >
                    <span style="font-size: 14px; color: #666;">₪</span>
                </div>
                <p style="margin: 8px 0 0 0; color: #059669; font-size: 11px;">
                    מחיר התוספת כשלקוח מסמן את הזכוכית
                </p>
            </div>
        </div>
        
        <p style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 4px; font-size: 11px; color: #92400e; line-height: 1.5;">
            💡 <strong>איך זה עובד:</strong><br>
            כשמופעל, הלקוח יראה צ'קבוקס.<br>
            אם יסמן - המחיר יתווסף להזמנה.
        </p>
        <?php
    }
    
    /**
     * Save glass settings
     */
    public function save_glass_settings($post_id) {
        if (!isset($_POST['bellano_glass_nonce']) || 
            !wp_verify_nonce($_POST['bellano_glass_nonce'], 'bellano_glass_nonce')) {
            return;
        }
        
        // Save enabled status
        $enabled = isset($_POST['_bellano_glass_enabled']) ? '1' : '0';
        update_post_meta($post_id, '_bellano_glass_enabled', $enabled);
        
        // Save price
        if (isset($_POST['_bellano_glass_price'])) {
            $price = absint($_POST['_bellano_glass_price']);
            update_post_meta($post_id, '_bellano_glass_price', $price);
        }
        
        // Save label
        if (isset($_POST['_bellano_glass_label'])) {
            $label = sanitize_text_field($_POST['_bellano_glass_label']);
            update_post_meta($post_id, '_bellano_glass_label', $label);
        }
    }
    
    /**
     * Register REST API field for products
     */
    public function register_rest_field() {
        register_rest_field('product', 'bellano_glass', [
            'get_callback' => function($product) {
                $enabled = get_post_meta($product['id'], '_bellano_glass_enabled', true);
                $price = get_post_meta($product['id'], '_bellano_glass_price', true);
                $label = get_post_meta($product['id'], '_bellano_glass_label', true);
                
                return [
                    'enabled' => $enabled === '1',
                    'price' => $price !== '' ? (int) $price : 350,
                    'label' => $label !== '' ? $label : 'הוסף זכוכית',
                ];
            },
            'schema' => [
                'description' => 'Glass option settings',
                'type' => 'object',
                'properties' => [
                    'enabled' => ['type' => 'boolean'],
                    'price' => ['type' => 'integer'],
                    'label' => ['type' => 'string'],
                ],
            ],
        ]);
    }
    
    /**
     * Display glass field on product page (WooCommerce frontend)
     */
    public function display_glass_field() {
        global $product;
        
        if (!$product) return;
        
        $enabled = get_post_meta($product->get_id(), '_bellano_glass_enabled', true);
        if ($enabled !== '1') return;
        
        $price = get_post_meta($product->get_id(), '_bellano_glass_price', true);
        $price = $price !== '' ? (int) $price : 350;
        
        $label = get_post_meta($product->get_id(), '_bellano_glass_label', true);
        $label = $label !== '' ? $label : 'הוסף זכוכית';
        
        ?>
        <div class="bellano-glass-field" style="margin: 15px 0; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <label style="display: flex; align-items: center; cursor: pointer; gap: 10px;">
                <input 
                    type="checkbox" 
                    name="bellano_glass_option" 
                    id="bellano_glass_option"
                    value="1"
                    style="width: 18px; height: 18px; cursor: pointer;"
                >
                <span style="font-weight: 500; color: #334155; font-size: 14px;">
                    🪟 <?php echo esc_html($label); ?>
                    <span style="color: #059669; font-size: 13px; margin-right: 6px;">
                        (+<?php echo number_format($price); ?>₪)
                    </span>
                </span>
            </label>
        </div>
        <?php
    }
    
    /**
     * Add glass data to cart item
     */
    public function add_cart_item_data($cart_item_data, $product_id, $variation_id) {
        if (isset($_POST['bellano_glass_option']) && $_POST['bellano_glass_option'] === '1') {
            $price = get_post_meta($product_id, '_bellano_glass_price', true);
            $label = get_post_meta($product_id, '_bellano_glass_label', true);
            
            $cart_item_data['bellano_glass'] = [
                'enabled' => true,
                'price' => $price !== '' ? (int) $price : 350,
                'label' => $label !== '' ? $label : 'הוסף זכוכית',
            ];
            
            // Make cart item unique if not already
            if (!isset($cart_item_data['unique_key'])) {
                $cart_item_data['unique_key'] = md5(microtime() . rand());
            }
        }
        
        return $cart_item_data;
    }
    
    /**
     * Display glass data in cart
     */
    public function display_cart_item_data($item_data, $cart_item) {
        if (isset($cart_item['bellano_glass']) && $cart_item['bellano_glass']['enabled']) {
            $item_data[] = [
                'key' => '🪟 ' . $cart_item['bellano_glass']['label'],
                'value' => '+' . number_format($cart_item['bellano_glass']['price']) . '₪',
            ];
        }
        
        return $item_data;
    }
    
    /**
     * Adjust cart item price
     */
    public function adjust_cart_price($cart) {
        if (is_admin() && !defined('DOING_AJAX')) return;
        if (did_action('woocommerce_before_calculate_totals') >= 2) return;
        
        foreach ($cart->get_cart() as $cart_item) {
            if (isset($cart_item['bellano_glass']) && $cart_item['bellano_glass']['enabled']) {
                $additional_price = $cart_item['bellano_glass']['price'];
                $original_price = $cart_item['data']->get_price();
                $cart_item['data']->set_price($original_price + $additional_price);
            }
        }
    }
    
    /**
     * Save glass data to order item
     */
    public function save_to_order_item($item, $cart_item_key, $values, $order) {
        if (isset($values['bellano_glass']) && $values['bellano_glass']['enabled']) {
            $item->add_meta_data('_bellano_glass_enabled', true);
            $item->add_meta_data('_bellano_glass_price', $values['bellano_glass']['price']);
            $item->add_meta_data($values['bellano_glass']['label'], '+' . number_format($values['bellano_glass']['price']) . '₪');
        }
    }
    
    /**
     * Static helper: Check if product has glass option enabled
     */
    public static function is_enabled($product_id) {
        return get_post_meta($product_id, '_bellano_glass_enabled', true) === '1';
    }
    
    /**
     * Static helper: Get glass price for product
     */
    public static function get_price($product_id) {
        $price = get_post_meta($product_id, '_bellano_glass_price', true);
        return $price !== '' ? (int) $price : 350;
    }
    
    /**
     * Static helper: Get glass label for product
     */
    public static function get_label($product_id) {
        $label = get_post_meta($product_id, '_bellano_glass_label', true);
        return $label !== '' ? $label : 'הוסף זכוכית';
    }
}
