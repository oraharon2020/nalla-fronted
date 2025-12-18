<?php
/**
 * Bellano Admin Pages Module
 * Handles admin menu and page rendering
 */

if (!defined('ABSPATH')) exit;

class Bellano_Admin_Pages {
    
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
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'banners';
        $plugin = Bellano_Settings::get_instance();
        ?>
        <div class="wrap bellano-admin" dir="rtl">
            <h1>⚙️ הגדרות בלאנו</h1>
            
            <?php $this->render_styles(); ?>
            
            <nav class="bellano-tabs">
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
            </nav>
            
            <?php
            switch ($active_tab) {
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
                default:
                    $plugin->banners->render_tab();
            }
            ?>
        </div>
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
}
