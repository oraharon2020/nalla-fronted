<?php
/**
 * Product Assembly Module
 * Adds "Comes Assembled" / "Self Assembly Required" option to products
 * Default: true (comes assembled)
 */

if (!defined('ABSPATH')) exit;

class Bellano_Product_Assembly {
    
    public function __construct() {
        // Add metabox to product edit page (sidebar)
        add_action('add_meta_boxes', [$this, 'add_product_metabox']);
        
        // Save using WooCommerce hook
        add_action('woocommerce_process_product_meta', [$this, 'save_assembly'], 10, 1);
        
        // Expose in REST API
        add_action('rest_api_init', [$this, 'register_rest_field']);
    }
    
    /**
     * Add metabox (sidebar location)
     */
    public function add_product_metabox() {
        add_meta_box(
            'bellano_assembly_metabox',
            '🔧 הרכבת המוצר',
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
        // Default to true (assembled) if not set
        $assembly = get_post_meta($post->ID, '_bellano_assembly', true);
        $is_assembled = ($assembly === '' || $assembly === '1') ? true : false;
        ?>
        <div style="padding: 10px 0;">
            <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; border-radius: 6px; background: <?php echo $is_assembled ? '#dcfce7' : '#f3f4f6'; ?>; margin-bottom: 8px;">
                <input type="radio" name="_bellano_assembly" value="1" <?php checked($is_assembled, true); ?> style="margin-left: 8px;">
                <div>
                    <span style="font-size: 14px; font-weight: 500; color: #166534;">✅ מגיע מורכב</span>
                    <p style="margin: 2px 0 0 0; color: #666; font-size: 11px;">המוצר מגיע מורכב ומוכן לשימוש</p>
                </div>
            </label>
            <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; border-radius: 6px; background: <?php echo !$is_assembled ? '#fef3c7' : '#f3f4f6'; ?>;">
                <input type="radio" name="_bellano_assembly" value="0" <?php checked($is_assembled, false); ?> style="margin-left: 8px;">
                <div>
                    <span style="font-size: 14px; font-weight: 500; color: #92400e;">🔧 הרכבה עצמאית / דרכינו</span>
                    <p style="margin: 2px 0 0 0; color: #666; font-size: 11px;">הלקוח יכול להרכיב עצמאית או להזמין הרכבה</p>
                </div>
            </label>
        </div>
        <p style="margin-top: 10px; padding: 8px; background: #f0f9ff; border-radius: 4px; font-size: 11px; color: #0369a1;">
            💡 <strong>ברירת מחדל:</strong> מגיע מורכב - רוב הרהיטים שלנו מגיעים מורכבים
        </p>
        <?php
    }
    
    /**
     * Save assembly setting
     */
    public function save_assembly($post_id) {
        if (isset($_POST['_bellano_assembly'])) {
            $value = sanitize_text_field($_POST['_bellano_assembly']);
            update_post_meta($post_id, '_bellano_assembly', $value);
        }
    }
    
    /**
     * Register REST API field for products
     */
    public function register_rest_field() {
        register_rest_field('product', 'bellano_assembly', [
            'get_callback' => function($product) {
                $assembly = get_post_meta($product['id'], '_bellano_assembly', true);
                // Default to true if not set
                return ($assembly === '' || $assembly === '1') ? true : false;
            },
            'schema' => [
                'description' => 'Product comes assembled (default: true)',
                'type' => 'boolean',
            ],
        ]);
    }
    
    /**
     * Get assembly setting for a product
     */
    public static function get_assembly($product_id) {
        $assembly = get_post_meta($product_id, '_bellano_assembly', true);
        return ($assembly === '' || $assembly === '1') ? true : false;
    }
}

// Initialize
new Bellano_Product_Assembly();
