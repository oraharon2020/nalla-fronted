<?php
/**
 * Bellano Mobile Menu Module
 * Handles mobile menu management with categories/pages selection
 */

if (!defined('ABSPATH')) exit;

class Bellano_Mobile_Menu {
    
    private $option_name = 'bellano_mobile_menu';
    
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }
    
    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        register_rest_route('bellano/v1', '/mobile-menu', [
            'methods' => 'GET',
            'callback' => [$this, 'get_mobile_menu_api'],
            'permission_callback' => '__return_true',
        ]);
    }
    
    /**
     * API endpoint to get mobile menu
     */
    public function get_mobile_menu_api() {
        $settings = get_option($this->option_name, array());
        return rest_ensure_response([
            'items' => $settings['items'] ?? [],
            'phone' => $settings['phone'] ?? '',
            'whatsapp' => $settings['whatsapp'] ?? '',
        ]);
    }
    
    /**
     * Render the mobile menu admin tab
     */
    public function render_tab() {
        // Handle save
        if (isset($_POST['save_mobile_menu']) && check_admin_referer('bellano_mobile_menu_nonce')) {
            $this->save_menu();
        }
        
        $settings = get_option($this->option_name, array());
        $items = $settings['items'] ?? array();
        $phone = $settings['phone'] ?? '';
        $whatsapp = $settings['whatsapp'] ?? '';
        
        // Get categories and pages for the picker
        $categories = $this->get_product_categories();
        $pages = $this->get_pages();
        $product_tags = $this->get_product_tags();
        ?>
        <div class="bellano-card">
            <h2>📱 תפריט מובייל</h2>
            <p class="description">בחר קטגוריות, תגיות או דפים להוספה לתפריט המובייל. גרור לשינוי הסדר.</p>
            
            <div style="display: flex; gap: 20px; margin-top: 20px;">
                <!-- Left: Available Items -->
                <div style="width: 300px; flex-shrink: 0;">
                    <div class="bellano-card" style="margin: 0; padding: 15px;">
                        <h4 style="margin: 0 0 15px 0;">📁 קטגוריות מוצרים</h4>
                        <div style="max-height: 250px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;">
                            <?php foreach ($categories as $cat): ?>
                            <div class="available-item" draggable="true" 
                                 data-type="category" 
                                 data-id="<?php echo esc_attr($cat->term_id); ?>"
                                 data-title="<?php echo esc_attr($cat->name); ?>"
                                 data-url="/product-category/<?php echo esc_attr($cat->slug); ?>"
                                 style="padding: 8px 12px; border-bottom: 1px solid #eee; cursor: grab; display: flex; align-items: center; gap: 8px;">
                                <span style="color: #999;">📁</span>
                                <?php echo esc_html($cat->name); ?>
                                <span style="color: #999; font-size: 11px; margin-right: auto;">(<?php echo $cat->count; ?>)</span>
                            </div>
                            <?php endforeach; ?>
                        </div>
                        
                        <h4 style="margin: 20px 0 15px 0;">🏷️ תגיות מוצרים</h4>
                        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;">
                            <?php foreach ($product_tags as $tag): ?>
                            <div class="available-item" draggable="true" 
                                 data-type="tag" 
                                 data-id="<?php echo esc_attr($tag->term_id); ?>"
                                 data-title="<?php echo esc_attr($tag->name); ?>"
                                 data-url="/product-tag/<?php echo esc_attr($tag->slug); ?>"
                                 style="padding: 8px 12px; border-bottom: 1px solid #eee; cursor: grab; display: flex; align-items: center; gap: 8px;">
                                <span style="color: #999;">🏷️</span>
                                <?php echo esc_html($tag->name); ?>
                            </div>
                            <?php endforeach; ?>
                        </div>
                        
                        <h4 style="margin: 20px 0 15px 0;">📄 דפים</h4>
                        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;">
                            <?php foreach ($pages as $page): ?>
                            <div class="available-item" draggable="true" 
                                 data-type="page" 
                                 data-id="<?php echo esc_attr($page->ID); ?>"
                                 data-title="<?php echo esc_attr($page->post_title); ?>"
                                 data-url="/<?php echo esc_attr($page->post_name); ?>"
                                 style="padding: 8px 12px; border-bottom: 1px solid #eee; cursor: grab; display: flex; align-items: center; gap: 8px;">
                                <span style="color: #999;">📄</span>
                                <?php echo esc_html($page->post_title); ?>
                            </div>
                            <?php endforeach; ?>
                        </div>
                        
                        <h4 style="margin: 20px 0 15px 0;">🔗 קישור מותאם</h4>
                        <div style="padding: 10px; background: #f5f5f5; border-radius: 4px;">
                            <input type="text" id="custom-link-title" placeholder="שם הקישור" style="width: 100%; margin-bottom: 8px;">
                            <input type="text" id="custom-link-url" placeholder="/custom-page" dir="ltr" style="width: 100%; margin-bottom: 8px;">
                            <button type="button" onclick="addCustomLink()" class="button button-small">➕ הוסף</button>
                        </div>
                    </div>
                </div>
                
                <!-- Right: Menu Structure -->
                <div style="flex: 1;">
                    <form method="post">
                        <?php wp_nonce_field('bellano_mobile_menu_nonce'); ?>
                        
                        <div class="bellano-card" style="margin: 0; padding: 15px; margin-bottom: 15px;">
                            <h4 style="margin: 0 0 10px 0;">📞 פרטי קשר</h4>
                            <div style="display: flex; gap: 15px;">
                                <div style="flex: 1;">
                                    <label style="font-size: 11px; color: #666;">טלפון</label>
                                    <input type="text" name="phone" value="<?php echo esc_attr($phone); ?>" style="width: 100%;" dir="ltr">
                                </div>
                                <div style="flex: 1;">
                                    <label style="font-size: 11px; color: #666;">וואטסאפ</label>
                                    <input type="text" name="whatsapp" value="<?php echo esc_attr($whatsapp); ?>" style="width: 100%;" dir="ltr">
                                </div>
                            </div>
                        </div>
                        
                        <div class="bellano-card" style="margin: 0; padding: 15px;">
                            <h4 style="margin: 0 0 15px 0;">📋 מבנה התפריט <span style="font-weight: normal; color: #666; font-size: 12px;">(גרור פריטים מצד שמאל או סדר מחדש)</span></h4>
                            
                            <div id="menu-drop-zone" style="min-height: 200px; border: 2px dashed #ccc; border-radius: 8px; padding: 15px; background: #fafafa;">
                                <?php if (empty($items)): ?>
                                <p class="empty-message" style="text-align: center; color: #999; margin: 50px 0;">גרור פריטים לכאן</p>
                                <?php else: ?>
                                <?php foreach ($items as $index => $item): ?>
                                <?php $this->render_menu_item($index, $item); ?>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <button type="submit" name="save_mobile_menu" class="button button-primary button-large">💾 שמור תפריט</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
        <script>
        var menuItemIndex = <?php echo count($items); ?>;
        var subMenuIndexes = {};
        <?php foreach ($items as $index => $item): ?>
        subMenuIndexes[<?php echo $index; ?>] = <?php echo count($item['children'] ?? array()); ?>;
        <?php endforeach; ?>
        
        document.addEventListener('DOMContentLoaded', function() {
            // Make available items draggable
            document.querySelectorAll('.available-item').forEach(function(item) {
                item.addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        type: this.dataset.type,
                        id: this.dataset.id,
                        title: this.dataset.title,
                        url: this.dataset.url
                    }));
                    this.style.opacity = '0.5';
                });
                item.addEventListener('dragend', function() {
                    this.style.opacity = '1';
                });
            });
            
            // Drop zone
            var dropZone = document.getElementById('menu-drop-zone');
            
            dropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.borderColor = '#0073aa';
                this.style.background = '#f0f7fc';
            });
            
            dropZone.addEventListener('dragleave', function() {
                this.style.borderColor = '#ccc';
                this.style.background = '#fafafa';
            });
            
            dropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.borderColor = '#ccc';
                this.style.background = '#fafafa';
                
                try {
                    var data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    addMenuItem(data.title, data.url, data.type);
                    
                    // Remove empty message
                    var emptyMsg = this.querySelector('.empty-message');
                    if (emptyMsg) emptyMsg.remove();
                } catch(err) {}
            });
            
            // Sortable for menu items
            new Sortable(dropZone, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                filter: '.empty-message',
                onEnd: reindexItems
            });
        });
        
        function addMenuItem(title, url, type) {
            var icon = type === 'category' ? '📁' : (type === 'tag' ? '🏷️' : (type === 'page' ? '📄' : '🔗'));
            var container = document.getElementById('menu-drop-zone');
            var html = `
                <div class="menu-item-wrapper" data-index="${menuItemIndex}">
                    <div class="menu-item" style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #fff; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 8px;">
                        <span class="drag-handle" style="cursor: grab; color: #999; font-size: 16px;">☰</span>
                        <input type="hidden" name="menu_items[${menuItemIndex}][type]" value="${type}">
                        <div style="width: 45px;">
                            <input type="text" name="menu_items[${menuItemIndex}][icon]" value="${icon}" style="width: 100%; text-align: center; font-size: 16px; padding: 4px;">
                        </div>
                        <div style="flex: 1;">
                            <input type="text" name="menu_items[${menuItemIndex}][title]" value="${title}" style="width: 100%;" placeholder="שם">
                        </div>
                        <div style="flex: 1;">
                            <input type="text" name="menu_items[${menuItemIndex}][url]" value="${url}" style="width: 100%; direction: ltr;" readonly>
                        </div>
                        <button type="button" onclick="toggleSubMenu(this)" class="button button-small" title="תת-תפריט">📂</button>
                        <button type="button" onclick="removeMenuItem(this)" class="button button-small" style="color: red;">✕</button>
                    </div>
                    <div class="sub-menu-container" style="margin-right: 25px; margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-radius: 6px; border: 1px dashed #ddd; display: none;">
                        <div class="sub-menu-items"></div>
                        <button type="button" onclick="addSubMenuItem(this, ${menuItemIndex})" class="button button-small">➕ תת-פריט</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            subMenuIndexes[menuItemIndex] = 0;
            menuItemIndex++;
        }
        
        function addCustomLink() {
            var title = document.getElementById('custom-link-title').value;
            var url = document.getElementById('custom-link-url').value;
            if (title && url) {
                addMenuItem(title, url, 'custom');
                document.getElementById('custom-link-title').value = '';
                document.getElementById('custom-link-url').value = '';
                
                var emptyMsg = document.querySelector('#menu-drop-zone .empty-message');
                if (emptyMsg) emptyMsg.remove();
            }
        }
        
        function removeMenuItem(btn) {
            btn.closest('.menu-item-wrapper').remove();
            reindexItems();
            
            // Show empty message if no items
            var dropZone = document.getElementById('menu-drop-zone');
            if (!dropZone.querySelector('.menu-item-wrapper')) {
                dropZone.innerHTML = '<p class="empty-message" style="text-align: center; color: #999; margin: 50px 0;">גרור פריטים לכאן</p>';
            }
        }
        
        function toggleSubMenu(btn) {
            var wrapper = btn.closest('.menu-item-wrapper');
            var subContainer = wrapper.querySelector('.sub-menu-container');
            subContainer.style.display = subContainer.style.display === 'none' ? 'block' : 'none';
        }
        
        function addSubMenuItem(btn, parentIndex) {
            var container = btn.previousElementSibling;
            var subIndex = subMenuIndexes[parentIndex] || 0;
            var html = `
                <div class="sub-menu-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff; border-radius: 4px; margin-bottom: 5px; border: 1px solid #e5e5e5;">
                    <span style="color: #ccc;">↳</span>
                    <input type="text" name="menu_items[${parentIndex}][children][${subIndex}][icon]" value="📌" style="width: 35px; text-align: center;">
                    <input type="text" name="menu_items[${parentIndex}][children][${subIndex}][title]" placeholder="שם" style="flex: 1;">
                    <input type="text" name="menu_items[${parentIndex}][children][${subIndex}][url]" placeholder="/url" style="flex: 1; direction: ltr;">
                    <button type="button" onclick="this.closest('.sub-menu-item').remove()" class="button button-small" style="color: red;">✕</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            subMenuIndexes[parentIndex] = subIndex + 1;
        }
        
        function reindexItems() {
            var items = document.querySelectorAll('#menu-drop-zone .menu-item-wrapper');
            items.forEach(function(item, newIndex) {
                item.querySelectorAll('input[name]').forEach(function(input) {
                    var name = input.getAttribute('name');
                    if (name) {
                        input.setAttribute('name', name.replace(/menu_items\[\d+\]/, 'menu_items[' + newIndex + ']'));
                    }
                });
                var addSubBtn = item.querySelector('.sub-menu-container > button');
                if (addSubBtn) {
                    addSubBtn.setAttribute('onclick', 'addSubMenuItem(this, ' + newIndex + ')');
                }
                item.setAttribute('data-index', newIndex);
            });
            menuItemIndex = items.length;
        }
        </script>
        
        <style>
            .sortable-ghost { opacity: 0.4; }
            .menu-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
            .available-item:hover { background: #f0f7fc; }
            .drag-handle:active { cursor: grabbing; }
        </style>
        <?php
    }
    
    /**
     * Render a single menu item
     */
    private function render_menu_item($index, $item) {
        $type = $item['type'] ?? 'custom';
        $icon = $item['icon'] ?? '🔗';
        ?>
        <div class="menu-item-wrapper" data-index="<?php echo $index; ?>">
            <div class="menu-item" style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #fff; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 8px;">
                <span class="drag-handle" style="cursor: grab; color: #999; font-size: 16px;">☰</span>
                <input type="hidden" name="menu_items[<?php echo $index; ?>][type]" value="<?php echo esc_attr($type); ?>">
                <div style="width: 45px;">
                    <input type="text" name="menu_items[<?php echo $index; ?>][icon]" value="<?php echo esc_attr($icon); ?>" style="width: 100%; text-align: center; font-size: 16px; padding: 4px;">
                </div>
                <div style="flex: 1;">
                    <input type="text" name="menu_items[<?php echo $index; ?>][title]" value="<?php echo esc_attr($item['title']); ?>" style="width: 100%;" placeholder="שם">
                </div>
                <div style="flex: 1;">
                    <input type="text" name="menu_items[<?php echo $index; ?>][url]" value="<?php echo esc_attr($item['url']); ?>" style="width: 100%; direction: ltr;" <?php echo $type !== 'custom' ? 'readonly' : ''; ?>>
                </div>
                <button type="button" onclick="toggleSubMenu(this)" class="button button-small" title="תת-תפריט">📂</button>
                <button type="button" onclick="removeMenuItem(this)" class="button button-small" style="color: red;">✕</button>
            </div>
            <div class="sub-menu-container" style="margin-right: 25px; margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-radius: 6px; border: 1px dashed #ddd; <?php echo empty($item['children']) ? 'display: none;' : ''; ?>">
                <div class="sub-menu-items">
                    <?php 
                    $children = $item['children'] ?? array();
                    foreach ($children as $childIndex => $child): 
                    ?>
                    <div class="sub-menu-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #fff; border-radius: 4px; margin-bottom: 5px; border: 1px solid #e5e5e5;">
                        <span style="color: #ccc;">↳</span>
                        <input type="text" name="menu_items[<?php echo $index; ?>][children][<?php echo $childIndex; ?>][icon]" value="<?php echo esc_attr($child['icon'] ?? '📌'); ?>" style="width: 35px; text-align: center;">
                        <input type="text" name="menu_items[<?php echo $index; ?>][children][<?php echo $childIndex; ?>][title]" value="<?php echo esc_attr($child['title']); ?>" placeholder="שם" style="flex: 1;">
                        <input type="text" name="menu_items[<?php echo $index; ?>][children][<?php echo $childIndex; ?>][url]" value="<?php echo esc_attr($child['url']); ?>" placeholder="/url" style="flex: 1; direction: ltr;">
                        <button type="button" onclick="this.closest('.sub-menu-item').remove()" class="button button-small" style="color: red;">✕</button>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" onclick="addSubMenuItem(this, <?php echo $index; ?>)" class="button button-small">➕ תת-פריט</button>
            </div>
        </div>
        <?php
    }
    
    /**
     * Save menu settings
     */
    private function save_menu() {
        $settings = array(
            'phone' => sanitize_text_field($_POST['phone'] ?? ''),
            'whatsapp' => sanitize_text_field($_POST['whatsapp'] ?? ''),
            'items' => array()
        );
        
        if (isset($_POST['menu_items']) && is_array($_POST['menu_items'])) {
            foreach ($_POST['menu_items'] as $item) {
                if (!empty($item['title'])) {
                    $menu_item = array(
                        'type' => sanitize_text_field($item['type'] ?? 'custom'),
                        'title' => sanitize_text_field($item['title']),
                        'url' => $item['url'], // Keep URL as-is for Hebrew slugs
                        'icon' => $item['icon'] ?? '🔗',
                        'children' => array()
                    );
                    
                    if (!empty($item['children']) && is_array($item['children'])) {
                        foreach ($item['children'] as $child) {
                            if (!empty($child['title'])) {
                                $menu_item['children'][] = array(
                                    'title' => sanitize_text_field($child['title']),
                                    'url' => $child['url'],
                                    'icon' => $child['icon'] ?? '📌'
                                );
                            }
                        }
                    }
                    
                    $settings['items'][] = $menu_item;
                }
            }
        }
        
        update_option($this->option_name, $settings);
        echo '<div class="notice notice-success"><p>✅ התפריט נשמר בהצלחה!</p></div>';
    }
    
    /**
     * Get product categories
     */
    private function get_product_categories() {
        if (!taxonomy_exists('product_cat')) {
            return array();
        }
        
        $terms = get_terms(array(
            'taxonomy' => 'product_cat',
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC',
        ));
        
        return is_wp_error($terms) ? array() : $terms;
    }
    
    /**
     * Get product tags
     */
    private function get_product_tags() {
        if (!taxonomy_exists('product_tag')) {
            return array();
        }
        
        $terms = get_terms(array(
            'taxonomy' => 'product_tag',
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC',
        ));
        
        return is_wp_error($terms) ? array() : $terms;
    }
    
    /**
     * Get pages
     */
    private function get_pages() {
        return get_pages(array(
            'sort_column' => 'post_title',
            'sort_order' => 'ASC',
            'post_status' => 'publish',
        ));
    }
}
