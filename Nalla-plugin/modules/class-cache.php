<?php
/**
 * Bellano Cache Module
 * Handles Vercel cache revalidation
 */

if (!defined('ABSPATH')) exit;

class Bellano_Cache {
    
    public function render_tab() {
        $revalidate_url = get_option('bellano_vercel_revalidate_url', '');
        $revalidate_token = get_option('bellano_vercel_revalidate_token', '');
        
        // Handle cache clear
        if (isset($_POST['clear_cache']) && check_admin_referer('bellano_cache_action')) {
            $result = $this->clear_vercel_cache('/');
            if ($result['success']) {
                echo '<div class="notice notice-success"><p>✅ הקאש נוקה בהצלחה!</p></div>';
            } else {
                echo '<div class="notice notice-error"><p>❌ שגיאה: ' . esc_html($result['message']) . '</p></div>';
            }
        }
        
        // Handle clear specific path
        if (isset($_POST['clear_path']) && check_admin_referer('bellano_cache_action')) {
            $path = sanitize_text_field($_POST['cache_path']);
            $result = $this->clear_vercel_cache($path);
            if ($result['success']) {
                echo '<div class="notice notice-success"><p>✅ הקאש של ' . esc_html($path) . ' נוקה בהצלחה!</p></div>';
            } else {
                echo '<div class="notice notice-error"><p>❌ שגיאה: ' . esc_html($result['message']) . '</p></div>';
            }
        }
        
        // Handle save Vercel settings
        if (isset($_POST['save_vercel_settings']) && check_admin_referer('bellano_vercel_settings')) {
            $revalidate_url = esc_url_raw($_POST['bellano_vercel_revalidate_url'] ?? '');
            $revalidate_token = sanitize_text_field($_POST['bellano_vercel_revalidate_token'] ?? '');
            update_option('bellano_vercel_revalidate_url', $revalidate_url);
            update_option('bellano_vercel_revalidate_token', $revalidate_token);
            echo '<div class="notice notice-success"><p>✅ ההגדרות נשמרו בהצלחה!</p></div>';
        }
        ?>
        <div class="bellano-card">
            <h2>⚙️ הגדרות Vercel</h2>
            <form method="post">
                <?php wp_nonce_field('bellano_vercel_settings'); ?>
                <table class="form-table">
                    <tr>
                        <th><label>כתובת ה-Revalidate</label></th>
                        <td>
                            <input type="url" name="bellano_vercel_revalidate_url" value="<?php echo esc_attr($revalidate_url); ?>" class="regular-text" placeholder="https://bellano.vercel.app/api/revalidate">
                            <p class="description">הכתובת של ה-API route לניקוי קאש</p>
                        </td>
                    </tr>
                    <tr>
                        <th><label>טוקן אבטחה</label></th>
                        <td>
                            <input type="text" name="bellano_vercel_revalidate_token" value="<?php echo esc_attr($revalidate_token); ?>" class="regular-text">
                            <p class="description">טוקן סודי לאימות הבקשה</p>
                        </td>
                    </tr>
                </table>
                <button type="submit" name="save_vercel_settings" class="button button-primary">💾 שמור הגדרות</button>
            </form>
        </div>
        
        <div class="bellano-card">
            <h2>⚡ פעולות מהירות</h2>
            <form method="post">
                <?php wp_nonce_field('bellano_cache_action'); ?>
                <div class="quick-actions">
                    <button type="submit" name="clear_cache" value="all" class="button button-primary button-hero">
                        🗑️ נקה את כל הקאש
                    </button>
                </div>
            </form>
        </div>
        
        <div class="bellano-card">
            <h2>🎯 ניקוי נתיב ספציפי</h2>
            <form method="post">
                <?php wp_nonce_field('bellano_cache_action'); ?>
                <input type="text" name="cache_path" class="regular-text" placeholder="/" value="/">
                <button type="submit" name="clear_path" class="button button-secondary">נקה נתיב</button>
                <p class="description">לדוגמה: / (דף הבית), /categories, /product/chair-name</p>
            </form>
        </div>
        
        <div class="bellano-card">
            <h2>📍 נתיבים נפוצים</h2>
            <div class="quick-actions">
                <?php 
                $paths = [
                    '/' => '🏠 דף הבית',
                    '/categories' => '📂 קטגוריות',
                    '/about' => 'ℹ️ אודות',
                    '/contact' => '📞 צור קשר',
                ];
                foreach ($paths as $path => $label): 
                ?>
                    <form method="post" style="display: inline;">
                        <?php wp_nonce_field('bellano_cache_action'); ?>
                        <input type="hidden" name="cache_path" value="<?php echo esc_attr($path); ?>">
                        <button type="submit" name="clear_path" class="button"><?php echo $label; ?></button>
                    </form>
                <?php endforeach; ?>
            </div>
        </div>
        
        <div class="bellano-card">
            <h2>🤖 ניקוי אוטומטי</h2>
            <p>הקאש מתנקה אוטומטית כאשר:</p>
            <ul style="list-style: disc; padding-right: 20px;">
                <li>✅ מעדכנים באנר בדף הבית</li>
                <li>✅ מוסיפים/מעדכנים מוצר ב-WooCommerce</li>
                <li>✅ מעדכנים קטגוריה</li>
            </ul>
        </div>
        <?php
    }
    
    public function clear_vercel_cache($path = '/') {
        $revalidate_url = get_option('bellano_vercel_revalidate_url', '');
        $revalidate_token = get_option('bellano_vercel_revalidate_token', '');
        
        if (empty($revalidate_url)) {
            return ['success' => false, 'message' => 'לא הוגדרה כתובת Revalidate'];
        }
        
        if (empty($revalidate_token)) {
            return ['success' => false, 'message' => 'לא הוגדר טוקן אבטחה'];
        }
        
        $url = add_query_arg([
            'path' => $path,
            'token' => $revalidate_token
        ], $revalidate_url);
        
        $response = wp_remote_post($url, [
            'timeout' => 30,
            'headers' => ['Content-Type' => 'application/json']
        ]);
        
        if (is_wp_error($response)) {
            return ['success' => false, 'message' => $response->get_error_message()];
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        $code = wp_remote_retrieve_response_code($response);
        
        if ($code === 200 && isset($body['revalidated']) && $body['revalidated']) {
            return ['success' => true, 'message' => 'הקאש נוקה בהצלחה'];
        }
        
        return ['success' => false, 'message' => $body['message'] ?? 'שגיאה לא ידועה'];
    }
    
    // Auto-clear hooks
    public function clear_homepage_cache() {
        $this->clear_vercel_cache('/');
    }
    
    public function clear_product_cache($product_id) {
        $product = wc_get_product($product_id);
        if ($product) {
            // Clear product page
            $this->clear_vercel_cache('/product/' . $product->get_slug());
            
            // Clear homepage (shows featured products)
            $this->clear_vercel_cache('/');
            
            // Clear all category pages this product belongs to
            $categories = $product->get_category_ids();
            foreach ($categories as $cat_id) {
                $term = get_term($cat_id, 'product_cat');
                if ($term && !is_wp_error($term)) {
                    $this->clear_vercel_cache('/category/' . $term->slug);
                }
            }
        }
    }
    
    public function clear_category_cache($term_id) {
        $term = get_term($term_id, 'product_cat');
        if ($term && !is_wp_error($term)) {
            $this->clear_vercel_cache('/category/' . $term->slug);
            $this->clear_vercel_cache('/categories');
        }
    }
}
