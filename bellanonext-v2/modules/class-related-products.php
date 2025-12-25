<?php
/**
 * Related Products (Complete The Look) Module
 * Allows selecting specific products to show as "complete the look" bundle
 * Supports per-variation bundles for variable products
 */

if (!defined('ABSPATH')) {
    exit;
}

class Bellano_Related_Products {
    
    public function __construct() {
        // Meta box for simple products and default bundle
        add_action('add_meta_boxes', array($this, 'add_meta_box'));
        add_action('save_post_product', array($this, 'save_meta_box'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // Variation-specific bundle fields
        add_action('woocommerce_product_after_variable_attributes', array($this, 'add_variation_bundle_fields'), 10, 3);
        add_action('woocommerce_save_product_variation', array($this, 'save_variation_bundle_fields'), 10, 2);
        
        // Expose in REST API
        add_action('rest_api_init', array($this, 'register_rest_field'));
    }
    
    /**
     * Register REST API field for products
     */
    public function register_rest_field() {
        register_rest_field('product', 'bellano_related', array(
            'get_callback' => function($product) {
                return self::get_related_products_data($product['id']);
            },
            'schema' => array(
                'description' => 'Related products for Complete The Look bundle',
                'type' => 'object',
            ),
        ));
    }
    
    /**
     * Add meta box to product edit page
     */
    public function add_meta_box() {
        add_meta_box(
            'bellano_related_products',
            '✨ השלם את הלוק - מוצרים משלימים',
            array($this, 'render_meta_box'),
            'product',
            'normal',
            'high'
        );
    }
    
    /**
     * Enqueue admin scripts
     */
    public function enqueue_scripts($hook) {
        global $post;
        
        if ($hook !== 'post.php' && $hook !== 'post-new.php') {
            return;
        }
        
        if (!$post || $post->post_type !== 'product') {
            return;
        }
        
        wp_enqueue_script('select2', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js', array('jquery'), '4.1.0', true);
        wp_enqueue_style('select2', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css', array(), '4.1.0');
        
        wp_add_inline_style('select2', '
            .bellano-related-products-wrap {
                padding: 15px;
                background: #f9f9f9;
                border-radius: 8px;
            }
            .bellano-related-products-wrap .select2-container {
                width: 100% !important;
            }
            .bellano-related-products-wrap .select2-selection--multiple {
                min-height: 100px;
                border: 2px dashed #ddd;
                border-radius: 8px;
            }
            .bellano-related-products-wrap .select2-selection--multiple:hover {
                border-color: #2271b1;
            }
            .bellano-related-products-wrap .select2-selection__choice {
                background: #2271b1;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                margin: 5px;
            }
            .bellano-related-products-wrap .select2-selection__choice__remove {
                color: white;
                margin-left: 8px;
            }
            .bellano-related-info {
                margin-top: 15px;
                padding: 12px;
                background: #fff3cd;
                border-radius: 6px;
                font-size: 13px;
                color: #856404;
            }
            .bellano-bundle-settings {
                margin-top: 15px;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border: 1px solid #ddd;
            }
            .bellano-bundle-settings label {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 10px;
            }
            .bellano-bundle-settings input[type="number"] {
                width: 80px;
            }
            /* Variation bundle styles */
            .bellano-variation-bundle-wrap {
                padding: 15px;
                margin-top: 10px;
                background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
                border: 1px solid #f0d68a;
                border-radius: 8px;
            }
            .bellano-variation-bundle-wrap h4 {
                margin: 0 0 12px 0;
                color: #92690e;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .bellano-variation-bundle-wrap .select2-selection--multiple {
                min-height: 80px;
                border: 2px dashed #e6c65a;
                border-radius: 6px;
                background: white;
            }
            .bellano-variation-bundle-wrap .select2-selection--multiple:hover {
                border-color: #d4a940;
            }
            .bellano-variation-bundle-wrap .form-row {
                margin-top: 10px;
            }
            .bellano-variation-bundle-wrap .form-row label {
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
        ');
        
        // Script to initialize select2 on variations when they load
        wp_add_inline_script('select2', '
            jQuery(document).ready(function($) {
                // Initialize select2 for main product
                $(".bellano-product-select").select2({
                    placeholder: "חפש והוסף מוצרים...",
                    allowClear: true,
                    dir: "rtl",
                    language: {
                        noResults: function() { return "לא נמצאו מוצרים"; },
                        searching: function() { return "מחפש..."; }
                    }
                });
                
                // Re-initialize when variations are loaded
                $(document).on("woocommerce_variations_loaded woocommerce_variations_added", function() {
                    $(".bellano-variation-products-select").each(function() {
                        if (!$(this).hasClass("select2-hidden-accessible")) {
                            $(this).select2({
                                placeholder: "בחר מוצרים לבאנדל...",
                                allowClear: true,
                                dir: "rtl",
                                language: {
                                    noResults: function() { return "לא נמצאו מוצרים"; },
                                    searching: function() { return "מחפש..."; }
                                }
                            });
                        }
                    });
                });
            });
        ');
    }
    
    /**
     * Get all products including variations for bundle selection
     * Uses caching and optimized queries to avoid performance issues
     */
    private function get_all_products_for_selection($exclude_ids = array()) {
        // Use transient cache to avoid repeated heavy queries
        $cache_key = 'bellano_products_for_selection_' . md5(serialize($exclude_ids));
        $cached = get_transient($cache_key);
        
        if ($cached !== false) {
            return $cached;
        }
        
        $items = array();
        
        // Get simple products directly
        $simple_products = wc_get_products(array(
            'limit' => -1,
            'status' => 'publish',
            'type' => 'simple',
            'exclude' => $exclude_ids,
            'orderby' => 'title',
            'order' => 'ASC',
        ));
        
        foreach ($simple_products as $product) {
            $items[] = array(
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'price' => $product->get_price(),
                'type' => 'simple',
                'parent_id' => null,
            );
        }
        
        // Get variations directly using optimized query
        global $wpdb;
        $exclude_sql = !empty($exclude_ids) ? "AND p.ID NOT IN (" . implode(',', array_map('intval', $exclude_ids)) . ") AND p.post_parent NOT IN (" . implode(',', array_map('intval', $exclude_ids)) . ")" : "";
        
        $variations = $wpdb->get_results("
            SELECT p.ID, p.post_parent, p.post_title,
                   parent.post_title as parent_title,
                   pm.meta_value as price
            FROM {$wpdb->posts} p
            INNER JOIN {$wpdb->posts} parent ON p.post_parent = parent.ID
            LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id AND pm.meta_key = '_price'
            WHERE p.post_type = 'product_variation'
            AND p.post_status = 'publish'
            AND parent.post_status = 'publish'
            {$exclude_sql}
            ORDER BY parent.post_title ASC, p.ID ASC
        ");
        
        foreach ($variations as $var) {
            // Get variation attributes - translate slugs to display names
            $attrs = array();
            $var_meta = get_post_meta($var->ID);
            foreach ($var_meta as $key => $value) {
                if (strpos($key, 'attribute_') === 0 && !empty($value[0])) {
                    $taxonomy = str_replace('attribute_', '', $key);
                    $term = get_term_by('slug', $value[0], $taxonomy);
                    if ($term && !is_wp_error($term)) {
                        $attrs[] = $term->name;
                    } else {
                        $attrs[] = $value[0];
                    }
                }
            }
            $var_name = implode(' / ', $attrs);
            
            $items[] = array(
                'id' => intval($var->ID),
                'name' => $var->parent_title . ($var_name ? ' - ' . $var_name : ''),
                'price' => $var->price,
                'type' => 'variation',
                'parent_id' => intval($var->post_parent),
            );
        }
        
        // Sort by name
        usort($items, function($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
        
        // Cache for 5 minutes
        set_transient($cache_key, $items, 5 * MINUTE_IN_SECONDS);
        
        return $items;
    }
    
    /**
     * Render meta box content - for simple products and default bundle
     */
    public function render_meta_box($post) {
        wp_nonce_field('bellano_related_products_nonce', 'bellano_related_products_nonce');
        
        $product = wc_get_product($post->ID);
        $is_variable = $product && $product->is_type('variable');
        
        // Get default bundle settings
        $selected_products = get_post_meta($post->ID, '_bellano_related_products', true);
        $selected_products = !empty($selected_products) ? $selected_products : array();
        
        $bundle_discount = get_post_meta($post->ID, '_bellano_bundle_discount', true);
        $bundle_discount = !empty($bundle_discount) ? $bundle_discount : '10';
        
        $bundle_enabled = get_post_meta($post->ID, '_bellano_bundle_enabled', true);
        $bundle_enabled = $bundle_enabled !== '0'; // Default to enabled
        
        // Get all products INCLUDING variations for selection
        $all_products = $this->get_all_products_for_selection(array($post->ID));
        
        ?>
        <div class="bellano-related-products-wrap">
            <div class="bellano-bundle-settings" style="margin-top: 0; margin-bottom: 15px;">
                <label>
                    <input type="checkbox" name="bellano_bundle_enabled" value="1" <?php checked($bundle_enabled); ?>>
                    <strong>הפעל "השלם את הלוק"</strong>
                </label>
            </div>
            
            <?php if ($is_variable) : ?>
                <div class="bellano-related-info" style="background: #d1ecf1; color: #0c5460; margin-bottom: 15px;">
                    💡 <strong>מוצר עם וריאציות:</strong> ניתן להגדיר באנדל שונה לכל וריאציה בעריכת הווריאציה עצמה (בטאב "וריאציות"). 
                    הגדרות כאן הן ברירת מחדל לווריאציות שלא הוגדר להן באנדל ספציפי.
                </div>
            <?php endif; ?>
            
            <p style="margin-bottom: 10px; font-weight: 600;">
                <?php echo $is_variable ? 'באנדל ברירת מחדל:' : 'בחר מוצרים שמשלימים את המוצר הזה:'; ?>
            </p>
            
            <select id="bellano_related_products" 
                    name="bellano_related_products[]" 
                    multiple="multiple" 
                    class="bellano-product-select"
                    style="width: 100%;">
                <?php foreach ($all_products as $prod) : 
                    $label = $prod['type'] === 'variation' ? '📦 ' : '';
                ?>
                    <option value="<?php echo esc_attr($prod['id']); ?>" 
                            <?php selected(in_array($prod['id'], $selected_products)); ?>>
                        <?php echo $label . esc_html($prod['name']); ?> - ₪<?php echo esc_html($prod['price']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            
            <div class="bellano-bundle-settings">
                <label>
                    <span>אחוז הנחה לקנייה יחד:</span>
                    <input type="number" name="bellano_bundle_discount" value="<?php echo esc_attr($bundle_discount); ?>" min="0" max="50" step="1">
                    <span>%</span>
                </label>
            </div>
            
            <div class="bellano-related-info">
                💡 <strong>טיפ:</strong> בחר 2-4 מוצרים שמתאימים ליצירת לוק שלם. הלקוח יוכל להוסיף את כל המוצרים לסל עם הנחת באנדל.
            </div>
        </div>
        <?php
    }
    
    /**
     * Add bundle fields to each variation
     */
    public function add_variation_bundle_fields($loop, $variation_data, $variation) {
        $variation_id = $variation->ID;
        $parent_id = $variation->post_parent;
        
        // Get saved bundle for this variation
        $var_products = get_post_meta($variation_id, '_bellano_variation_products', true);
        $var_products = !empty($var_products) ? $var_products : array();
        
        $var_discount = get_post_meta($variation_id, '_bellano_variation_discount', true);
        
        // Get all products INCLUDING variations for selection
        $all_products = $this->get_all_products_for_selection(array($parent_id, $variation_id));
        
        ?>
        <div class="bellano-variation-bundle-wrap">
            <h4>✨ השלם את הלוק - באנדל לווריאציה זו</h4>
            
            <p class="form-row form-row-full">
                <label>מוצרים משלימים:</label>
                <select name="bellano_variation_products[<?php echo $loop; ?>][]" 
                        multiple="multiple" 
                        class="bellano-variation-products-select"
                        style="width: 100%;">
                    <?php foreach ($all_products as $prod) : 
                        $label = $prod['type'] === 'variation' ? '📦 ' : '';
                    ?>
                        <option value="<?php echo esc_attr($prod['id']); ?>" 
                                <?php selected(in_array($prod['id'], $var_products)); ?>>
                            <?php echo $label . esc_html($prod['name']); ?> - ₪<?php echo esc_html($prod['price']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <span class="description" style="display:block; margin-top:5px; color:#666; font-size:12px;">
                    השאר ריק לשימוש בברירת המחדל. 📦 = מוצר עם וריאציה ספציפית
                </span>
            </p>
            
            <p class="form-row form-row-first">
                <label>
                    אחוז הנחה:
                    <input type="number" 
                           name="bellano_variation_discount[<?php echo $loop; ?>]" 
                           value="<?php echo esc_attr($var_discount); ?>" 
                           min="0" max="50" step="1" 
                           placeholder="ברירת מחדל"
                           style="width: 80px;">
                    <span>% (השאר ריק לברירת מחדל)</span>
                </label>
            </p>
            
            <input type="hidden" name="bellano_variation_id[<?php echo $loop; ?>]" value="<?php echo $variation_id; ?>">
        </div>
        <?php
    }
    
    /**
     * Save variation bundle fields
     */
    public function save_variation_bundle_fields($variation_id, $loop) {
        // Save products
        if (isset($_POST['bellano_variation_products'][$loop])) {
            $products = array_map('intval', $_POST['bellano_variation_products'][$loop]);
            update_post_meta($variation_id, '_bellano_variation_products', $products);
        } else {
            delete_post_meta($variation_id, '_bellano_variation_products');
        }
        
        // Save discount
        if (isset($_POST['bellano_variation_discount'][$loop]) && $_POST['bellano_variation_discount'][$loop] !== '') {
            $discount = intval($_POST['bellano_variation_discount'][$loop]);
            $discount = max(0, min(50, $discount));
            update_post_meta($variation_id, '_bellano_variation_discount', $discount);
        } else {
            delete_post_meta($variation_id, '_bellano_variation_discount');
        }
    }
    
    /**
     * Save meta box data
     */
    public function save_meta_box($post_id) {
        if (!isset($_POST['bellano_related_products_nonce']) || 
            !wp_verify_nonce($_POST['bellano_related_products_nonce'], 'bellano_related_products_nonce')) {
            return;
        }
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        // Save default related products
        $related_products = isset($_POST['bellano_related_products']) ? 
            array_map('intval', $_POST['bellano_related_products']) : array();
        update_post_meta($post_id, '_bellano_related_products', $related_products);
        
        // Save bundle settings
        $bundle_enabled = isset($_POST['bellano_bundle_enabled']) ? '1' : '0';
        update_post_meta($post_id, '_bellano_bundle_enabled', $bundle_enabled);
        
        $bundle_discount = isset($_POST['bellano_bundle_discount']) ? 
            intval($_POST['bellano_bundle_discount']) : 10;
        $bundle_discount = max(0, min(50, $bundle_discount)); // Clamp between 0-50
        update_post_meta($post_id, '_bellano_bundle_discount', $bundle_discount);
    }
    
    /**
     * Get related products data for a product
     * @param int $product_id The product ID
     * @param int|null $variation_id Optional variation ID to get specific bundle
     */
    public static function get_related_products_data($product_id, $variation_id = null) {
        $enabled = get_post_meta($product_id, '_bellano_bundle_enabled', true);
        if ($enabled === '0') {
            return null;
        }
        
        // Get default settings
        $default_products = get_post_meta($product_id, '_bellano_related_products', true);
        $default_discount = get_post_meta($product_id, '_bellano_bundle_discount', true);
        $default_discount = !empty($default_discount) ? intval($default_discount) : 10;
        
        // Build variation bundles map
        $variation_bundles = array();
        $product = wc_get_product($product_id);
        
        if ($product && $product->is_type('variable')) {
            $variations = $product->get_children();
            foreach ($variations as $var_id) {
                $var_products = get_post_meta($var_id, '_bellano_variation_products', true);
                $var_discount = get_post_meta($var_id, '_bellano_variation_discount', true);
                
                // Only include if has custom products
                if (!empty($var_products) && is_array($var_products)) {
                    $variation_bundles[$var_id] = array(
                        'products' => $var_products,
                        'discount' => $var_discount !== '' ? intval($var_discount) : null,
                    );
                }
            }
        }
        
        // Determine which products to return
        $related_ids = $default_products;
        $discount = $default_discount;
        
        // If variation specified and has custom bundle, use it
        if ($variation_id && isset($variation_bundles[$variation_id])) {
            $related_ids = $variation_bundles[$variation_id]['products'];
            if ($variation_bundles[$variation_id]['discount'] !== null) {
                $discount = $variation_bundles[$variation_id]['discount'];
            }
        }
        
        if (empty($related_ids) || !is_array($related_ids)) {
            // No default products, check if there are any variation bundles
            if (empty($variation_bundles)) {
                return null;
            }
            $related_ids = array(); // Initialize as empty array
        }
        
        // Collect ALL product IDs (from default + all variation bundles)
        // This ensures frontend has all products needed for any bundle
        $all_product_ids = is_array($related_ids) ? $related_ids : array();
        foreach ($variation_bundles as $var_bundle) {
            if (!empty($var_bundle['products']) && is_array($var_bundle['products'])) {
                $all_product_ids = array_merge($all_product_ids, $var_bundle['products']);
            }
        }
        $all_product_ids = array_unique($all_product_ids);
        
        // Build products array - support both simple products and variations
        $products = array();
        if (!empty($all_product_ids)) {
            foreach ($all_product_ids as $id) {
                $prod = wc_get_product($id);
                if (!$prod) continue;
                
                // Check if it's a variation
                if ($prod->is_type('variation')) {
                    $parent = wc_get_product($prod->get_parent_id());
                    if (!$parent || $parent->get_status() !== 'publish') continue;
                    
                    // Get variation attributes for display - use display names not slugs
                    $attrs = $prod->get_variation_attributes();
                    $attr_values = array();
                    foreach ($attrs as $attr_name => $attr_value) {
                        if ($attr_value) {
                            // Get the term name (Hebrew) instead of slug (English)
                            $taxonomy = str_replace('attribute_', '', $attr_name);
                            $term = get_term_by('slug', $attr_value, $taxonomy);
                            if ($term && !is_wp_error($term)) {
                                $attr_values[] = $term->name;
                            } else {
                                // Fallback to the raw value if not a taxonomy term
                                $attr_values[] = $attr_value;
                            }
                        }
                    }
                    $var_name = implode(' / ', $attr_values);
                    
                    $products[] = array(
                        'id' => $prod->get_id(),
                        'parent_id' => $parent->get_id(),
                        'name' => $parent->get_name() . ($var_name ? ' - ' . $var_name : ''),
                        'slug' => $parent->get_slug(),
                        'price' => $prod->get_price(),
                        'regular_price' => $prod->get_regular_price(),
                        'image' => wp_get_attachment_url($prod->get_image_id()) ?: wp_get_attachment_url($parent->get_image_id()),
                        'is_variation' => true,
                        'variation_attributes' => $attr_values,
                    );
                } else {
                    // Simple product
                    if ($prod->get_status() !== 'publish') continue;
                    
                    $products[] = array(
                        'id' => $prod->get_id(),
                        'name' => $prod->get_name(),
                        'slug' => $prod->get_slug(),
                        'price' => $prod->get_price(),
                        'regular_price' => $prod->get_regular_price(),
                        'image' => wp_get_attachment_url($prod->get_image_id()),
                        'is_variation' => false,
                    );
                }
            }
        }
        
        return array(
            'enabled' => true,
            'discount' => $discount,
            'products' => $products,
            'variation_bundles' => !empty($variation_bundles) ? $variation_bundles : null,
        );
    }
}

// Initialize
new Bellano_Related_Products();
