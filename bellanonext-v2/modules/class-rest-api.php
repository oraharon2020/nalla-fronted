<?php
/**
 * REST API Extensions for Next.js
 */

if (!defined('ABSPATH')) {
    exit;
}

class Bellano_REST_API {
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
        add_filter('woocommerce_rest_prepare_product_object', array($this, 'add_custom_fields_to_product'), 10, 3);
    }
    
    /**
     * Register custom REST routes
     */
    public function register_routes() {
        register_rest_route('bellano/v1', '/product/(?P<slug>[a-zA-Z0-9-]+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_product_by_slug'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Get product by slug with all custom data
     */
    public function get_product_by_slug($request) {
        $slug = $request->get_param('slug');
        
        $args = array(
            'name' => $slug,
            'post_type' => 'product',
            'post_status' => 'publish',
            'numberposts' => 1,
        );
        
        $posts = get_posts($args);
        
        if (empty($posts)) {
            return new WP_Error('not_found', 'Product not found', array('status' => 404));
        }
        
        $product = wc_get_product($posts[0]->ID);
        
        return $this->format_product_for_api($product);
    }
    
    /**
     * Add custom fields to WooCommerce REST API response
     */
    public function add_custom_fields_to_product($response, $product, $request) {
        $data = $response->get_data();
        
        // Add assembly field
        $assembly = get_post_meta($product->get_id(), '_bellano_assembly', true);
        $data['bellano_assembly'] = ($assembly === '' || $assembly === '1') ? true : false;
        
        // Add related products (complete the look)
        $data['bellano_related'] = Bellano_Related_Products::get_related_products_data($product->get_id());
        
        $response->set_data($data);
        return $response;
    }
    
    /**
     * Format product data for API
     */
    private function format_product_for_api($product) {
        $data = array(
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'slug' => $product->get_slug(),
            'price' => $product->get_price(),
            'regular_price' => $product->get_regular_price(),
            'sale_price' => $product->get_sale_price(),
            'on_sale' => $product->is_on_sale(),
            'description' => $product->get_description(),
            'short_description' => $product->get_short_description(),
            'stock_status' => $product->get_stock_status(),
        );
        
        // Add assembly field
        $assembly = get_post_meta($product->get_id(), '_bellano_assembly', true);
        $data['bellano_assembly'] = ($assembly === '' || $assembly === '1') ? true : false;
        
        // Add related products (complete the look)
        $data['bellano_related'] = Bellano_Related_Products::get_related_products_data($product->get_id());
        
        // Add images
        $image_id = $product->get_image_id();
        if ($image_id) {
            $data['image'] = wp_get_attachment_url($image_id);
        }
        
        $gallery_ids = $product->get_gallery_image_ids();
        $data['gallery'] = array_map('wp_get_attachment_url', $gallery_ids);
        
        return rest_ensure_response($data);
    }
}

new Bellano_REST_API();
