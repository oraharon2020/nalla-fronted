<?php
/**
 * Mega Menu Module
 * 
 * Adds custom fields to WordPress menus and exposes them via REST API
 */

if (!defined('ABSPATH')) exit;

class Bellano_Mega_Menu {
    
    public function __construct() {
        // Register menu location - use init for plugins
        add_action('init', [$this, 'register_menu_location']);
        
        // Add custom fields to menu items
        add_action('wp_nav_menu_item_custom_fields', [$this, 'add_custom_fields'], 10, 5);
        
        // Save custom fields
        add_action('wp_update_nav_menu_item', [$this, 'save_custom_fields'], 10, 3);
        
        // Add REST API endpoint
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        
        // Enqueue admin scripts for media uploader
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
    }
    
    /**
     * Register mega menu location
     */
    public function register_menu_location() {
        register_nav_menus([
            'nalla-mega-menu' => __('Mega Menu (Next.js)', 'nalla'),
            'nalla-mega-menu-mobile' => __('Mega Menu Mobile (Next.js)', 'nalla'),
        ]);
    }
    
    /**
     * Enqueue admin scripts for media uploader
     */
    public function enqueue_admin_scripts($hook) {
        if ($hook !== 'nav-menus.php') return;
        
        wp_enqueue_media();
        wp_add_inline_script('jquery', $this->get_admin_script());
    }
    
    /**
     * Get inline admin script for media uploader
     */
    private function get_admin_script() {
        return "
        jQuery(document).ready(function($) {
            // Image upload
            $(document).on('click', '.bellano-upload-image', function(e) {
                e.preventDefault();
                var button = $(this);
                var inputField = button.siblings('.bellano-menu-image');
                var preview = button.siblings('.bellano-image-preview');
                
                var frame = wp.media({
                    title: 'בחר תמונה',
                    button: { text: 'בחר' },
                    multiple: false
                });
                
                frame.on('select', function() {
                    var attachment = frame.state().get('selection').first().toJSON();
                    inputField.val(attachment.url);
                    preview.html('<img src=\"' + attachment.url + '\" style=\"max-width:60px;max-height:60px;margin-top:5px;\">');
                    button.siblings('.bellano-remove-image').show();
                });
                
                frame.open();
            });
            
            // Remove image
            $(document).on('click', '.bellano-remove-image', function(e) {
                e.preventDefault();
                var button = $(this);
                button.siblings('.bellano-menu-image').val('');
                button.siblings('.bellano-image-preview').html('');
                button.hide();
            });
        });
        ";
    }
    
    /**
     * Add custom fields to menu item edit form
     */
    public function add_custom_fields($item_id, $menu_item, $depth, $args, $current_object_id) {
        $description = get_post_meta($item_id, '_bellano_menu_description', true);
        $icon = get_post_meta($item_id, '_bellano_menu_icon', true);
        $icon_svg = get_post_meta($item_id, '_bellano_menu_icon_svg', true);
        $image = get_post_meta($item_id, '_bellano_menu_image', true);
        $featured = get_post_meta($item_id, '_bellano_menu_featured', true);
        $featured_bg = get_post_meta($item_id, '_bellano_menu_featured_bg', true);
        ?>
        <div class="bellano-menu-fields" style="clear:both; padding:10px 0; border-top:1px solid #eee; margin-top:10px;">
            <p class="description" style="margin-bottom:10px; font-weight:bold; color:#2271b1;">
                🎨 הגדרות Mega Menu
            </p>
            
            <!-- Description -->
            <p class="field-bellano-description description-wide">
                <label for="edit-menu-item-bellano-description-<?php echo $item_id; ?>">
                    תיאור קצר (יוצג מתחת לשם)
                    <input type="text" 
                           id="edit-menu-item-bellano-description-<?php echo $item_id; ?>" 
                           class="widefat" 
                           name="menu-item-bellano-description[<?php echo $item_id; ?>]" 
                           value="<?php echo esc_attr($description); ?>" 
                           placeholder="למשל: כורסאות, ספות, שטיחים...">
                </label>
            </p>
            
            <!-- Icon (emoji or text) -->
            <p class="field-bellano-icon description-wide">
                <label for="edit-menu-item-bellano-icon-<?php echo $item_id; ?>">
                    אייקון (אימוג'י או טקסט)
                    <input type="text" 
                           id="edit-menu-item-bellano-icon-<?php echo $item_id; ?>" 
                           class="widefat" 
                           name="menu-item-bellano-icon[<?php echo $item_id; ?>]" 
                           value="<?php echo esc_attr($icon); ?>"
                           placeholder="🛋️"
                           style="max-width:100px;">
                </label>
            </p>
            
            <!-- Icon SVG -->
            <p class="field-bellano-icon-svg description-wide">
                <label for="edit-menu-item-bellano-icon-svg-<?php echo $item_id; ?>">
                    או קוד SVG
                    <textarea 
                           id="edit-menu-item-bellano-icon-svg-<?php echo $item_id; ?>" 
                           class="widefat" 
                           name="menu-item-bellano-icon-svg[<?php echo $item_id; ?>]" 
                           rows="3"
                           placeholder="<svg>...</svg>"
                           style="font-family:monospace;font-size:11px;"><?php echo esc_textarea($icon_svg); ?></textarea>
                </label>
                <span class="description" style="font-size:11px;color:#666;">הדבק כאן קוד SVG מלא. יש עדיפות ל-SVG על אימוג'י.</span>
            </p>
            
            <!-- Image -->
            <p class="field-bellano-image description-wide">
                <label>תמונה</label><br>
                <input type="hidden" 
                       class="bellano-menu-image" 
                       name="menu-item-bellano-image[<?php echo $item_id; ?>]" 
                       value="<?php echo esc_attr($image); ?>">
                <button type="button" class="button bellano-upload-image">בחר תמונה</button>
                <button type="button" class="button bellano-remove-image" style="<?php echo empty($image) ? 'display:none;' : ''; ?>">הסר</button>
                <span class="bellano-image-preview">
                    <?php if ($image): ?>
                        <img src="<?php echo esc_url($image); ?>" style="max-width:60px;max-height:60px;margin-top:5px;">
                    <?php endif; ?>
                </span>
            </p>
            
            <!-- Featured Item (for promo boxes) -->
            <p class="field-bellano-featured description-wide">
                <label>
                    <input type="checkbox" 
                           name="menu-item-bellano-featured[<?php echo $item_id; ?>]" 
                           value="1" 
                           <?php checked($featured, '1'); ?>>
                    פריט מודגש (באנר בצד)
                </label>
            </p>
            
            <!-- Featured Background Color -->
            <p class="field-bellano-featured-bg description-wide" style="<?php echo $featured !== '1' ? 'display:none;' : ''; ?>">
                <label for="edit-menu-item-bellano-featured-bg-<?php echo $item_id; ?>">
                    צבע רקע (לפריט מודגש)
                    <input type="text" 
                           id="edit-menu-item-bellano-featured-bg-<?php echo $item_id; ?>" 
                           class="widefat" 
                           name="menu-item-bellano-featured-bg[<?php echo $item_id; ?>]" 
                           value="<?php echo esc_attr($featured_bg); ?>"
                           placeholder="#4a7c59"
                           style="max-width:100px;">
                </label>
            </p>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            // Toggle featured bg field
            $('input[name="menu-item-bellano-featured[<?php echo $item_id; ?>]"]').on('change', function() {
                $(this).closest('.bellano-menu-fields').find('.field-bellano-featured-bg').toggle(this.checked);
            });
        });
        </script>
        <?php
    }
    
    /**
     * Save custom fields
     */
    public function save_custom_fields($menu_id, $menu_item_db_id, $args) {
        // Description
        if (isset($_POST['menu-item-bellano-description'][$menu_item_db_id])) {
            update_post_meta($menu_item_db_id, '_bellano_menu_description', 
                sanitize_text_field($_POST['menu-item-bellano-description'][$menu_item_db_id]));
        }
        
        // Icon
        if (isset($_POST['menu-item-bellano-icon'][$menu_item_db_id])) {
            update_post_meta($menu_item_db_id, '_bellano_menu_icon', 
                sanitize_text_field($_POST['menu-item-bellano-icon'][$menu_item_db_id]));
        }
        
        // Icon SVG - allow SVG tags
        if (isset($_POST['menu-item-bellano-icon-svg'][$menu_item_db_id])) {
            $svg = $_POST['menu-item-bellano-icon-svg'][$menu_item_db_id];
            // Basic SVG sanitization - keep only svg related tags
            $allowed_tags = [
                'svg' => ['xmlns', 'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'class'],
                'path' => ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
                'circle' => ['cx', 'cy', 'r', 'fill', 'stroke'],
                'rect' => ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'stroke'],
                'line' => ['x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width'],
                'polyline' => ['points', 'fill', 'stroke'],
                'polygon' => ['points', 'fill', 'stroke'],
                'ellipse' => ['cx', 'cy', 'rx', 'ry', 'fill', 'stroke'],
                'g' => ['fill', 'stroke', 'transform'],
                'defs' => [],
                'clipPath' => ['id'],
                'use' => ['href', 'xlink:href'],
            ];
            $svg = wp_kses($svg, $allowed_tags);
            update_post_meta($menu_item_db_id, '_bellano_menu_icon_svg', $svg);
        }
        
        // Image
        if (isset($_POST['menu-item-bellano-image'][$menu_item_db_id])) {
            update_post_meta($menu_item_db_id, '_bellano_menu_image', 
                esc_url_raw($_POST['menu-item-bellano-image'][$menu_item_db_id]));
        }
        
        // Featured
        $featured = isset($_POST['menu-item-bellano-featured'][$menu_item_db_id]) ? '1' : '';
        update_post_meta($menu_item_db_id, '_bellano_menu_featured', $featured);
        
        // Featured BG
        if (isset($_POST['menu-item-bellano-featured-bg'][$menu_item_db_id])) {
            update_post_meta($menu_item_db_id, '_bellano_menu_featured_bg', 
                sanitize_text_field($_POST['menu-item-bellano-featured-bg'][$menu_item_db_id]));
        }
    }
    
    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('bellano/v1', '/menu/(?P<location>[a-zA-Z0-9_-]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menu'],
            'permission_callback' => '__return_true',
        ]);
        
        register_rest_route('bellano/v1', '/menus', [
            'methods' => 'GET',
            'callback' => [$this, 'get_menu_locations'],
            'permission_callback' => '__return_true',
        ]);
    }
    
    /**
     * Get menu locations
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
        
        return rest_ensure_response($menus);
    }
    
    /**
     * Get menu by location
     */
    public function get_menu($request) {
        $location = $request['location'];
        $locations = get_nav_menu_locations();
        
        if (!isset($locations[$location])) {
            return new WP_Error('menu_not_found', 'תפריט לא נמצא', ['status' => 404]);
        }
        
        $menu_id = $locations[$location];
        $menu_items = wp_get_nav_menu_items($menu_id);
        
        if (empty($menu_items)) {
            return rest_ensure_response([]);
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
        $icon_svg = get_post_meta($item->ID, '_bellano_menu_icon_svg', true);
        
        return [
            'id' => $item->ID,
            'title' => $item->title,
            'url' => $item->url,
            'target' => $item->target,
            'description' => get_post_meta($item->ID, '_bellano_menu_description', true),
            'icon' => get_post_meta($item->ID, '_bellano_menu_icon', true),
            'icon_svg' => $icon_svg,
            'image' => get_post_meta($item->ID, '_bellano_menu_image', true),
            'featured' => get_post_meta($item->ID, '_bellano_menu_featured', true) === '1',
            'featured_bg' => get_post_meta($item->ID, '_bellano_menu_featured_bg', true),
            'type' => $item->type,
            'object' => $item->object,
            'object_id' => $item->object_id,
            'children' => [],
        ];
    }
}
