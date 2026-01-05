<?php
/**
 * Mobile Menu Module
 */

if (!defined('ABSPATH')) exit;

class Bellano_Mobile_Menu {
    
    private $option_name = 'bellano_mobile_menu';
    
    public function __construct() {
        add_action('admin_init', [$this, 'register_settings']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }
    
    public function register_settings() {
        register_setting($this->option_name, $this->option_name, [
            'sanitize_callback' => [$this, 'sanitize_settings']
        ]);
    }
    
    public function sanitize_settings($input) {
        $sanitized = [];
        
        if (isset($input['items']) && is_array($input['items'])) {
            $sanitized['items'] = [];
            foreach ($input['items'] as $index => $item) {
                $sanitized['items'][$index] = [
                    'title' => sanitize_text_field($item['title'] ?? ''),
                    'url' => esc_url_raw($item['url'] ?? ''),
                    'icon' => sanitize_text_field($item['icon'] ?? ''),
                    'has_submenu' => !empty($item['has_submenu']),
                    'submenu' => [],
                ];
                
                if (isset($item['submenu']) && is_array($item['submenu'])) {
                    foreach ($item['submenu'] as $sub_index => $sub_item) {
                        $sanitized['items'][$index]['submenu'][$sub_index] = [
                            'title' => sanitize_text_field($sub_item['title'] ?? ''),
                            'url' => esc_url_raw($sub_item['url'] ?? ''),
                            'icon' => sanitize_text_field($sub_item['icon'] ?? ''),
                        ];
                    }
                }
            }
        }
        
        $sanitized['phone'] = sanitize_text_field($input['phone'] ?? '');
        $sanitized['whatsapp'] = sanitize_text_field($input['whatsapp'] ?? '');
        
        return $sanitized;
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
        
        <form method="post" action="options.php" id="mobile-menu-form">
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
                
                <button type="button" id="add-menu-item" class="button button-secondary" style="margin-top:15px;">
                    ➕ הוסף פריט
                </button>
            </div>
            
            <div style="background:#fff;padding:20px;border:1px solid #ccc;border-radius:8px;margin-top:20px;">
                <h3 style="margin-top:0;">פרטי קשר</h3>
                
                <table class="form-table">
                    <tr>
                        <th><label for="phone">טלפון</label></th>
                        <td>
                            <input type="text" id="phone" name="<?php echo $this->option_name; ?>[phone]" 
                                   value="<?php echo esc_attr($settings['phone'] ?? ''); ?>" 
                                   class="regular-text" placeholder="073-3733070" dir="ltr">
                        </td>
                    </tr>
                    <tr>
                        <th><label for="whatsapp">וואטסאפ</label></th>
                        <td>
                            <input type="text" id="whatsapp" name="<?php echo $this->option_name; ?>[whatsapp]" 
                                   value="<?php echo esc_attr($settings['whatsapp'] ?? ''); ?>" 
                                   class="regular-text" placeholder="972733733070" dir="ltr">
                        </td>
                    </tr>
                </table>
            </div>
            
            <?php submit_button('שמור תפריט'); ?>
        </form>
        
        <script type="text/template" id="menu-item-template">
            <?php $this->render_menu_item('{{INDEX}}'); ?>
        </script>
        
        <script type="text/template" id="submenu-item-template">
            <?php $this->render_submenu_item('{{PARENT}}', '{{INDEX}}'); ?>
        </script>
        
        <style>
            .menu-item-box { background: #f9f9f9; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin-bottom: 15px; position: relative; }
            .menu-item-box .remove-item { position: absolute; top: 10px; left: 10px; color: #dc3545; cursor: pointer; font-size: 18px; }
            .submenu-container { margin-top: 15px; padding: 15px; background: #fff; border: 1px dashed #ccc; border-radius: 4px; }
            .submenu-item { background: #f0f0f0; padding: 10px; margin-bottom: 10px; border-radius: 4px; position: relative; }
            .submenu-item .remove-subitem { position: absolute; top: 5px; left: 5px; color: #dc3545; cursor: pointer; }
            .mobile-field-row { display: flex; gap: 15px; margin-bottom: 10px; flex-wrap: wrap; }
            .mobile-field-row .mobile-field { flex: 1; min-width: 200px; }
            .mobile-field-row .mobile-field.small { flex: 0 0 80px; min-width: 80px; }
            .mobile-field label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 12px; }
            .mobile-field input[type="text"] { width: 100%; }
        </style>
        
        <script>
        jQuery(document).ready(function($) {
            var itemCount = <?php echo count($items) ?: 1; ?>;
            
            $('#add-menu-item').on('click', function() {
                var template = $('#menu-item-template').html();
                template = template.replace(/\{\{INDEX\}\}/g, itemCount);
                $('#menu-items-container').append(template);
                itemCount++;
            });
            
            $(document).on('click', '.remove-item', function() {
                $(this).closest('.menu-item-box').remove();
            });
            
            $(document).on('change', '.has-submenu-checkbox', function() {
                $(this).closest('.menu-item-box').find('.submenu-container').toggle(this.checked);
            });
            
            $(document).on('click', '.add-submenu-item', function() {
                var container = $(this).siblings('.submenu-items');
                var parentIndex = $(this).data('parent');
                var subCount = container.children().length;
                var template = $('#submenu-item-template').html();
                template = template.replace(/\{\{PARENT\}\}/g, parentIndex);
                template = template.replace(/\{\{INDEX\}\}/g, subCount);
                container.append(template);
            });
            
            $(document).on('click', '.remove-subitem', function() {
                $(this).closest('.submenu-item').remove();
            });
        });
        </script>
        <?php
    }
    
    private function render_menu_item($index, $item = []) {
        $title = $item['title'] ?? '';
        $url = $item['url'] ?? '';
        $icon = $item['icon'] ?? '';
        $has_submenu = !empty($item['has_submenu']);
        $submenu = $item['submenu'] ?? [];
        ?>
        <div class="menu-item-box">
            <span class="remove-item" title="הסר פריט">✕</span>
            
            <div class="mobile-field-row">
                <div class="mobile-field">
                    <label>שם הפריט</label>
                    <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $index; ?>][title]" 
                           value="<?php echo esc_attr($title); ?>" placeholder="סלון">
                </div>
                <div class="mobile-field">
                    <label>קישור</label>
                    <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $index; ?>][url]" 
                           value="<?php echo esc_attr($url); ?>" placeholder="/product-category/living-room" dir="ltr">
                </div>
                <div class="mobile-field small">
                    <label>אייקון</label>
                    <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $index; ?>][icon]" 
                           value="<?php echo esc_attr($icon); ?>" placeholder="🛋️">
                </div>
            </div>
            
            <div class="mobile-field-row">
                <div class="mobile-field">
                    <label>
                        <input type="checkbox" class="has-submenu-checkbox" 
                               name="<?php echo $this->option_name; ?>[items][<?php echo $index; ?>][has_submenu]" 
                               value="1" <?php checked($has_submenu); ?>>
                        יש תת-תפריט
                    </label>
                </div>
            </div>
            
            <div class="submenu-container" style="<?php echo $has_submenu ? '' : 'display:none;'; ?>">
                <h4 style="margin-top:0;">תת-פריטים</h4>
                <div class="submenu-items">
                    <?php foreach ($submenu as $sub_index => $sub_item): ?>
                        <?php $this->render_submenu_item($index, $sub_index, $sub_item); ?>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="button button-small add-submenu-item" data-parent="<?php echo $index; ?>">
                    ➕ הוסף תת-פריט
                </button>
            </div>
        </div>
        <?php
    }
    
    private function render_submenu_item($parent_index, $index, $item = []) {
        $title = $item['title'] ?? '';
        $url = $item['url'] ?? '';
        $icon = $item['icon'] ?? '';
        ?>
        <div class="submenu-item">
            <span class="remove-subitem" title="הסר">✕</span>
            <div class="mobile-field-row">
                <div class="mobile-field">
                    <label>שם</label>
                    <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $parent_index; ?>][submenu][<?php echo $index; ?>][title]" 
                           value="<?php echo esc_attr($title); ?>" placeholder="מזנונים">
                </div>
                <div class="mobile-field">
                    <label>קישור</label>
                    <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $parent_index; ?>][submenu][<?php echo $index; ?>][url]" 
                           value="<?php echo esc_attr($url); ?>" placeholder="/product-category/tv-units" dir="ltr">
                </div>
                <div class="mobile-field small">
                    <label>אייקון</label>
                    <input type="text" name="<?php echo $this->option_name; ?>[items][<?php echo $parent_index; ?>][submenu][<?php echo $index; ?>][icon]" 
                           value="<?php echo esc_attr($icon); ?>" placeholder="📺">
                </div>
            </div>
        </div>
        <?php
    }
}
