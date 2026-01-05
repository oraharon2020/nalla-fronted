<?php
/**
 * Bellano REST API Module
 * Registers all REST API routes
 */

if (!defined('ABSPATH')) exit;

class Bellano_REST_API {
    
    private $plugin;
    
    public function __construct($plugin) {
        $this->plugin = $plugin;
    }
    
    public function register_routes() {
        // Homepage banners
        register_rest_route('bellano/v1', '/homepage', [
            'methods' => 'GET',
            'callback' => [$this, 'get_homepage_data'],
            'permission_callback' => '__return_true'
        ]);
        
        // Product FAQ
        register_rest_route('bellano/v1', '/product-faq/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_product_faq'],
            'permission_callback' => '__return_true'
        ]);
        
        // FAQ Templates
        register_rest_route('bellano/v1', '/faq-templates', [
            'methods' => 'GET',
            'callback' => [$this, 'get_faq_templates'],
            'permission_callback' => '__return_true'
        ]);
        
        // Product Video
        register_rest_route('bellano/v1', '/product-video/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_product_video'],
            'permission_callback' => '__return_true'
        ]);
        
        // ============================================
        // DISABLED - Meshulam/Checkout routes
        // These conflict with existing site checkout
        // ============================================
        /*
        // Cart - Create checkout with items
        register_rest_route('bellano/v1', '/create-checkout', [
            'methods' => 'POST',
            'callback' => [$this->plugin->checkout, 'create_checkout'],
            'permission_callback' => '__return_true'
        ]);
        
        // Cart - Get checkout URL for items
        register_rest_route('bellano/v1', '/checkout-url', [
            'methods' => 'POST',
            'callback' => [$this->plugin->checkout, 'get_checkout_url'],
            'permission_callback' => '__return_true'
        ]);
        
        // Meshulam webhook (support both GET and POST - some payment gateways use either)
        register_rest_route('bellano/v1', '/meshulam-webhook', [
            'methods' => ['GET', 'POST'],
            'callback' => [$this->plugin->checkout, 'handle_meshulam_webhook'],
            'permission_callback' => '__return_true'
        ]);
        
        // Meshulam success redirect - receives response from Meshulam and redirects to Next.js
        register_rest_route('bellano/v1', '/meshulam-success', [
            'methods' => ['GET', 'POST'],
            'callback' => [$this->plugin->checkout, 'handle_meshulam_success'],
            'permission_callback' => '__return_true'
        ]);
        
        // Meshulam config
        register_rest_route('bellano/v1', '/meshulam-config', [
            'methods' => 'GET',
            'callback' => [$this->plugin->checkout, 'get_meshulam_config'],
            'permission_callback' => '__return_true'
        ]);
        
        // Meshulam payment proxy (for Vercel - bypasses Imperva blocking)
        register_rest_route('bellano/v1', '/meshulam-proxy', [
            'methods' => 'POST',
            'callback' => [$this->plugin->checkout, 'proxy_meshulam_payment'],
            'permission_callback' => '__return_true'
        ]);
        */
        // ============================================
        
        // Check admin
        register_rest_route('bellano/v1', '/check-admin', [
            'methods' => 'GET',
            'callback' => [$this->plugin->auth, 'check_user_is_admin'],
            'permission_callback' => '__return_true'
        ]);
        
        // Mega Menu routes
        register_rest_route('bellano/v1', '/menus', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menu_locations'],
            'permission_callback' => '__return_true'
        ]);
        
        register_rest_route('bellano/v1', '/menu/(?P<location>[a-zA-Z0-9_-]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menu_by_location'],
            'permission_callback' => '__return_true'
        ]);
        
        // Mega Menu from settings
        register_rest_route('bellano/v1', '/mega-menu', [
            'methods' => 'GET',
            'callback' => [$this, 'get_mega_menu'],
            'permission_callback' => '__return_true'
        ]);
        
        // Spaces taxonomy routes
        register_rest_route('bellano/v1', '/spaces', [
            'methods' => 'GET',
            'callback' => [$this, 'get_spaces'],
            'permission_callback' => '__return_true'
        ]);
        
        register_rest_route('bellano/v1', '/spaces/(?P<slug>[a-zA-Z0-9_-]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_space_by_slug'],
            'permission_callback' => '__return_true'
        ]);
        
        register_rest_route('bellano/v1', '/spaces/(?P<slug>[a-zA-Z0-9_-]+)/products', [
            'methods' => 'GET',
            'callback' => [$this, 'get_products_by_space'],
            'permission_callback' => '__return_true'
        ]);
        
        // Navigation menu
        register_rest_route('bellano/v1', '/navigation', [
            'methods' => 'GET',
            'callback' => [$this, 'get_navigation'],
            'permission_callback' => '__return_true'
        ]);
        
        // Footer settings
        register_rest_route('bellano/v1', '/footer', [
            'methods' => 'GET',
            'callback' => [$this, 'get_footer'],
            'permission_callback' => '__return_true'
        ]);
        
        // Top announcements bar
        register_rest_route('bellano/v1', '/announcements', [
            'methods' => 'GET',
            'callback' => [$this, 'get_announcements'],
            'permission_callback' => '__return_true'
        ]);
        
        // Admin upgrades
        register_rest_route('bellano/v1', '/admin-upgrades', [
            'methods' => 'GET',
            'callback' => [$this, 'get_admin_upgrades'],
            'permission_callback' => function() {
                return current_user_can('administrator');
            }
        ]);
        
        // Admin login
        register_rest_route('bellano/v1', '/admin-login', [
            'methods' => 'POST',
            'callback' => [$this->plugin->auth, 'admin_login'],
            'permission_callback' => '__return_true'
        ]);
        
        // Verify admin token
        register_rest_route('bellano/v1', '/verify-admin-token', [
            'methods' => 'POST',
            'callback' => [$this->plugin->auth, 'verify_admin_token'],
            'permission_callback' => '__return_true'
        ]);
        
        // Admin logout
        register_rest_route('bellano/v1', '/admin-logout', [
            'methods' => 'POST',
            'callback' => [$this->plugin->auth, 'admin_logout'],
            'permission_callback' => '__return_true'
        ]);
        
        // Upload file (admin only)
        register_rest_route('bellano/v1', '/upload-file', [
            'methods' => 'POST',
            'callback' => [$this, 'upload_file'],
            'permission_callback' => '__return_true'
        ]);
        
        // Color swatches - get attribute term images
        register_rest_route('bellano/v1', '/color-swatches', [
            'methods' => 'GET',
            'callback' => [$this, 'get_color_swatches'],
            'permission_callback' => '__return_true'
        ]);
        
        // Debug term meta (temporary)
        register_rest_route('bellano/v1', '/debug-term-meta/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'debug_term_meta'],
            'permission_callback' => '__return_true'
        ]);
        
        // Category icons carousel
        register_rest_route('bellano/v1', '/category-icons', [
            'methods' => 'GET',
            'callback' => [$this, 'get_category_icons'],
            'permission_callback' => '__return_true'
        ]);
        
        // Full product data - single API call for everything
        // Support Hebrew slugs with [^/]+ pattern
        register_rest_route('bellano/v1', '/product-full/(?P<slug>[^/]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_full_product_data'],
            'permission_callback' => '__return_true'
        ]);
    }
    
    public function get_homepage_data() {
        return $this->plugin->banners->get_homepage_data();
    }
    
    public function get_product_faq($request) {
        $product_id = $request['id'];
        return $this->plugin->faq->get_product_faq($product_id);
    }
    
    public function get_faq_templates() {
        return $this->plugin->faq->get_templates();
    }
    
    public function get_product_video($request) {
        $product_id = $request['id'];
        $video_data = $this->plugin->product_video->get_product_video($product_id);
        
        if (!$video_data) {
            return new WP_REST_Response(['hasVideo' => false], 200);
        }
        
        return new WP_REST_Response([
            'hasVideo' => true,
            'video' => $video_data
        ], 200);
    }
    
    public function get_admin_upgrades() {
        return new WP_REST_Response([
            'upgrades' => $this->plugin->upgrades->get_upgrades()
        ], 200);
    }
    
    /**
     * Upload file to WordPress media library
     */
    public function upload_file($request) {
        $params = $request->get_json_params();
        
        $token = isset($params['token']) ? sanitize_text_field($params['token']) : '';
        $filename = isset($params['filename']) ? sanitize_file_name($params['filename']) : '';
        $file_type = isset($params['fileType']) ? sanitize_text_field($params['fileType']) : 'application/octet-stream';
        $file_data = isset($params['fileData']) ? $params['fileData'] : '';
        
        // Verify admin token
        if (empty($token)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'נדרש טוקן הזדהות'
            ], 401);
        }
        
        $user_id = $this->plugin->auth->verify_token($token);
        if (!$user_id || !user_can($user_id, 'administrator')) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'אין הרשאה להעלאת קבצים'
            ], 403);
        }
        
        if (empty($filename) || empty($file_data)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'חסרים נתונים להעלאה'
            ], 400);
        }
        
        // Decode base64 file data
        $decoded_data = base64_decode($file_data);
        if ($decoded_data === false) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'שגיאה בפענוח הקובץ'
            ], 400);
        }
        
        // Get WordPress upload directory
        $upload_dir = wp_upload_dir();
        
        // Create admin-uploads subfolder
        $target_dir = $upload_dir['basedir'] . '/admin-uploads/' . date('Y/m');
        if (!file_exists($target_dir)) {
            wp_mkdir_p($target_dir);
        }
        
        // Ensure unique filename
        $target_path = $target_dir . '/' . $filename;
        $counter = 1;
        $path_info = pathinfo($filename);
        while (file_exists($target_path)) {
            $new_filename = $path_info['filename'] . '-' . $counter . '.' . ($path_info['extension'] ?? '');
            $target_path = $target_dir . '/' . $new_filename;
            $counter++;
        }
        
        // Save file
        $result = file_put_contents($target_path, $decoded_data);
        if ($result === false) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'שגיאה בשמירת הקובץ'
            ], 500);
        }
        
        // Get URL
        $file_url = str_replace($upload_dir['basedir'], $upload_dir['baseurl'], $target_path);
        
        return new WP_REST_Response([
            'success' => true,
            'url' => $file_url,
            'filename' => basename($target_path)
        ], 200);
    }
    
    /**
     * Get color swatches (attribute term images)
     * Returns all color terms with their swatch images
     */
    public function get_color_swatches() {
        $swatches = [];
        
        // Get all product attribute taxonomies
        $attribute_taxonomies = wc_get_attribute_taxonomies();
        
        foreach ($attribute_taxonomies as $attribute) {
            $taxonomy = 'pa_' . $attribute->attribute_name;
            
            // Only process color-related attributes
            $attr_name_lower = mb_strtolower($attribute->attribute_label);
            if (strpos($attr_name_lower, 'צבע') === false && 
                strpos($attr_name_lower, 'color') === false &&
                strpos($attr_name_lower, 'בד') === false) {
                continue;
            }
            
            $terms = get_terms([
                'taxonomy' => $taxonomy,
                'hide_empty' => false
            ]);
            
            if (is_wp_error($terms)) {
                continue;
            }
            
            foreach ($terms as $term) {
                $swatch_data = [
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'attribute' => $attribute->attribute_label,
                    'attribute_slug' => $taxonomy
                ];
                
                // Try to get ts_product_color_config (from theme color attribute plugin)
                $config_raw = get_term_meta($term->term_id, 'ts_product_color_config', true);
                if ($config_raw) {
                    // Handle multiple levels of serialization
                    $config = $config_raw;
                    
                    // Keep unserializing until we get an array or hit a non-serialized string
                    $max_attempts = 5;
                    $attempts = 0;
                    while (is_string($config) && $attempts < $max_attempts) {
                        // Try normal unserialize
                        $unserialized = @unserialize($config);
                        if ($unserialized !== false) {
                            $config = $unserialized;
                        } else {
                            break;
                        }
                        $attempts++;
                    }
                    
                    // Now $config should be an array
                    if (is_array($config)) {
                        // Get image if set (handle both integer and string IDs)
                        if (!empty($config['ts_color_image'])) {
                            $image_id = intval($config['ts_color_image']);
                            if ($image_id > 0) {
                                $image_url = wp_get_attachment_image_url($image_id, 'thumbnail');
                                if ($image_url) {
                                    $swatch_data['image'] = $image_url;
                                }
                            }
                        }
                        
                        // Get color hex if set
                        if (!empty($config['ts_color_color']) && $config['ts_color_color'] !== '#ffffff') {
                            $swatch_data['color'] = $config['ts_color_color'];
                        }
                    }
                }
                
                // Fallback: try other meta keys used by various plugins
                if (empty($swatch_data['image']) && empty($swatch_data['color'])) {
                    // Try image type attributes
                    $image_id = get_term_meta($term->term_id, 'product_attribute_image', true);
                    if (!$image_id) {
                        $image_id = get_term_meta($term->term_id, 'image', true);
                    }
                    
                    if ($image_id && is_numeric($image_id)) {
                        $image_url = wp_get_attachment_image_url($image_id, 'thumbnail');
                        if ($image_url) {
                            $swatch_data['image'] = $image_url;
                        }
                    }
                    
                    // Try color meta
                    $color = get_term_meta($term->term_id, 'product_attribute_color', true);
                    if (!$color) {
                        $color = get_term_meta($term->term_id, 'color', true);
                    }
                    if ($color) {
                        $swatch_data['color'] = $color;
                    }
                }
                
                // Use decoded slug as key to handle Hebrew slugs properly
                // Also store with URL-encoded version for fallback matching
                $decoded_slug = urldecode($term->slug);
                $swatches[$decoded_slug] = $swatch_data;
                
                // If slug is different when encoded, also store under encoded version
                if ($decoded_slug !== $term->slug) {
                    $swatches[$term->slug] = $swatch_data;
                }
            }
        }
        
        return new WP_REST_Response([
            'success' => true,
            'swatches' => $swatches
        ], 200);
    }
    
    /**
     * Debug term meta (temporary endpoint)
     */
    public function debug_term_meta($request) {
        $term_id = $request['id'];
        $all_meta = get_term_meta($term_id);
        $term = get_term($term_id);
        
        return new WP_REST_Response([
            'term_id' => $term_id,
            'term_name' => $term ? $term->name : 'Not found',
            'taxonomy' => $term ? $term->taxonomy : null,
            'all_meta' => $all_meta
        ], 200);
    }
    
    /**
     * Get category icons for carousel
     * Returns categories with icons configured in plugin settings
     */
    public function get_category_icons() {
        // Get saved category icons from options
        $saved_icons = get_option('bellano_category_icons', []);
        
        // If no saved icons, return default categories from WooCommerce
        if (empty($saved_icons)) {
            $categories = get_terms([
                'taxonomy' => 'product_cat',
                'hide_empty' => false,
                'parent' => 0, // Top level only
                'number' => 10,
                'orderby' => 'menu_order',
                'order' => 'ASC'
            ]);
            
            if (is_wp_error($categories)) {
                return new WP_REST_Response([
                    'success' => true,
                    'icons' => []
                ], 200);
            }
            
            $icons = [];
            foreach ($categories as $cat) {
                // Try to get category thumbnail
                $thumbnail_id = get_term_meta($cat->term_id, 'thumbnail_id', true);
                $icon_url = null;
                
                if ($thumbnail_id) {
                    // Get full URL - for SVG files wp_get_attachment_image_url might not work
                    $icon_url = wp_get_attachment_url($thumbnail_id);
                    if (!$icon_url) {
                        $icon_url = wp_get_attachment_image_url($thumbnail_id, 'full');
                    }
                }
                
                // Also check for custom icon meta
                $custom_icon = get_term_meta($cat->term_id, 'category_icon', true);
                if ($custom_icon) {
                    $icon_url = $custom_icon;
                }
                
                $icons[] = [
                    'id' => $cat->term_id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'icon' => $icon_url,
                    'link' => '/category/' . $cat->slug
                ];
            }
            
            return new WP_REST_Response([
                'success' => true,
                'icons' => $icons
            ], 200);
        }
        
        // Return saved icons configuration
        $icons = [];
        foreach ($saved_icons as $item) {
            $icon_url = null;
            if (!empty($item['icon_id'])) {
                // Get full URL - for SVG files wp_get_attachment_image_url might not work
                $icon_url = wp_get_attachment_url($item['icon_id']);
                if (!$icon_url) {
                    $icon_url = wp_get_attachment_image_url($item['icon_id'], 'full');
                }
            } elseif (!empty($item['icon_url'])) {
                $icon_url = $item['icon_url'];
            }
            
            $icons[] = [
                'id' => $item['id'] ?? 0,
                'name' => $item['name'] ?? '',
                'slug' => $item['slug'] ?? '',
                'icon' => $icon_url,
                'link' => $item['link'] ?? '/category/' . ($item['slug'] ?? '')
            ];
        }
        
        return new WP_REST_Response([
            'success' => true,
            'icons' => $icons
        ], 200);
    }
    
    /**
     * Get full product data in a single API call
     * Returns: product, variations, FAQs, video, swatches, and Yoast SEO
     */
    public function get_full_product_data($request) {
        // URL decode the slug to handle Hebrew characters
        $slug = urldecode($request['slug']);
        $slug = sanitize_title($slug);
        
        // Get the product by slug
        $args = [
            'post_type' => 'product',
            'name' => $slug,
            'posts_per_page' => 1,
            'post_status' => 'publish'
        ];
        $query = new WP_Query($args);
        
        if (!$query->have_posts()) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
        
        $post = $query->posts[0];
        $product = wc_get_product($post->ID);
        
        if (!$product) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
        
        $product_id = $product->get_id();
        
        // Build WooCommerce REST API style response
        $product_data = $this->format_product_for_api($product);
        
        // Get variations if variable product
        $variations = [];
        if ($product->is_type('variable')) {
            $variation_ids = $product->get_children();
            foreach ($variation_ids as $variation_id) {
                $variation = wc_get_product($variation_id);
                if ($variation) {
                    $variations[] = $this->format_variation_for_api($variation);
                }
            }
        }
        
        // Get FAQs
        $faqs = $this->plugin->faq->get_product_faq($product_id);
        
        // Get Video
        $video = $this->plugin->product_video->get_product_video($product_id);
        
        // Get Color Swatches (cached)
        static $cached_swatches = null;
        if ($cached_swatches === null) {
            $swatches_response = $this->get_color_swatches();
            $cached_swatches = $swatches_response->get_data()['swatches'] ?? [];
        }
        
        // Get Yoast SEO data
        $yoast_data = null;
        if (function_exists('YoastSEO')) {
            $meta = YoastSEO()->meta->for_post($product_id);
            if ($meta) {
                $yoast_data = [
                    'title' => $meta->title ?? '',
                    'description' => $meta->description ?? '',
                    'canonical' => $meta->canonical ?? '',
                    'og_title' => $meta->open_graph_title ?? '',
                    'og_description' => $meta->open_graph_description ?? '',
                    'og_image' => $meta->open_graph_images[0]['url'] ?? '',
                    'og_type' => $meta->open_graph_type ?? 'product',
                    'twitter_title' => $meta->twitter_title ?? '',
                    'twitter_description' => $meta->twitter_description ?? '',
                    'twitter_image' => $meta->twitter_image ?? '',
                    'schema' => $meta->schema ?? null,
                ];
            }
        }
        
        return new WP_REST_Response([
            'success' => true,
            'product' => $product_data,
            'variations' => $variations,
            'faqs' => $faqs['faqs'] ?? [],
            'video' => $video,
            'swatches' => $cached_swatches,
            'seo' => $yoast_data
        ], 200);
    }
    
    /**
     * Format product for API response (WooCommerce REST API style)
     */
    private function format_product_for_api($product) {
        $data = [
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'slug' => $product->get_slug(),
            'type' => $product->get_type(),
            'status' => $product->get_status(),
            'description' => $product->get_description(),
            'short_description' => $product->get_short_description(),
            'sku' => $product->get_sku(),
            'price' => $product->get_price(),
            'regular_price' => $product->get_regular_price(),
            'sale_price' => $product->get_sale_price(),
            'price_html' => $product->get_price_html(),
            'on_sale' => $product->is_on_sale(),
            'stock_status' => $product->get_stock_status(),
            'stock_quantity' => $product->get_stock_quantity(),
            'manage_stock' => $product->get_manage_stock(),
            'weight' => $product->get_weight(),
            'dimensions' => [
                'length' => $product->get_length(),
                'width' => $product->get_width(),
                'height' => $product->get_height(),
            ],
            'categories' => [],
            'tags' => [],
            'images' => [],
            'attributes' => [],
            'variations' => $product->is_type('variable') ? $product->get_children() : [],
            'meta_data' => [],
        ];
        
        // Categories
        foreach ($product->get_category_ids() as $cat_id) {
            $term = get_term($cat_id, 'product_cat');
            if ($term && !is_wp_error($term)) {
                $data['categories'][] = [
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                ];
            }
        }
        
        // Images
        $image_id = $product->get_image_id();
        if ($image_id) {
            $data['images'][] = [
                'id' => $image_id,
                'src' => wp_get_attachment_url($image_id),
                'name' => get_the_title($image_id),
                'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
            ];
        }
        foreach ($product->get_gallery_image_ids() as $gallery_id) {
            $data['images'][] = [
                'id' => $gallery_id,
                'src' => wp_get_attachment_url($gallery_id),
                'name' => get_the_title($gallery_id),
                'alt' => get_post_meta($gallery_id, '_wp_attachment_image_alt', true),
            ];
        }
        
        // Attributes
        foreach ($product->get_attributes() as $attr) {
            // Get the attribute label (Hebrew name) instead of slug
            $attr_name = $attr->get_name();
            $attr_label = wc_attribute_label($attr_name);
            
            $attribute_data = [
                'id' => $attr->get_id(),
                'name' => $attr_label,
                'slug' => $attr_name,
                'position' => $attr->get_position(),
                'visible' => $attr->get_visible(),
                'variation' => $attr->get_variation(),
                'options' => [],
            ];
            
            if ($attr->is_taxonomy()) {
                $terms = wc_get_product_terms($product->get_id(), $attr->get_name(), ['fields' => 'all']);
                foreach ($terms as $term) {
                    $attribute_data['options'][] = $term->name;
                }
            } else {
                $attribute_data['options'] = $attr->get_options();
            }
            
            $data['attributes'][] = $attribute_data;
        }
        
        // Custom meta
        $meta_keys = ['_bellano_availability_type', '_custom_order_time'];
        foreach ($meta_keys as $key) {
            $value = get_post_meta($product->get_id(), $key, true);
            if ($value) {
                $data['meta_data'][] = [
                    'key' => $key,
                    'value' => $value,
                ];
            }
        }
        
        // Add bellano_availability as a direct field
        $data['bellano_availability'] = get_post_meta($product->get_id(), '_bellano_availability_type', true) ?: 'in_stock';
        
        // Add bellano_assembly as a direct field (default: true = comes assembled)
        $assembly = get_post_meta($product->get_id(), '_bellano_assembly', true);
        $data['bellano_assembly'] = ($assembly === '' || $assembly === '1') ? true : false;
        
        // Add bellano_tambour (Tambour color option)
        $tambour_enabled = get_post_meta($product->get_id(), '_bellano_tambour_enabled', true);
        $tambour_price = get_post_meta($product->get_id(), '_bellano_tambour_price', true);
        if ($tambour_enabled === '1') {
            $data['bellano_tambour'] = [
                'enabled' => true,
                'price' => $tambour_price !== '' ? (int) $tambour_price : 300,
            ];
        } else {
            $data['bellano_tambour'] = null;
        }
        
        // Add bellano_glass (Glass option)
        $glass_enabled = get_post_meta($product->get_id(), '_bellano_glass_enabled', true);
        $glass_price = get_post_meta($product->get_id(), '_bellano_glass_price', true);
        $glass_label = get_post_meta($product->get_id(), '_bellano_glass_label', true);
        if ($glass_enabled === '1') {
            $data['bellano_glass'] = [
                'enabled' => true,
                'price' => $glass_price !== '' ? (int) $glass_price : 350,
                'label' => $glass_label !== '' ? $glass_label : 'הוסף זכוכית',
            ];
        } else {
            $data['bellano_glass'] = null;
        }
        
        // Add bellano_related (Complete The Look) data
        $data['bellano_related'] = Bellano_Related_Products::get_related_products_data($product->get_id());
        
        return $data;
    }
    
    /**
     * Format variation for API response
     */
    private function format_variation_for_api($variation) {
        $data = [
            'id' => $variation->get_id(),
            'sku' => $variation->get_sku(),
            'price' => $variation->get_price(),
            'regular_price' => $variation->get_regular_price(),
            'sale_price' => $variation->get_sale_price(),
            'on_sale' => $variation->is_on_sale(),
            'stock_status' => $variation->get_stock_status(),
            'stock_quantity' => $variation->get_stock_quantity(),
            'manage_stock' => $variation->get_manage_stock(),
            'weight' => $variation->get_weight(),
            'dimensions' => [
                'length' => $variation->get_length(),
                'width' => $variation->get_width(),
                'height' => $variation->get_height(),
            ],
            'image' => null,
            'attributes' => [],
        ];
        
        // Image
        $image_id = $variation->get_image_id();
        if ($image_id) {
            $data['image'] = [
                'id' => $image_id,
                'src' => wp_get_attachment_url($image_id),
                'name' => get_the_title($image_id),
                'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
            ];
        }
        
        // Attributes - get_variation_attributes() only returns attributes with values
        // We need to get ALL variation attributes, including empty ones (Any)
        foreach ($variation->get_variation_attributes() as $attr_name => $attr_value) {
            // Skip empty values (these are "Any" options)
            if (empty($attr_value)) {
                continue;
            }
            
            // Remove "attribute_" prefix to get taxonomy name
            $taxonomy = str_replace('attribute_', '', $attr_name);
            
            // Get the label (Hebrew name) using WooCommerce function
            $attr_label = wc_attribute_label($taxonomy);
            
            // Get the term name (Hebrew) instead of slug
            $option_label = $attr_value;
            if ($attr_value && taxonomy_exists($taxonomy)) {
                $term = get_term_by('slug', $attr_value, $taxonomy);
                if ($term && !is_wp_error($term)) {
                    $option_label = $term->name;
                }
            }
            
            $data['attributes'][] = [
                'name' => $attr_label,
                'slug' => $taxonomy,
                'option' => $option_label,
            ];
        }
        
        return $data;
    }
    
    /**
     * Get all menu locations
     */
    public function get_menu_locations() {
        $locations = get_nav_menu_locations();
        $menus = [];
        
        foreach ($locations as $location => $menu_id) {
            $menu = wp_get_nav_menu_object($menu_id);
            if ($menu) {
                $menus[$location] = [
                    'id' => $menu_id,
                    'name' => $menu->name,
                    'slug' => $menu->slug,
                ];
            }
        }
        
        // Also list all available menus (not just assigned to locations)
        $all_menus = wp_get_nav_menus();
        $available = [];
        foreach ($all_menus as $menu) {
            $available[] = [
                'id' => $menu->term_id,
                'name' => $menu->name,
                'slug' => $menu->slug,
            ];
        }
        
        return rest_ensure_response([
            'locations' => $menus,
            'available' => $available,
        ]);
    }
    
    /**
     * Get menu by location or slug
     */
    public function get_menu_by_location($request) {
        $location = $request['location'];
        $locations = get_nav_menu_locations();
        
        $menu_id = null;
        
        // First try to find by location
        if (isset($locations[$location])) {
            $menu_id = $locations[$location];
        } else {
            // Try to find by menu slug or name
            $menu = wp_get_nav_menu_object($location);
            if ($menu) {
                $menu_id = $menu->term_id;
            }
        }
        
        if (!$menu_id) {
            return new WP_Error('menu_not_found', 'תפריט לא נמצא', ['status' => 404]);
        }
        
        $menu_items = wp_get_nav_menu_items($menu_id);
        
        if (empty($menu_items)) {
            return rest_ensure_response(['items' => [], 'featured' => []]);
        }
        
        $items = [];
        $children_map = [];
        
        // First pass: organize items by parent
        foreach ($menu_items as $item) {
            $menu_item = $this->format_menu_item($item);
            
            if ($item->menu_item_parent == 0) {
                $items[$item->ID] = $menu_item;
            } else {
                if (!isset($children_map[$item->menu_item_parent])) {
                    $children_map[$item->menu_item_parent] = [];
                }
                $children_map[$item->menu_item_parent][] = $menu_item;
            }
        }
        
        // Second pass: attach children to parents
        foreach ($items as $id => &$item) {
            if (isset($children_map[$id])) {
                $item['children'] = $children_map[$id];
            }
        }
        
        // Separate regular items from featured items
        $regular_items = [];
        $featured_items = [];
        
        foreach (array_values($items) as $item) {
            if ($item['featured']) {
                $featured_items[] = $item;
            } else {
                $regular_items[] = $item;
            }
        }
        
        return rest_ensure_response([
            'items' => $regular_items,
            'featured' => $featured_items,
        ]);
    }
    
    /**
     * Format a single menu item
     */
    private function format_menu_item($item) {
        return [
            'id' => $item->ID,
            'title' => $item->title,
            'url' => $item->url,
            'target' => $item->target,
            'description' => get_post_meta($item->ID, '_bellano_menu_description', true),
            'icon' => get_post_meta($item->ID, '_bellano_menu_icon', true),
            'icon_svg' => get_post_meta($item->ID, '_bellano_menu_icon_svg', true),
            'image' => get_post_meta($item->ID, '_bellano_menu_image', true),
            'featured' => get_post_meta($item->ID, '_bellano_menu_featured', true) === '1',
            'featured_bg' => get_post_meta($item->ID, '_bellano_menu_featured_bg', true),
            'type' => $item->type,
            'object' => $item->object,
            'object_id' => $item->object_id,
            'children' => [],
        ];
    }
    
    /**
     * Get mega menu from Bellano settings
     */
    public function get_mega_menu() {
        $saved_menus = get_option('bellano_mega_menus', []);
        
        $living_spaces = $saved_menus['living_spaces'] ?? [];
        $featured_sections = $saved_menus['featured_sections'] ?? [];
        
        return rest_ensure_response([
            'living_spaces' => $living_spaces,
            'featured_sections' => $featured_sections,
        ]);
    }
    
    /**
     * Get navigation menu
     */
    public function get_navigation() {
        $navigation = get_option('bellano_navigation', []);
        return rest_ensure_response($navigation);
    }
    
    /**
     * Get footer settings
     */
    public function get_footer() {
        $footer = get_option('bellano_footer', []);
        return rest_ensure_response($footer);
    }
    
    /**
     * Get top announcements bar settings
     */
    public function get_announcements() {
        $settings = get_option('bellano_announcements', [
            'enabled' => true,
            'interval' => 5000,
            'announcements' => [
                [
                    'text' => 'מגוון מוצרים בהנחות ענק בקטגוריית NALLA SALE בין 20% ל-50% הנחה!',
                    'link' => '/category/nalla-sale',
                    'bg_color' => '#e1eadf',
                    'text_color' => '#4a7c59',
                ],
            ],
        ]);
        
        return rest_ensure_response($settings);
    }
    
    /**
     * Get all spaces (custom taxonomy)
     */
    public function get_spaces() {
        $terms = get_terms([
            'taxonomy' => 'spaces',
            'hide_empty' => false,
        ]);
        
        if (is_wp_error($terms)) {
            return rest_ensure_response([]);
        }
        
        $spaces = array_map(function($term) {
            return [
                'id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
                'description' => $term->description,
                'count' => $term->count,
                'image' => get_term_meta($term->term_id, 'spaces_image', true),
            ];
        }, $terms);
        
        return rest_ensure_response($spaces);
    }
    
    /**
     * Get single space by slug
     */
    public function get_space_by_slug($request) {
        $slug = $request->get_param('slug');
        
        $term = get_term_by('slug', $slug, 'spaces');
        
        if (!$term || is_wp_error($term)) {
            return new WP_Error('space_not_found', 'Space not found', ['status' => 404]);
        }
        
        return rest_ensure_response([
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
            'count' => $term->count,
            'image' => get_term_meta($term->term_id, 'spaces_image', true),
        ]);
    }
    
    /**
     * Get products by space slug
     */
    public function get_products_by_space($request) {
        $slug = $request->get_param('slug');
        $per_page = $request->get_param('per_page') ?? 24;
        $page = $request->get_param('page') ?? 1;
        
        $term = get_term_by('slug', $slug, 'spaces');
        
        if (!$term || is_wp_error($term)) {
            return new WP_Error('space_not_found', 'Space not found', ['status' => 404]);
        }
        
        $args = [
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'tax_query' => [
                [
                    'taxonomy' => 'spaces',
                    'field' => 'slug',
                    'terms' => $slug,
                ],
            ],
        ];
        
        $query = new WP_Query($args);
        $products = [];
        
        foreach ($query->posts as $post) {
            $product = wc_get_product($post->ID);
            if (!$product) continue;
            
            $image_id = $product->get_image_id();
            $gallery_ids = $product->get_gallery_image_ids();
            
            $products[] = [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'permalink' => get_permalink($post->ID),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'stock_status' => $product->get_stock_status(),
                'images' => array_merge(
                    $image_id ? [[
                        'id' => $image_id,
                        'src' => wp_get_attachment_image_url($image_id, 'large'),
                        'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                    ]] : [],
                    array_map(function($id) {
                        return [
                            'id' => $id,
                            'src' => wp_get_attachment_image_url($id, 'large'),
                            'alt' => get_post_meta($id, '_wp_attachment_image_alt', true),
                        ];
                    }, $gallery_ids)
                ),
                'categories' => wp_get_post_terms($post->ID, 'product_cat', ['fields' => 'names']),
            ];
        }
        
        return rest_ensure_response([
            'space' => [
                'id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
                'description' => $term->description,
            ],
            'products' => $products,
            'total' => $query->found_posts,
            'total_pages' => $query->max_num_pages,
            'page' => (int)$page,
            'per_page' => (int)$per_page,
        ]);
    }
}
