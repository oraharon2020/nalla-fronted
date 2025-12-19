<?php
/**
 * Product Availability Module
 * Adds "In Stock" / "Custom Order" badge to products
 */

if (!defined('ABSPATH')) exit;

class Bellano_Product_Availability {
    
    public function __construct() {
        // Add metabox to product edit page
        add_action('add_meta_boxes', [$this, 'add_product_metabox']);
        add_action('save_post_product', [$this, 'save_product_availability']);
        
        // Add to WooCommerce product data
        add_action('woocommerce_product_options_general_product_data', [$this, 'add_custom_field']);
        add_action('woocommerce_process_product_meta', [$this, 'save_custom_field']);
        
        // Expose in REST API
        add_action('rest_api_init', [$this, 'register_rest_field']);
    }
    
    /**
     * Add availability field to WooCommerce product data panel
     */
    public function add_custom_field() {
        global $post;
        
        echo '<div class="options_group">';
        
        woocommerce_wp_select([
            'id' => '_bellano_availability_type',
            'label' => __('סוג זמינות', 'bellano-settings'),
            'description' => __('בחר האם המוצר במלאי או בהזמנה אישית', 'bellano-settings'),
            'desc_tip' => true,
            'options' => [
                'in_stock' => 'במלאי',
                'custom_order' => 'בהזמנה אישית',
            ],
            'value' => get_post_meta($post->ID, '_bellano_availability_type', true) ?: 'in_stock',
        ]);
        
        echo '</div>';
    }
    
    /**
     * Save the custom field
     */
    public function save_custom_field($post_id) {
        if (isset($_POST['_bellano_availability_type'])) {
            $value = sanitize_text_field($_POST['_bellano_availability_type']);
            update_post_meta($post_id, '_bellano_availability_type', $value);
        }
    }
    
    /**
     * Add metabox (alternative location in sidebar)
     */
    public function add_product_metabox() {
        add_meta_box(
            'bellano_availability_metabox',
            'סוג זמינות מוצר',
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
        wp_nonce_field('bellano_availability_nonce', 'bellano_availability_nonce_field');
        
        $availability_type = get_post_meta($post->ID, '_bellano_availability_type', true) ?: 'in_stock';
        ?>
        <div style="padding: 10px 0;">
            <label style="display: block; margin-bottom: 8px;">
                <input type="radio" name="_bellano_availability_type" value="in_stock" <?php checked($availability_type, 'in_stock'); ?>>
                <span style="font-size: 14px;">🟢 במלאי</span>
                <p style="margin: 4px 0 0 24px; color: #666; font-size: 12px;">מוצר זמין - ניתן לביטול</p>
            </label>
            <label style="display: block; margin-top: 12px;">
                <input type="radio" name="_bellano_availability_type" value="custom_order" <?php checked($availability_type, 'custom_order'); ?>>
                <span style="font-size: 14px;">🟠 בהזמנה אישית</span>
                <p style="margin: 4px 0 0 24px; color: #666; font-size: 12px;">מוצר בהתאמה - לא ניתן לביטול</p>
            </label>
        </div>
        <?php
    }
    
    /**
     * Save metabox data
     */
    public function save_product_availability($post_id) {
        // Check nonce
        if (!isset($_POST['bellano_availability_nonce_field']) || 
            !wp_verify_nonce($_POST['bellano_availability_nonce_field'], 'bellano_availability_nonce')) {
            return;
        }
        
        // Check autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // Check permissions
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        // Save
        if (isset($_POST['_bellano_availability_type'])) {
            $value = sanitize_text_field($_POST['_bellano_availability_type']);
            update_post_meta($post_id, '_bellano_availability_type', $value);
        }
    }
    
    /**
     * Register REST API field for products
     */
    public function register_rest_field() {
        register_rest_field('product', 'bellano_availability', [
            'get_callback' => function($product) {
                $type = get_post_meta($product['id'], '_bellano_availability_type', true);
                return $type ?: 'in_stock';
            },
            'schema' => [
                'description' => 'Product availability type (in_stock or custom_order)',
                'type' => 'string',
                'enum' => ['in_stock', 'custom_order'],
            ],
        ]);
    }
    
    /**
     * Get availability type for a product
     */
    public static function get_availability($product_id) {
        $type = get_post_meta($product_id, '_bellano_availability_type', true);
        return $type ?: 'in_stock';
    }
}
