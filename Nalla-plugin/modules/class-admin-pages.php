<?php
/**
 * Bellano Admin Pages Module
 * Handles admin menu and page rendering
 */

if (!defined('ABSPATH')) exit;

class Bellano_Admin_Pages {
    
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_mobile_menu_api']);
    }
    
    public function register_mobile_menu_api() {
        register_rest_route('bellano/v1', '/mobile-menu', [
            'methods' => 'GET',
            'callback' => [$this, 'get_mobile_menu_api'],
            'permission_callback' => '__return_true',
        ]);
    }
    
    public function get_mobile_menu_api() {
        $settings = get_option('bellano_mobile_menu', array());
        return rest_ensure_response([
            'items' => $settings['items'] ?? [],
            'phone' => $settings['phone'] ?? '',
            'whatsapp' => $settings['whatsapp'] ?? '',
        ]);
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'הגדרות בלאנו',
            'בלאנו',
            'manage_options',
            'bellano-settings',
            [$this, 'render_admin_page'],
            'dashicons-admin-generic',
            30
        );
    }
    
    public function render_admin_page() {
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'homepage';
        $plugin = Bellano_Settings::get_instance();
        ?>
        <div class="wrap bellano-admin" dir="rtl">
            <h1>⚙️ הגדרות בלאנו</h1>
            
            <?php $this->render_styles(); ?>
            
            <nav class="bellano-tabs">
                <a href="?page=bellano-settings&tab=homepage" class="<?php echo $active_tab === 'homepage' ? 'active' : ''; ?>">
                    🏠 עריכת דף בית
                </a>
                <a href="?page=bellano-settings&tab=category-icons" class="<?php echo $active_tab === 'category-icons' ? 'active' : ''; ?>">
                    📁 אייקוני קטגוריות
                </a>
                <a href="?page=bellano-settings&tab=banners" class="<?php echo $active_tab === 'banners' ? 'active' : ''; ?>">
                    🖼️ באנרים
                </a>
                <a href="?page=bellano-settings&tab=faq" class="<?php echo $active_tab === 'faq' ? 'active' : ''; ?>">
                    ❓ שאלות נפוצות
                </a>
                <a href="?page=bellano-settings&tab=upgrades" class="<?php echo $active_tab === 'upgrades' ? 'active' : ''; ?>">
                    ⬆️ שדרוגים
                </a>
                <a href="?page=bellano-settings&tab=videos" class="<?php echo $active_tab === 'videos' ? 'active' : ''; ?>">
                    🎬 סרטונים
                </a>
                <a href="?page=bellano-settings&tab=cache" class="<?php echo $active_tab === 'cache' ? 'active' : ''; ?>">
                    🗑️ ניקוי קאש
                </a>
                <a href="?page=bellano-settings&tab=mega-menu" class="<?php echo $active_tab === 'mega-menu' ? 'active' : ''; ?>">
                    📋 מגה מניו
                </a>
                <a href="?page=bellano-settings&tab=navigation" class="<?php echo $active_tab === 'navigation' ? 'active' : ''; ?>">
                    🧭 תפריט ראשי
                </a>
                <a href="?page=bellano-settings&tab=footer" class="<?php echo $active_tab === 'footer' ? 'active' : ''; ?>">
                    📝 פוטר
                </a>
                <a href="?page=bellano-settings&tab=announcements" class="<?php echo $active_tab === 'announcements' ? 'active' : ''; ?>">
                    📢 הודעות עליונות
                </a>
                <a href="?page=bellano-settings&tab=mobile-menu" class="<?php echo $active_tab === 'mobile-menu' ? 'active' : ''; ?>">
                    📱 תפריט מובייל
                </a>
            </nav>
            
            <?php
            switch ($active_tab) {
                case 'homepage':
                    $this->render_homepage_tab();
                    break;
                case 'category-icons':
                    $this->render_category_icons_tab();
                    break;
                case 'banners':
                    $plugin->banners->render_tab();
                    break;
                case 'faq':
                    $plugin->faq->render_tab();
                    break;
                case 'upgrades':
                    $plugin->upgrades->render_tab();
                    break;
                case 'videos':
                    $plugin->product_video->render_tab();
                    break;
                case 'cache':
                    $plugin->cache->render_tab();
                    break;
                case 'mega-menu':
                    $this->render_mega_menu_tab();
                    break;
                case 'navigation':
                    $this->render_navigation_tab();
                    break;
                case 'footer':
                    $this->render_footer_tab();
                    break;
                case 'announcements':
                    $this->render_announcements_tab();
                    break;
                case 'mobile-menu':
                    $this->render_mobile_menu_tab();
                    break;
                default:
                    $this->render_homepage_tab();
            }
            ?>
        </div>
        <?php
    }
    
    /**
     * Render Homepage Edit Tab
     */
    public function render_homepage_tab() {
        $featured_ids = get_option('bellano_featured_categories', array());
        if (!is_array($featured_ids)) {
            $featured_ids = array();
        }
        
        // Get all product categories - check if WooCommerce is active
        $categories = array();
        if (taxonomy_exists('product_cat')) {
            $terms = get_terms(array(
                'taxonomy' => 'product_cat',
                'hide_empty' => false,
                'parent' => 0,
            ));
            if (!is_wp_error($terms)) {
                $categories = $terms;
            }
        }
        ?>
        <div class="bellano-card">
            <h2>🏷️ קטגוריות מומלצות</h2>
            <p class="description">בחרו קטגוריות שיוצגו בסקציית "מה אתם מחפשים?" בעמוד הבית. גררו לשינוי הסדר.</p></p>
            
            <div class="categories-container" style="display: flex; gap: 30px; margin-top: 20px;">
                <!-- Available Categories -->
                <div class="available-categories" style="flex: 1;">
                    <h4 style="margin-bottom: 10px;">קטגוריות זמינות</h4>
                    <div id="available-list" style="background: #f9f9f9; padding: 15px; border-radius: 8px; min-height: 200px; border: 2px dashed #ddd;">
                        <?php foreach ($categories as $cat): 
                            if (in_array($cat->term_id, $featured_ids)) continue;
                            $thumbnail_id = get_term_meta($cat->term_id, 'thumbnail_id', true);
                            $image_url = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'thumbnail') : '';
                        ?>
                        <div class="category-item" data-id="<?php echo esc_attr($cat->term_id); ?>" 
                             style="background: white; padding: 10px 12px; margin-bottom: 6px; border-radius: 6px; cursor: move; display: flex; align-items: center; gap: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #e5e5e5;">
                            <?php if ($image_url): ?>
                            <img src="<?php echo esc_url($image_url); ?>" style="width: 36px; height: 36px; object-fit: cover; border-radius: 4px;">
                            <?php else: ?>
                            <div style="width: 36px; height: 36px; background: #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">📷</div>
                            <?php endif; ?>
                            <span style="flex: 1; font-weight: 500;"><?php echo esc_html($cat->name); ?></span>
                            <span style="color: #999; font-size: 11px;"><?php echo $cat->count; ?> מוצרים</span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                
                <!-- Featured Categories -->
                <div class="featured-categories" style="flex: 1;">
                    <h4 style="margin-bottom: 10px;">✓ קטגוריות נבחרות</h4>
                    <div id="featured-list" style="background: #e8f5e9; padding: 15px; border-radius: 8px; min-height: 200px; border: 2px dashed #4CAF50;">
                        <?php foreach ($featured_ids as $cat_id): 
                            $cat = get_term($cat_id, 'product_cat');
                            if (!$cat || is_wp_error($cat)) continue;
                            $thumbnail_id = get_term_meta($cat->term_id, 'thumbnail_id', true);
                            $image_url = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'thumbnail') : '';
                        ?>
                        <div class="category-item" data-id="<?php echo esc_attr($cat->term_id); ?>" 
                             style="background: white; padding: 10px 12px; margin-bottom: 6px; border-radius: 6px; cursor: move; display: flex; align-items: center; gap: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #4CAF50;">
                            <?php if ($image_url): ?>
                            <img src="<?php echo esc_url($image_url); ?>" style="width: 36px; height: 36px; object-fit: cover; border-radius: 4px;">
                            <?php else: ?>
                            <div style="width: 36px; height: 36px; background: #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">📷</div>
                            <?php endif; ?>
                            <span style="flex: 1; font-weight: 500;"><?php echo esc_html($cat->name); ?></span>
                            <span style="color: #999; font-size: 11px;"><?php echo $cat->count; ?> מוצרים</span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; display: flex; align-items: center; gap: 15px;">
                <button type="button" id="save-featured-categories" class="button button-primary">
                    💾 שמור קטגוריות
                </button>
                <span id="save-status"></span>
            </div>
        </div>
        
        <!-- Preview -->
        <div class="bellano-card">
            <h2>👁️ תצוגה מקדימה</h2>
            <p class="description">כך הקטגוריות יוצגו בעמוד הבית (2 בשורה במובייל, 4 בשורה בדסקטופ)</p>
            <div id="preview-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 15px; max-width: 800px;">
                <!-- Will be populated by JS -->
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
        <script>
        jQuery(document).ready(function($) {
            // Initialize Sortable for both lists
            new Sortable(document.getElementById('available-list'), {
                group: 'categories',
                animation: 150,
                ghostClass: 'sortable-ghost'
            });
            
            new Sortable(document.getElementById('featured-list'), {
                group: 'categories',
                animation: 150,
                ghostClass: 'sortable-ghost',
                onAdd: function(evt) {
                    updatePreview();
                },
                onSort: function() {
                    updatePreview();
                },
                onRemove: function() {
                    updatePreview();
                }
            });
            
            function updatePreview() {
                var items = $('#featured-list .category-item');
                var preview = $('#preview-grid');
                preview.empty();
                
                items.each(function() {
                    var img = $(this).find('img').attr('src') || '';
                    var name = $(this).find('span').first().text();
                    
                    var bgStyle = img ? 
                        'background: linear-gradient(to top, rgba(0,0,0,0.7), transparent), url(' + img + ') center/cover;' : 
                        'background: linear-gradient(to top, rgba(0,0,0,0.7), #ccc);';
                    
                    preview.append(
                        '<div style="aspect-ratio: 3/4; ' + bgStyle + ' border-radius: 8px; display: flex; align-items: flex-end; padding: 10px;">' +
                        '<span style="color: white; font-weight: bold; font-size: 13px;">' + name + '</span>' +
                        '</div>'
                    );
                });
                
                if (items.length === 0) {
                    preview.html('<p style="grid-column: 1/-1; color: #999; text-align: center;">גררו קטגוריות לרשימה הנבחרת כדי לראות תצוגה מקדימה</p>');
                }
            }
            
            updatePreview();
            
            $('#save-featured-categories').on('click', function() {
                var button = $(this);
                var status = $('#save-status');
                
                button.prop('disabled', true).html('⏳ שומר...');
                
                var categories = [];
                $('#featured-list .category-item').each(function() {
                    categories.push($(this).data('id'));
                });
                
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'bellano_save_featured_categories',
                        nonce: '<?php echo wp_create_nonce('bellano_featured_categories'); ?>',
                        categories: categories
                    },
                    success: function(response) {
                        if (response.success) {
                            status.html('<span style="color: #4CAF50;">✓ ' + response.data + '</span>');
                        } else {
                            status.html('<span style="color: #f44336;">✗ ' + response.data + '</span>');
                        }
                        button.prop('disabled', false).html('💾 שמור קטגוריות');
                        setTimeout(function() { status.html(''); }, 3000);
                    },
                    error: function() {
                        status.html('<span style="color: #f44336;">✗ שגיאה בשמירה</span>');
                        button.prop('disabled', false).html('💾 שמור קטגוריות');
                    }
                });
            });
        });
        </script>
        
        <style>
            .sortable-ghost { opacity: 0.4; background: #c8ebfb !important; }
            .category-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important; }
        </style>
        <?php
    }
    
    private function render_styles() {
        ?>
        <style>
            .bellano-admin { max-width: 1200px; }
            .bellano-tabs { display: flex; gap: 0; margin: 20px 0; border-bottom: 2px solid #0073aa; flex-wrap: wrap; }
            .bellano-tabs a { 
                padding: 12px 24px; 
                text-decoration: none; 
                color: #333; 
                background: #f1f1f1;
                border: 1px solid #ccc;
                border-bottom: none;
                border-radius: 5px 5px 0 0;
                margin-left: -1px;
                font-weight: 500;
            }
            .bellano-tabs a.active { 
                background: #0073aa; 
                color: #fff; 
                border-color: #0073aa;
            }
            .bellano-tabs a:hover:not(.active) { background: #e0e0e0; }
            .bellano-card { 
                background: #fff; 
                padding: 20px; 
                margin: 15px 0; 
                border: 1px solid #ccc; 
                border-radius: 8px; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .bellano-card h2 { margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #eee; }
            .media-preview { max-width: 200px; margin-top: 10px; border-radius: 8px; }
            .quick-actions { display: flex; gap: 10px; flex-wrap: wrap; }
            .quick-actions button { padding: 10px 20px; }
        </style>
        <?php
    }
    
    /**
     * Render Category Icons Tab
     */
    public function render_category_icons_tab() {
        // Handle save
        if (isset($_POST['save_category_icons']) && check_admin_referer('bellano_category_icons')) {
            $icons = [];
            if (isset($_POST['icon_items']) && is_array($_POST['icon_items'])) {
                foreach ($_POST['icon_items'] as $item) {
                    if (!empty($item['name'])) {
                        $icons[] = [
                            'id' => intval($item['id'] ?? 0),
                            'name' => sanitize_text_field($item['name']),
                            'slug' => sanitize_title($item['slug']),
                            'icon_id' => intval($item['icon_id'] ?? 0),
                            'icon_url' => esc_url_raw($item['icon_url'] ?? ''),
                            'link' => sanitize_text_field($item['link'])
                        ];
                    }
                }
            }
            update_option('bellano_category_icons', $icons);
            echo '<div class="notice notice-success"><p>✅ האייקונים נשמרו בהצלחה!</p></div>';
        }
        
        $saved_icons = get_option('bellano_category_icons', []);
        if (empty($saved_icons)) {
            // Default items
            $saved_icons = [
                ['id' => 1, 'name' => 'פינות אוכל', 'slug' => 'dining-tables', 'icon_id' => 0, 'link' => '/category/dining-tables'],
                ['id' => 2, 'name' => 'קונסולות', 'slug' => 'consoles', 'icon_id' => 0, 'link' => '/category/consoles'],
                ['id' => 3, 'name' => 'ספריות', 'slug' => 'bookcases', 'icon_id' => 0, 'link' => '/category/bookcases'],
                ['id' => 4, 'name' => 'קומודות', 'slug' => 'dressers', 'icon_id' => 0, 'link' => '/category/dressers'],
                ['id' => 5, 'name' => 'NALLA SALE', 'slug' => 'sale', 'icon_id' => 0, 'link' => '/category/sale'],
                ['id' => 6, 'name' => 'שולחנות סלון', 'slug' => 'coffee-tables', 'icon_id' => 0, 'link' => '/category/coffee-tables'],
                ['id' => 7, 'name' => 'מזנונים', 'slug' => 'tv-stands', 'icon_id' => 0, 'link' => '/category/tv-stands'],
                ['id' => 8, 'name' => 'שולחנות משרד', 'slug' => 'office-desks', 'icon_id' => 0, 'link' => '/category/office-desks'],
            ];
        }
        ?>
        <div class="bellano-card">
            <h2>📁 אייקוני קטגוריות - קרוסלת הקטגוריות בהדר</h2>
            <p class="description">הגדר את האייקונים שיוצגו בקרוסלת הקטגוריות מתחת להדר</p>
            
            <form method="post">
                <?php wp_nonce_field('bellano_category_icons'); ?>
                
                <div id="category-icons-list" style="margin-top: 20px;">
                    <?php foreach ($saved_icons as $index => $item): ?>
                    <div class="icon-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                        <span class="handle" style="cursor: grab; color: #999;">☰</span>
                        
                        <input type="hidden" name="icon_items[<?php echo $index; ?>][id]" value="<?php echo esc_attr($item['id']); ?>">
                        
                        <!-- Icon Preview & Upload -->
                        <div class="icon-preview" style="width: 60px; height: 60px; background: #e8f0e6; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;" onclick="selectIcon(this, <?php echo $index; ?>)">
                            <?php 
                            $icon_url = '';
                            if (!empty($item['icon_id'])) {
                                $icon_url = wp_get_attachment_image_url($item['icon_id'], 'thumbnail');
                            } elseif (!empty($item['icon_url'])) {
                                $icon_url = $item['icon_url'];
                            }
                            if ($icon_url): ?>
                                <img src="<?php echo esc_url($icon_url); ?>" style="width: 100%; height: 100%; object-fit: contain;">
                            <?php else: ?>
                                <span style="color: #999; font-size: 24px;">📷</span>
                            <?php endif; ?>
                        </div>
                        <input type="hidden" name="icon_items[<?php echo $index; ?>][icon_id]" class="icon-id-input" value="<?php echo esc_attr($item['icon_id'] ?? ''); ?>">
                        <input type="hidden" name="icon_items[<?php echo $index; ?>][icon_url]" class="icon-url-input" value="<?php echo esc_attr($item['icon_url'] ?? ''); ?>">
                        
                        <!-- Name -->
                        <div style="flex: 1;">
                            <label style="font-size: 11px; color: #666;">שם</label>
                            <input type="text" name="icon_items[<?php echo $index; ?>][name]" value="<?php echo esc_attr($item['name']); ?>" style="width: 100%;" placeholder="שם הקטגוריה">
                        </div>
                        
                        <!-- Slug -->
                        <div style="width: 150px;">
                            <label style="font-size: 11px; color: #666;">סלאג</label>
                            <input type="text" name="icon_items[<?php echo $index; ?>][slug]" value="<?php echo esc_attr($item['slug']); ?>" style="width: 100%;" placeholder="slug">
                        </div>
                        
                        <!-- Link -->
                        <div style="flex: 1;">
                            <label style="font-size: 11px; color: #666;">קישור</label>
                            <input type="text" name="icon_items[<?php echo $index; ?>][link]" value="<?php echo esc_attr($item['link']); ?>" style="width: 100%;" placeholder="/category/slug">
                        </div>
                        
                        <!-- Remove Button -->
                        <button type="button" onclick="removeIconItem(this)" class="button" style="color: red;">✕</button>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <div style="margin-top: 15px;">
                    <button type="button" onclick="addIconItem()" class="button">➕ הוסף פריט</button>
                </div>
                
                <div style="margin-top: 20px;">
                    <button type="submit" name="save_category_icons" class="button button-primary">💾 שמור אייקונים</button>
                </div>
            </form>
        </div>
        
        <script>
        var iconItemIndex = <?php echo count($saved_icons); ?>;
        
        function selectIcon(previewEl, index) {
            var frame = wp.media({
                title: 'בחר אייקון',
                button: { text: 'בחר' },
                multiple: false,
                library: { type: 'image' }
            });
            
            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                var container = previewEl.closest('.icon-item');
                container.querySelector('.icon-id-input').value = attachment.id;
                container.querySelector('.icon-url-input').value = attachment.url;
                previewEl.innerHTML = '<img src="' + attachment.url + '" style="width: 100%; height: 100%; object-fit: contain;">';
            });
            
            frame.open();
        }
        
        function addIconItem() {
            var container = document.getElementById('category-icons-list');
            var html = `
                <div class="icon-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                    <span class="handle" style="cursor: grab; color: #999;">☰</span>
                    <input type="hidden" name="icon_items[${iconItemIndex}][id]" value="${iconItemIndex + 1}">
                    <div class="icon-preview" style="width: 60px; height: 60px; background: #e8f0e6; border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;" onclick="selectIcon(this, ${iconItemIndex})">
                        <span style="color: #999; font-size: 24px;">📷</span>
                    </div>
                    <input type="hidden" name="icon_items[${iconItemIndex}][icon_id]" class="icon-id-input" value="">
                    <input type="hidden" name="icon_items[${iconItemIndex}][icon_url]" class="icon-url-input" value="">
                    <div style="flex: 1;">
                        <label style="font-size: 11px; color: #666;">שם</label>
                        <input type="text" name="icon_items[${iconItemIndex}][name]" value="" style="width: 100%;" placeholder="שם הקטגוריה">
                    </div>
                    <div style="width: 150px;">
                        <label style="font-size: 11px; color: #666;">סלאג</label>
                        <input type="text" name="icon_items[${iconItemIndex}][slug]" value="" style="width: 100%;" placeholder="slug">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 11px; color: #666;">קישור</label>
                        <input type="text" name="icon_items[${iconItemIndex}][link]" value="" style="width: 100%;" placeholder="/category/slug">
                    </div>
                    <button type="button" onclick="removeIconItem(this)" class="button" style="color: red;">✕</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            iconItemIndex++;
        }
        
        function removeIconItem(btn) {
            if (confirm('האם אתה בטוח?')) {
                btn.closest('.icon-item').remove();
            }
        }
        </script>
        <?php
    }

    /**
     * Render Mega Menu Tab
     */
    public function render_mega_menu_tab() {
        // Handle save
        if (isset($_POST['save_mega_menu']) && check_admin_referer('bellano_mega_menu')) {
            $menus = [];
            
            // Save Living Spaces menu
            if (isset($_POST['living_spaces']) && is_array($_POST['living_spaces'])) {
                $items = [];
                foreach ($_POST['living_spaces'] as $item) {
                    if (!empty($item['name'])) {
                        $items[] = [
                            'name' => sanitize_text_field($item['name']),
                            'description' => sanitize_text_field($item['description'] ?? ''),
                            'link' => sanitize_text_field($item['link']),
                            'icon_id' => intval($item['icon_id'] ?? 0),
                            'icon_url' => esc_url_raw($item['icon_url'] ?? ''),
                        ];
                    }
                }
                $menus['living_spaces'] = $items;
            }
            
            // Save featured sections
            if (isset($_POST['featured_sections']) && is_array($_POST['featured_sections'])) {
                $sections = [];
                foreach ($_POST['featured_sections'] as $section) {
                    if (!empty($section['title'])) {
                        $sections[] = [
                            'title' => sanitize_text_field($section['title']),
                            'link' => sanitize_text_field($section['link']),
                            'image_id' => intval($section['image_id'] ?? 0),
                            'image_url' => esc_url_raw($section['image_url'] ?? ''),
                            'bg_color' => sanitize_hex_color($section['bg_color'] ?? '#f5f5f5'),
                        ];
                    }
                }
                $menus['featured_sections'] = $sections;
            }
            
            update_option('bellano_mega_menus', $menus);
            echo '<div class="notice notice-success"><p>✅ המגה מניו נשמר בהצלחה!</p></div>';
        }
        
        $saved_menus = get_option('bellano_mega_menus', []);
        $living_spaces = $saved_menus['living_spaces'] ?? [
            ['name' => 'סלון', 'description' => 'מזנונים, ספריות ושולחנות סלון', 'link' => '/product-tag/living-room', 'icon_id' => 0],
            ['name' => 'פינת אוכל', 'description' => 'שולחנות, כסאות וריהוט לפינת אוכל', 'link' => '/product-tag/dining-room', 'icon_id' => 0],
            ['name' => 'חדר שינה', 'description' => 'מיטות, שידות וארונות', 'link' => '/product-tag/bedroom', 'icon_id' => 0],
            ['name' => 'חדר עבודה', 'description' => 'שולחנות עבודה וריהוט למשרד', 'link' => '/product-tag/office', 'icon_id' => 0],
            ['name' => 'כניסה למבואה', 'description' => 'קונסולות ופתרונות אחסון', 'link' => '/product-tag/entrance', 'icon_id' => 0],
        ];
        $featured_sections = $saved_menus['featured_sections'] ?? [
            ['title' => 'הטרנדים החמים', 'link' => '/product-tag/trends', 'image_id' => 0, 'bg_color' => '#f5ebe0'],
            ['title' => 'מבצעים', 'link' => '/category/sale', 'image_id' => 0, 'bg_color' => '#fef3c7'],
        ];
        ?>
        <div class="bellano-card">
            <h2>📋 מגה מניו - חללי מגורים</h2>
            <p class="description">הגדר את הפריטים שיוצגו בתפריט הנפתח "חללי מגורים" בהדר</p>
            
            <form method="post">
                <?php wp_nonce_field('bellano_mega_menu'); ?>
                
                <h3 style="margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">🏠 קטגוריות חללים</h3>
                <div id="living-spaces-list" style="margin-top: 15px;">
                    <?php foreach ($living_spaces as $index => $item): ?>
                    <div class="menu-item" style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                        <span class="handle" style="cursor: grab; color: #999; padding-top: 8px;">☰</span>
                        
                        <!-- Icon -->
                        <div class="icon-preview" style="width: 50px; height: 50px; background: #e8f0e6; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; flex-shrink: 0;" onclick="selectMegaMenuIcon(this, 'living_spaces', <?php echo $index; ?>)">
                            <?php 
                            $icon_url = '';
                            if (!empty($item['icon_id'])) {
                                $icon_url = wp_get_attachment_image_url($item['icon_id'], 'thumbnail');
                            } elseif (!empty($item['icon_url'])) {
                                $icon_url = $item['icon_url'];
                            }
                            if ($icon_url): ?>
                                <img src="<?php echo esc_url($icon_url); ?>" style="width: 100%; height: 100%; object-fit: contain;">
                            <?php else: ?>
                                <span style="color: #999; font-size: 20px;">🖼️</span>
                            <?php endif; ?>
                        </div>
                        <input type="hidden" name="living_spaces[<?php echo $index; ?>][icon_id]" class="icon-id-input" value="<?php echo esc_attr($item['icon_id'] ?? ''); ?>">
                        <input type="hidden" name="living_spaces[<?php echo $index; ?>][icon_url]" class="icon-url-input" value="<?php echo esc_attr($item['icon_url'] ?? ''); ?>">
                        
                        <!-- Name -->
                        <div style="width: 150px;">
                            <label style="font-size: 11px; color: #666;">שם</label>
                            <input type="text" name="living_spaces[<?php echo $index; ?>][name]" value="<?php echo esc_attr($item['name']); ?>" style="width: 100%;" placeholder="שם הקטגוריה">
                        </div>
                        
                        <!-- Description -->
                        <div style="flex: 1; min-width: 200px;">
                            <label style="font-size: 11px; color: #666;">תיאור</label>
                            <input type="text" name="living_spaces[<?php echo $index; ?>][description]" value="<?php echo esc_attr($item['description'] ?? ''); ?>" style="width: 100%;" placeholder="תיאור קצר">
                        </div>
                        
                        <!-- Link -->
                        <div style="width: 200px;">
                            <label style="font-size: 11px; color: #666;">קישור</label>
                            <input type="text" name="living_spaces[<?php echo $index; ?>][link]" value="<?php echo esc_attr($item['link']); ?>" style="width: 100%;" placeholder="/product-tag/slug">
                        </div>
                        
                        <!-- Remove -->
                        <button type="button" onclick="removeMegaMenuItem(this)" class="button" style="color: red; flex-shrink: 0;">✕</button>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <button type="button" onclick="addLivingSpaceItem()" class="button" style="margin-top: 10px;">➕ הוסף חלל</button>
                
                <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">⭐ סקציות מיוחדות</h3>
                <p class="description">באנרים קטנים שיוצגו בצד ימין של המגה מניו</p>
                <div id="featured-sections-list" style="margin-top: 15px;">
                    <?php foreach ($featured_sections as $index => $section): ?>
                    <div class="featured-item" style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #fff9e6; border-radius: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                        <!-- Image -->
                        <div class="image-preview" style="width: 80px; height: 60px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; flex-shrink: 0;" onclick="selectMegaMenuImage(this, <?php echo $index; ?>)">
                            <?php 
                            $image_url = '';
                            if (!empty($section['image_id'])) {
                                $image_url = wp_get_attachment_image_url($section['image_id'], 'thumbnail');
                            } elseif (!empty($section['image_url'])) {
                                $image_url = $section['image_url'];
                            }
                            if ($image_url): ?>
                                <img src="<?php echo esc_url($image_url); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                            <?php else: ?>
                                <span style="color: #999; font-size: 20px;">🖼️</span>
                            <?php endif; ?>
                        </div>
                        <input type="hidden" name="featured_sections[<?php echo $index; ?>][image_id]" class="image-id-input" value="<?php echo esc_attr($section['image_id'] ?? ''); ?>">
                        <input type="hidden" name="featured_sections[<?php echo $index; ?>][image_url]" class="image-url-input" value="<?php echo esc_attr($section['image_url'] ?? ''); ?>">
                        
                        <!-- Title -->
                        <div style="width: 150px;">
                            <label style="font-size: 11px; color: #666;">כותרת</label>
                            <input type="text" name="featured_sections[<?php echo $index; ?>][title]" value="<?php echo esc_attr($section['title']); ?>" style="width: 100%;" placeholder="כותרת">
                        </div>
                        
                        <!-- Link -->
                        <div style="flex: 1; min-width: 150px;">
                            <label style="font-size: 11px; color: #666;">קישור</label>
                            <input type="text" name="featured_sections[<?php echo $index; ?>][link]" value="<?php echo esc_attr($section['link']); ?>" style="width: 100%;" placeholder="/category/sale">
                        </div>
                        
                        <!-- BG Color -->
                        <div style="width: 100px;">
                            <label style="font-size: 11px; color: #666;">צבע רקע</label>
                            <input type="color" name="featured_sections[<?php echo $index; ?>][bg_color]" value="<?php echo esc_attr($section['bg_color'] ?? '#f5f5f5'); ?>" style="width: 100%; height: 32px; padding: 2px;">
                        </div>
                        
                        <!-- Remove -->
                        <button type="button" onclick="removeMegaMenuItem(this)" class="button" style="color: red; flex-shrink: 0;">✕</button>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <button type="button" onclick="addFeaturedSection()" class="button" style="margin-top: 10px;">➕ הוסף סקציה</button>
                
                <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #ddd;">
                    <button type="submit" name="save_mega_menu" class="button button-primary button-large">💾 שמור מגה מניו</button>
                </div>
            </form>
        </div>
        
        <script>
        var livingSpaceIndex = <?php echo count($living_spaces); ?>;
        var featuredSectionIndex = <?php echo count($featured_sections); ?>;
        
        function selectMegaMenuIcon(previewEl, type, index) {
            var frame = wp.media({
                title: 'בחר אייקון',
                button: { text: 'בחר' },
                multiple: false,
                library: { type: 'image' }
            });
            
            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                var container = previewEl.closest('.menu-item');
                container.querySelector('.icon-id-input').value = attachment.id;
                container.querySelector('.icon-url-input').value = attachment.url;
                previewEl.innerHTML = '<img src="' + attachment.url + '" style="width: 100%; height: 100%; object-fit: contain;">';
            });
            
            frame.open();
        }
        
        function selectMegaMenuImage(previewEl, index) {
            var frame = wp.media({
                title: 'בחר תמונה',
                button: { text: 'בחר' },
                multiple: false,
                library: { type: 'image' }
            });
            
            frame.on('select', function() {
                var attachment = frame.state().get('selection').first().toJSON();
                var container = previewEl.closest('.featured-item');
                container.querySelector('.image-id-input').value = attachment.id;
                container.querySelector('.image-url-input').value = attachment.url;
                previewEl.innerHTML = '<img src="' + attachment.url + '" style="width: 100%; height: 100%; object-fit: cover;">';
            });
            
            frame.open();
        }
        
        function addLivingSpaceItem() {
            var container = document.getElementById('living-spaces-list');
            var html = `
                <div class="menu-item" style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                    <span class="handle" style="cursor: grab; color: #999; padding-top: 8px;">☰</span>
                    <div class="icon-preview" style="width: 50px; height: 50px; background: #e8f0e6; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; flex-shrink: 0;" onclick="selectMegaMenuIcon(this, 'living_spaces', ${livingSpaceIndex})">
                        <span style="color: #999; font-size: 20px;">🖼️</span>
                    </div>
                    <input type="hidden" name="living_spaces[${livingSpaceIndex}][icon_id]" class="icon-id-input" value="">
                    <input type="hidden" name="living_spaces[${livingSpaceIndex}][icon_url]" class="icon-url-input" value="">
                    <div style="width: 150px;">
                        <label style="font-size: 11px; color: #666;">שם</label>
                        <input type="text" name="living_spaces[${livingSpaceIndex}][name]" value="" style="width: 100%;" placeholder="שם הקטגוריה">
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <label style="font-size: 11px; color: #666;">תיאור</label>
                        <input type="text" name="living_spaces[${livingSpaceIndex}][description]" value="" style="width: 100%;" placeholder="תיאור קצר">
                    </div>
                    <div style="width: 200px;">
                        <label style="font-size: 11px; color: #666;">קישור</label>
                        <input type="text" name="living_spaces[${livingSpaceIndex}][link]" value="" style="width: 100%;" placeholder="/product-tag/slug">
                    </div>
                    <button type="button" onclick="removeMegaMenuItem(this)" class="button" style="color: red; flex-shrink: 0;">✕</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            livingSpaceIndex++;
        }
        
        function addFeaturedSection() {
            var container = document.getElementById('featured-sections-list');
            var html = `
                <div class="featured-item" style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #fff9e6; border-radius: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                    <div class="image-preview" style="width: 80px; height: 60px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; flex-shrink: 0;" onclick="selectMegaMenuImage(this, ${featuredSectionIndex})">
                        <span style="color: #999; font-size: 20px;">🖼️</span>
                    </div>
                    <input type="hidden" name="featured_sections[${featuredSectionIndex}][image_id]" class="image-id-input" value="">
                    <input type="hidden" name="featured_sections[${featuredSectionIndex}][image_url]" class="image-url-input" value="">
                    <div style="width: 150px;">
                        <label style="font-size: 11px; color: #666;">כותרת</label>
                        <input type="text" name="featured_sections[${featuredSectionIndex}][title]" value="" style="width: 100%;" placeholder="כותרת">
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label style="font-size: 11px; color: #666;">קישור</label>
                        <input type="text" name="featured_sections[${featuredSectionIndex}][link]" value="" style="width: 100%;" placeholder="/category/sale">
                    </div>
                    <div style="width: 100px;">
                        <label style="font-size: 11px; color: #666;">צבע רקע</label>
                        <input type="color" name="featured_sections[${featuredSectionIndex}][bg_color]" value="#f5f5f5" style="width: 100%; height: 32px; padding: 2px;">
                    </div>
                    <button type="button" onclick="removeMegaMenuItem(this)" class="button" style="color: red; flex-shrink: 0;">✕</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            featuredSectionIndex++;
        }
        
        function removeMegaMenuItem(btn) {
            if (confirm('האם אתה בטוח?')) {
                btn.closest('.menu-item, .featured-item').remove();
            }
        }
        </script>
        <?php
    }

    /**
     * Render Navigation Tab - Header Menu
     */
    public function render_navigation_tab() {
        // Handle save
        if (isset($_POST['save_navigation']) && check_admin_referer('bellano_navigation')) {
            $nav_items = [];
            if (isset($_POST['nav_items']) && is_array($_POST['nav_items'])) {
                foreach ($_POST['nav_items'] as $item) {
                    if (!empty($item['name'])) {
                        $nav_items[] = [
                            'name' => sanitize_text_field($item['name']),
                            'link' => sanitize_text_field($item['link']),
                            'highlight' => isset($item['highlight']) ? true : false,
                            'has_mega_menu' => isset($item['has_mega_menu']) ? true : false,
                        ];
                    }
                }
            }
            update_option('bellano_navigation', $nav_items);
            echo '<div class="notice notice-success"><p>✅ התפריט נשמר בהצלחה!</p></div>';
        }
        
        $saved_nav = get_option('bellano_navigation', []);
        if (empty($saved_nav)) {
            // Default navigation items
            $saved_nav = [
                ['name' => 'בית', 'link' => '/', 'highlight' => false, 'has_mega_menu' => false],
                ['name' => 'NALLA SALE', 'link' => '/category/sale', 'highlight' => true, 'has_mega_menu' => false],
                ['name' => 'חללי מגורים', 'link' => '#', 'highlight' => false, 'has_mega_menu' => true],
                ['name' => 'SHOWROOM', 'link' => '/showroom', 'highlight' => false, 'has_mega_menu' => false],
                ['name' => 'בלוג', 'link' => '/blog', 'highlight' => false, 'has_mega_menu' => false],
                ['name' => 'יצירת קשר', 'link' => '/contact', 'highlight' => false, 'has_mega_menu' => false],
                ['name' => 'צביעה בתנור', 'link' => '/tambour-color', 'highlight' => false, 'has_mega_menu' => false],
            ];
        }
        ?>
        <div class="bellano-card">
            <h2>🧭 תפריט ראשי - Header</h2>
            <p class="description">הגדר את פריטי התפריט שיופיעו בהדר האתר</p>
            
            <form method="post">
                <?php wp_nonce_field('bellano_navigation'); ?>
                
                <div id="nav-items-list" style="margin-top: 20px;">
                    <?php foreach ($saved_nav as $index => $item): ?>
                    <div class="nav-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                        <span class="handle" style="cursor: grab; color: #999;">☰</span>
                        
                        <!-- Name -->
                        <div style="width: 150px;">
                            <label style="font-size: 11px; color: #666;">שם</label>
                            <input type="text" name="nav_items[<?php echo $index; ?>][name]" value="<?php echo esc_attr($item['name']); ?>" style="width: 100%;" placeholder="שם הקישור">
                        </div>
                        
                        <!-- Link -->
                        <div style="flex: 1;">
                            <label style="font-size: 11px; color: #666;">קישור</label>
                            <input type="text" name="nav_items[<?php echo $index; ?>][link]" value="<?php echo esc_attr($item['link']); ?>" style="width: 100%;" placeholder="/page">
                        </div>
                        
                        <!-- Highlight -->
                        <div style="text-align: center;">
                            <label style="font-size: 11px; color: #666; display: block;">מודגש</label>
                            <input type="checkbox" name="nav_items[<?php echo $index; ?>][highlight]" <?php checked($item['highlight'] ?? false); ?>>
                        </div>
                        
                        <!-- Has Mega Menu -->
                        <div style="text-align: center;">
                            <label style="font-size: 11px; color: #666; display: block;">מגה מניו</label>
                            <input type="checkbox" name="nav_items[<?php echo $index; ?>][has_mega_menu]" <?php checked($item['has_mega_menu'] ?? false); ?>>
                        </div>
                        
                        <!-- Remove -->
                        <button type="button" onclick="removeNavItem(this)" class="button" style="color: red;">✕</button>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <button type="button" onclick="addNavItem()" class="button" style="margin-top: 10px;">➕ הוסף פריט</button>
                
                <div style="margin-top: 20px;">
                    <button type="submit" name="save_navigation" class="button button-primary">💾 שמור תפריט</button>
                </div>
            </form>
        </div>
        
        <script>
        var navItemIndex = <?php echo count($saved_nav); ?>;
        
        function addNavItem() {
            var container = document.getElementById('nav-items-list');
            var html = `
                <div class="nav-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;">
                    <span class="handle" style="cursor: grab; color: #999;">☰</span>
                    <div style="width: 150px;">
                        <label style="font-size: 11px; color: #666;">שם</label>
                        <input type="text" name="nav_items[${navItemIndex}][name]" value="" style="width: 100%;" placeholder="שם הקישור">
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size: 11px; color: #666;">קישור</label>
                        <input type="text" name="nav_items[${navItemIndex}][link]" value="" style="width: 100%;" placeholder="/page">
                    </div>
                    <div style="text-align: center;">
                        <label style="font-size: 11px; color: #666; display: block;">מודגש</label>
                        <input type="checkbox" name="nav_items[${navItemIndex}][highlight]">
                    </div>
                    <div style="text-align: center;">
                        <label style="font-size: 11px; color: #666; display: block;">מגה מניו</label>
                        <input type="checkbox" name="nav_items[${navItemIndex}][has_mega_menu]">
                    </div>
                    <button type="button" onclick="removeNavItem(this)" class="button" style="color: red;">✕</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            navItemIndex++;
        }
        
        function removeNavItem(btn) {
            if (confirm('האם אתה בטוח?')) {
                btn.closest('.nav-item').remove();
            }
        }
        </script>
        <?php
    }

    /**
     * Render Footer Tab
     */
    public function render_footer_tab() {
        // Handle save
        if (isset($_POST['save_footer']) && check_admin_referer('bellano_footer')) {
            $footer = [];
            
            // Contact info
            $footer['contact'] = [
                'phone' => sanitize_text_field($_POST['phone'] ?? ''),
                'address' => sanitize_text_field($_POST['address'] ?? ''),
                'facebook' => esc_url_raw($_POST['facebook'] ?? ''),
                'instagram' => esc_url_raw($_POST['instagram'] ?? ''),
            ];
            
            // Hours
            $footer['hours'] = [
                'showroom_title' => sanitize_text_field($_POST['showroom_title'] ?? ''),
                'showroom_weekdays' => sanitize_text_field($_POST['showroom_weekdays'] ?? ''),
                'showroom_friday' => sanitize_text_field($_POST['showroom_friday'] ?? ''),
                'service_title' => sanitize_text_field($_POST['service_title'] ?? ''),
                'service_hours' => sanitize_text_field($_POST['service_hours'] ?? ''),
            ];
            
            // Links Column 1
            if (isset($_POST['links_col1']) && is_array($_POST['links_col1'])) {
                foreach ($_POST['links_col1'] as $link) {
                    if (!empty($link['name'])) {
                        $footer['links_col1'][] = [
                            'name' => sanitize_text_field($link['name']),
                            'href' => sanitize_text_field($link['href']),
                        ];
                    }
                }
            }
            
            // Links Column 2
            if (isset($_POST['links_col2']) && is_array($_POST['links_col2'])) {
                foreach ($_POST['links_col2'] as $link) {
                    if (!empty($link['name'])) {
                        $footer['links_col2'][] = [
                            'name' => sanitize_text_field($link['name']),
                            'href' => sanitize_text_field($link['href']),
                        ];
                    }
                }
            }
            
            update_option('bellano_footer', $footer);
            echo '<div class="notice notice-success"><p>✅ הפוטר נשמר בהצלחה!</p></div>';
        }
        
        $saved_footer = get_option('bellano_footer', []);
        $contact = $saved_footer['contact'] ?? [
            'phone' => '03-3732350',
            'address' => 'אברהם בומה שביט 1 ראשון לציון, מחסן F-101',
            'facebook' => 'https://facebook.com/nalla',
            'instagram' => 'https://instagram.com/nalla',
        ];
        $hours = $saved_footer['hours'] ?? [
            'showroom_title' => 'Show-room ומוקד מכירות',
            'showroom_weekdays' => 'ימים א-ה: 10:00 - 20:00',
            'showroom_friday' => 'שישי: 10:00 - 14:00',
            'service_title' => 'שירות לקוחות',
            'service_hours' => 'ימים א-ה: 10:00 - 16:00',
        ];
        $links_col1 = $saved_footer['links_col1'] ?? [
            ['name' => 'אודות', 'href' => '/about'],
            ['name' => 'אחריות המוצרים', 'href' => '/page/warranty'],
            ['name' => 'בלוג', 'href' => '/blog'],
            ['name' => 'יצירת קשר', 'href' => '/contact'],
        ];
        $links_col2 = $saved_footer['links_col2'] ?? [
            ['name' => 'תקנון האתר', 'href' => '/page/terms'],
            ['name' => 'תקנון משלוחים', 'href' => '/page/shipping'],
            ['name' => 'הצהרת נגישות', 'href' => '/accessibility'],
            ['name' => 'מדיניות פרטיות', 'href' => '/page/privacy-policy'],
        ];
        ?>
        <div class="bellano-card">
            <h2>📝 הגדרות פוטר</h2>
            <p class="description">הגדר את פרטי הקשר, שעות הפעילות והקישורים בפוטר</p>
            
            <form method="post">
                <?php wp_nonce_field('bellano_footer'); ?>
                
                <h3 style="margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">📞 פרטי קשר</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                    <div>
                        <label style="font-size: 12px; color: #666;">טלפון</label>
                        <input type="text" name="phone" value="<?php echo esc_attr($contact['phone']); ?>" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">כתובת</label>
                        <input type="text" name="address" value="<?php echo esc_attr($contact['address']); ?>" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">Facebook URL</label>
                        <input type="url" name="facebook" value="<?php echo esc_attr($contact['facebook']); ?>" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">Instagram URL</label>
                        <input type="url" name="instagram" value="<?php echo esc_attr($contact['instagram']); ?>" style="width: 100%;">
                    </div>
                </div>
                
                <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">🕐 שעות פעילות</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                    <div>
                        <label style="font-size: 12px; color: #666;">כותרת שואורום</label>
                        <input type="text" name="showroom_title" value="<?php echo esc_attr($hours['showroom_title']); ?>" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">כותרת שירות לקוחות</label>
                        <input type="text" name="service_title" value="<?php echo esc_attr($hours['service_title']); ?>" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">שואורום - ימים א-ה</label>
                        <input type="text" name="showroom_weekdays" value="<?php echo esc_attr($hours['showroom_weekdays']); ?>" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">שירות לקוחות - שעות</label>
                        <input type="text" name="service_hours" value="<?php echo esc_attr($hours['service_hours']); ?>" style="width: 100%;">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">שואורום - שישי</label>
                        <input type="text" name="showroom_friday" value="<?php echo esc_attr($hours['showroom_friday']); ?>" style="width: 100%;">
                    </div>
                </div>
                
                <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">🔗 קישורים - עמודה 1</h3>
                <div id="links-col1-list" style="margin-top: 15px;">
                    <?php foreach ($links_col1 as $index => $link): ?>
                    <div class="link-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <input type="text" name="links_col1[<?php echo $index; ?>][name]" value="<?php echo esc_attr($link['name']); ?>" style="width: 150px;" placeholder="שם">
                        <input type="text" name="links_col1[<?php echo $index; ?>][href]" value="<?php echo esc_attr($link['href']); ?>" style="flex: 1;" placeholder="/page">
                        <button type="button" onclick="this.closest('.link-item').remove()" class="button" style="color: red;">✕</button>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" onclick="addLinkCol1()" class="button" style="margin-top: 5px;">➕ הוסף קישור</button>
                
                <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">🔗 קישורים - עמודה 2</h3>
                <div id="links-col2-list" style="margin-top: 15px;">
                    <?php foreach ($links_col2 as $index => $link): ?>
                    <div class="link-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <input type="text" name="links_col2[<?php echo $index; ?>][name]" value="<?php echo esc_attr($link['name']); ?>" style="width: 150px;" placeholder="שם">
                        <input type="text" name="links_col2[<?php echo $index; ?>][href]" value="<?php echo esc_attr($link['href']); ?>" style="flex: 1;" placeholder="/page">
                        <button type="button" onclick="this.closest('.link-item').remove()" class="button" style="color: red;">✕</button>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" onclick="addLinkCol2()" class="button" style="margin-top: 5px;">➕ הוסף קישור</button>
                
                <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #ddd;">
                    <button type="submit" name="save_footer" class="button button-primary button-large">💾 שמור פוטר</button>
                </div>
            </form>
        </div>
        
        <script>
        var linkCol1Index = <?php echo count($links_col1); ?>;
        var linkCol2Index = <?php echo count($links_col2); ?>;
        
        function addLinkCol1() {
            var container = document.getElementById('links-col1-list');
            var html = `
                <div class="link-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <input type="text" name="links_col1[${linkCol1Index}][name]" value="" style="width: 150px;" placeholder="שם">
                    <input type="text" name="links_col1[${linkCol1Index}][href]" value="" style="flex: 1;" placeholder="/page">
                    <button type="button" onclick="this.closest('.link-item').remove()" class="button" style="color: red;">✕</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            linkCol1Index++;
        }
        
        function addLinkCol2() {
            var container = document.getElementById('links-col2-list');
            var html = `
                <div class="link-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <input type="text" name="links_col2[${linkCol2Index}][name]" value="" style="width: 150px;" placeholder="שם">
                    <input type="text" name="links_col2[${linkCol2Index}][href]" value="" style="flex: 1;" placeholder="/page">
                    <button type="button" onclick="this.closest('.link-item').remove()" class="button" style="color: red;">✕</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            linkCol2Index++;
        }
        </script>
        <?php
    }
    
    /**
     * Render Announcements Tab
     */
    public function render_announcements_tab() {
        // Handle save
        if (isset($_POST['save_announcements'])) {
            check_admin_referer('bellano_announcements_nonce');
            
            $announcements = array();
            if (isset($_POST['announcements']) && is_array($_POST['announcements'])) {
                foreach ($_POST['announcements'] as $item) {
                    if (!empty($item['text'])) {
                        $announcements[] = array(
                            'text' => sanitize_text_field($item['text']),
                            'link' => sanitize_text_field($item['link'] ?? ''),
                            'bg_color' => sanitize_hex_color($item['bg_color'] ?? '#e1eadf'),
                            'text_color' => sanitize_hex_color($item['text_color'] ?? '#4a7c59'),
                        );
                    }
                }
            }
            
            $settings = array(
                'enabled' => isset($_POST['enabled']) ? true : false,
                'interval' => absint($_POST['interval'] ?? 5000),
                'announcements' => $announcements,
            );
            
            update_option('bellano_announcements', $settings);
            echo '<div class="notice notice-success"><p>✅ ההודעות נשמרו בהצלחה!</p></div>';
        }
        
        // Get saved settings
        $settings = get_option('bellano_announcements', array(
            'enabled' => true,
            'interval' => 5000,
            'announcements' => array(
                array(
                    'text' => 'מגוון מוצרים בהנחות ענק בקטגוריית NALLA SALE בין 20% ל-50% הנחה!',
                    'link' => '/category/nalla-sale',
                    'bg_color' => '#e1eadf',
                    'text_color' => '#4a7c59',
                ),
            ),
        ));
        
        $enabled = $settings['enabled'] ?? true;
        $interval = $settings['interval'] ?? 5000;
        $announcements = $settings['announcements'] ?? array();
        
        if (empty($announcements)) {
            $announcements = array(
                array('text' => '', 'link' => '', 'bg_color' => '#e1eadf', 'text_color' => '#4a7c59')
            );
        }
        ?>
        <div class="bellano-card">
            <h2>📢 הודעות עליונות</h2>
            <p class="description">הגדירו הודעות שיופיעו בחלק העליון של האתר. ניתן להוסיף מספר הודעות שיתחלפו אוטומטית.</p>
            
            <form method="post">
                <?php wp_nonce_field('bellano_announcements_nonce'); ?>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" name="enabled" <?php checked($enabled); ?>>
                        <strong>הפעל הודעות עליונות</strong>
                    </label>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;"><strong>⏱️ זמן בין הודעות (מילישניות)</strong></label>
                    <input type="number" name="interval" value="<?php echo esc_attr($interval); ?>" min="1000" step="500" style="width: 120px;">
                    <span style="color: #666; margin-right: 10px;">(5000 = 5 שניות)</span>
                </div>
                
                <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">📝 רשימת הודעות</h3>
                <div id="announcements-list" style="margin-top: 15px;">
                    <?php foreach ($announcements as $index => $announcement): ?>
                    <div class="announcement-item" style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #ddd;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="cursor: move; font-size: 18px;">⋮⋮</span>
                            <strong>הודעה <?php echo $index + 1; ?></strong>
                            <button type="button" onclick="this.closest('.announcement-item').remove()" class="button" style="color: red; margin-right: auto;">🗑️ מחק</button>
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px;">טקסט ההודעה</label>
                            <input type="text" name="announcements[<?php echo $index; ?>][text]" value="<?php echo esc_attr($announcement['text']); ?>" style="width: 100%;" placeholder="הקלד את ההודעה כאן...">
                        </div>
                        
                        <div style="display: flex; gap: 15px;">
                            <div style="flex: 1;">
                                <label style="display: block; margin-bottom: 5px;">קישור (אופציונלי)</label>
                                <input type="text" name="announcements[<?php echo $index; ?>][link]" value="<?php echo esc_attr($announcement['link'] ?? ''); ?>" placeholder="/category/sale">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px;">צבע רקע</label>
                                <input type="color" name="announcements[<?php echo $index; ?>][bg_color]" value="<?php echo esc_attr($announcement['bg_color'] ?? '#e1eadf'); ?>">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px;">צבע טקסט</label>
                                <input type="color" name="announcements[<?php echo $index; ?>][text_color]" value="<?php echo esc_attr($announcement['text_color'] ?? '#4a7c59'); ?>">
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <button type="button" onclick="addAnnouncement()" class="button" style="margin-top: 10px;">➕ הוסף הודעה</button>
                
                <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #ddd;">
                    <button type="submit" name="save_announcements" class="button button-primary button-large">💾 שמור הודעות</button>
                </div>
            </form>
        </div>
        
        <script>
        var announcementIndex = <?php echo count($announcements); ?>;
        
        function addAnnouncement() {
            var container = document.getElementById('announcements-list');
            var html = `
                <div class="announcement-item" style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #ddd;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <span style="cursor: move; font-size: 18px;">⋮⋮</span>
                        <strong>הודעה חדשה</strong>
                        <button type="button" onclick="this.closest('.announcement-item').remove()" class="button" style="color: red; margin-right: auto;">🗑️ מחק</button>
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">טקסט ההודעה</label>
                        <input type="text" name="announcements[${announcementIndex}][text]" value="" style="width: 100%;" placeholder="הקלד את ההודעה כאן...">
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="display: block; margin-bottom: 5px;">קישור (אופציונלי)</label>
                            <input type="text" name="announcements[${announcementIndex}][link]" value="" placeholder="/category/sale">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">צבע רקע</label>
                            <input type="color" name="announcements[${announcementIndex}][bg_color]" value="#e1eadf">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">צבע טקסט</label>
                            <input type="color" name="announcements[${announcementIndex}][text_color]" value="#4a7c59">
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            announcementIndex++;
        }
        </script>
        <?php
    }

    /**
     * Render Mobile Menu Tab
     */
    public function render_mobile_menu_tab() {
        $option_name = 'bellano_mobile_menu';
        
        // Handle save
        if (isset($_POST['save_mobile_menu']) && check_admin_referer('bellano_mobile_menu_nonce')) {
            $settings = array(
                'phone' => sanitize_text_field($_POST['phone'] ?? ''),
                'whatsapp' => sanitize_text_field($_POST['whatsapp'] ?? ''),
                'items' => array()
            );
            
            if (isset($_POST['menu_items']) && is_array($_POST['menu_items'])) {
                foreach ($_POST['menu_items'] as $item) {
                    if (!empty($item['title'])) {
                        $menu_item = array(
                            'title' => sanitize_text_field($item['title']),
                            'url' => sanitize_text_field($item['url']),
                            'icon' => sanitize_text_field($item['icon'] ?? ''),
                            'children' => array()
                        );
                        
                        // Handle sub-items
                        if (!empty($item['children']) && is_array($item['children'])) {
                            foreach ($item['children'] as $child) {
                                if (!empty($child['title'])) {
                                    $menu_item['children'][] = array(
                                        'title' => sanitize_text_field($child['title']),
                                        'url' => sanitize_text_field($child['url']),
                                        'icon' => sanitize_text_field($child['icon'] ?? '')
                                    );
                                }
                            }
                        }
                        
                        $settings['items'][] = $menu_item;
                    }
                }
            }
            
            update_option($option_name, $settings);
            echo '<div class="notice notice-success"><p>✅ התפריט נשמר בהצלחה!</p></div>';
        }
        
        $settings = get_option($option_name, array());
        $items = $settings['items'] ?? array();
        $phone = $settings['phone'] ?? '';
        $whatsapp = $settings['whatsapp'] ?? '';
        
        if (empty($items)) {
            $items = array(array('title' => '', 'url' => '', 'icon' => '', 'children' => array()));
        }
        ?>
        <div class="bellano-card">
            <h2>📱 תפריט מובייל</h2>
            <p class="description">הגדר את התפריט שיוצג במובייל באתר Next.js. גרור פריטים לשינוי הסדר.</p>
            
            <form method="post">
                <?php wp_nonce_field('bellano_mobile_menu_nonce'); ?>
                
                <h3 style="margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">📞 פרטי קשר</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                    <div>
                        <label style="font-size: 12px; color: #666;">טלפון</label>
                        <input type="text" name="phone" value="<?php echo esc_attr($phone); ?>" style="width: 100%;" dir="ltr" placeholder="03-1234567">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: #666;">וואטסאפ</label>
                        <input type="text" name="whatsapp" value="<?php echo esc_attr($whatsapp); ?>" style="width: 100%;" dir="ltr" placeholder="972501234567">
                    </div>
                </div>
                
                <h3 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">📋 פריטי תפריט</h3>
                <div id="mobile-menu-items" style="margin-top: 15px;">
                    <?php foreach ($items as $index => $item): ?>
                    <div class="menu-item-wrapper" data-index="<?php echo $index; ?>">
                        <div class="menu-item" style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
                            <span class="drag-handle" style="cursor: grab; color: #999; font-size: 18px;">☰</span>
                            <div style="width: 50px;">
                                <label style="font-size: 10px; color: #666;">אייקון</label>
                                <input type="text" name="menu_items[<?php echo $index; ?>][icon]" value="<?php echo esc_attr($item['icon'] ?? ''); ?>" style="width: 100%; text-align: center; font-size: 18px;" placeholder="🏠">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 10px; color: #666;">שם</label>
                                <input type="text" name="menu_items[<?php echo $index; ?>][title]" value="<?php echo esc_attr($item['title']); ?>" style="width: 100%;" placeholder="שם הפריט">
                            </div>
                            <div style="flex: 1;">
                                <label style="font-size: 10px; color: #666;">קישור</label>
                                <input type="text" name="menu_items[<?php echo $index; ?>][url]" value="<?php echo esc_attr($item['url']); ?>" style="width: 100%;" dir="ltr" placeholder="/category/living-room">
                            </div>
                            <button type="button" onclick="toggleSubMenu(this)" class="button" title="תת-תפריט">📂</button>
                            <button type="button" onclick="this.closest('.menu-item-wrapper').remove(); reindexItems();" class="button" style="color: red;">✕</button>
                        </div>
                        
                        <!-- Sub-menu items -->
                        <div class="sub-menu-container" style="margin-right: 30px; margin-top: 5px; margin-bottom: 10px; padding: 10px; background: #fff; border-radius: 6px; border: 1px dashed #ccc; <?php echo empty($item['children']) ? 'display: none;' : ''; ?>">
                            <div class="sub-menu-items">
                                <?php 
                                $children = $item['children'] ?? array();
                                foreach ($children as $childIndex => $child): 
                                ?>
                                <div class="sub-menu-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px; margin-bottom: 5px;">
                                    <span style="color: #ccc;">↳</span>
                                    <input type="text" name="menu_items[<?php echo $index; ?>][children][<?php echo $childIndex; ?>][icon]" value="<?php echo esc_attr($child['icon'] ?? ''); ?>" style="width: 40px; text-align: center;" placeholder="📌">
                                    <input type="text" name="menu_items[<?php echo $index; ?>][children][<?php echo $childIndex; ?>][title]" value="<?php echo esc_attr($child['title']); ?>" style="flex: 1;" placeholder="שם תת-פריט">
                                    <input type="text" name="menu_items[<?php echo $index; ?>][children][<?php echo $childIndex; ?>][url]" value="<?php echo esc_attr($child['url']); ?>" style="flex: 1;" dir="ltr" placeholder="/category/sub">
                                    <button type="button" onclick="this.closest('.sub-menu-item').remove()" class="button button-small" style="color: red;">✕</button>
                                </div>
                                <?php endforeach; ?>
                            </div>
                            <button type="button" onclick="addSubMenuItem(this, <?php echo $index; ?>)" class="button button-small" style="margin-top: 5px;">➕ הוסף תת-פריט</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <button type="button" onclick="addMobileMenuItem()" class="button" style="margin-top: 15px;">➕ הוסף פריט ראשי</button>
                
                <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #ddd;">
                    <button type="submit" name="save_mobile_menu" class="button button-primary button-large">💾 שמור תפריט מובייל</button>
                </div>
            </form>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
        <script>
        var mobileMenuIndex = <?php echo count($items); ?>;
        var subMenuIndexes = {};
        <?php foreach ($items as $index => $item): ?>
        subMenuIndexes[<?php echo $index; ?>] = <?php echo count($item['children'] ?? array()); ?>;
        <?php endforeach; ?>
        
        // Initialize drag & drop
        document.addEventListener('DOMContentLoaded', function() {
            new Sortable(document.getElementById('mobile-menu-items'), {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                onEnd: function() {
                    reindexItems();
                }
            });
        });
        
        function reindexItems() {
            var items = document.querySelectorAll('#mobile-menu-items .menu-item-wrapper');
            items.forEach(function(item, newIndex) {
                // Update main item inputs
                item.querySelectorAll('.menu-item input').forEach(function(input) {
                    var name = input.getAttribute('name');
                    if (name) {
                        input.setAttribute('name', name.replace(/menu_items\[\d+\]/, 'menu_items[' + newIndex + ']'));
                    }
                });
                // Update sub-menu inputs
                item.querySelectorAll('.sub-menu-item input').forEach(function(input) {
                    var name = input.getAttribute('name');
                    if (name) {
                        input.setAttribute('name', name.replace(/menu_items\[\d+\]/, 'menu_items[' + newIndex + ']'));
                    }
                });
                // Update button onclick
                var addSubBtn = item.querySelector('.sub-menu-container > button');
                if (addSubBtn) {
                    addSubBtn.setAttribute('onclick', 'addSubMenuItem(this, ' + newIndex + ')');
                }
                item.setAttribute('data-index', newIndex);
            });
            mobileMenuIndex = items.length;
        }
        
        function toggleSubMenu(btn) {
            var wrapper = btn.closest('.menu-item-wrapper');
            var subContainer = wrapper.querySelector('.sub-menu-container');
            if (subContainer.style.display === 'none') {
                subContainer.style.display = 'block';
            } else {
                subContainer.style.display = 'none';
            }
        }
        
        function addSubMenuItem(btn, parentIndex) {
            var container = btn.previousElementSibling;
            var subIndex = subMenuIndexes[parentIndex] || 0;
            var html = `
                <div class="sub-menu-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px; margin-bottom: 5px;">
                    <span style="color: #ccc;">↳</span>
                    <input type="text" name="menu_items[${parentIndex}][children][${subIndex}][icon]" value="" style="width: 40px; text-align: center;" placeholder="📌">
                    <input type="text" name="menu_items[${parentIndex}][children][${subIndex}][title]" value="" style="flex: 1;" placeholder="שם תת-פריט">
                    <input type="text" name="menu_items[${parentIndex}][children][${subIndex}][url]" value="" style="flex: 1;" dir="ltr" placeholder="/category/sub">
                    <button type="button" onclick="this.closest('.sub-menu-item').remove()" class="button button-small" style="color: red;">✕</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            subMenuIndexes[parentIndex] = subIndex + 1;
        }
        
        function addMobileMenuItem() {
            var container = document.getElementById('mobile-menu-items');
            var html = `
                <div class="menu-item-wrapper" data-index="${mobileMenuIndex}">
                    <div class="menu-item" style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
                        <span class="drag-handle" style="cursor: grab; color: #999; font-size: 18px;">☰</span>
                        <div style="width: 50px;">
                            <label style="font-size: 10px; color: #666;">אייקון</label>
                            <input type="text" name="menu_items[${mobileMenuIndex}][icon]" value="" style="width: 100%; text-align: center; font-size: 18px;" placeholder="🏠">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 10px; color: #666;">שם</label>
                            <input type="text" name="menu_items[${mobileMenuIndex}][title]" value="" style="width: 100%;" placeholder="שם הפריט">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-size: 10px; color: #666;">קישור</label>
                            <input type="text" name="menu_items[${mobileMenuIndex}][url]" value="" style="width: 100%;" dir="ltr" placeholder="/category/living-room">
                        </div>
                        <button type="button" onclick="toggleSubMenu(this)" class="button" title="תת-תפריט">📂</button>
                        <button type="button" onclick="this.closest('.menu-item-wrapper').remove(); reindexItems();" class="button" style="color: red;">✕</button>
                    </div>
                    <div class="sub-menu-container" style="margin-right: 30px; margin-top: 5px; margin-bottom: 10px; padding: 10px; background: #fff; border-radius: 6px; border: 1px dashed #ccc; display: none;">
                        <div class="sub-menu-items"></div>
                        <button type="button" onclick="addSubMenuItem(this, ${mobileMenuIndex})" class="button button-small" style="margin-top: 5px;">➕ הוסף תת-פריט</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
            subMenuIndexes[mobileMenuIndex] = 0;
            mobileMenuIndex++;
        }
        </script>
        
        <style>
            .sortable-ghost { opacity: 0.4; background: #e3f2fd !important; }
            .menu-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .drag-handle:active { cursor: grabbing; }
        </style>
        <?php
    }
}
