<?php
/**
 * Bellano Upgrades Module
 * Handles admin upgrades for sales reps
 */

if (!defined('ABSPATH')) exit;

class Bellano_Upgrades {
    
    public function render_tab() {
        // Handle form submission
        if (isset($_POST['save_upgrades']) && check_admin_referer('bellano_upgrades_action')) {
            $upgrades = [];
            if (!empty($_POST['upgrades']) && is_array($_POST['upgrades'])) {
                foreach ($_POST['upgrades'] as $upgrade) {
                    if (!empty($upgrade['name']) && isset($upgrade['price'])) {
                        $upgrades[] = [
                            'name' => sanitize_text_field($upgrade['name']),
                            'price' => floatval($upgrade['price']),
                        ];
                    }
                }
            }
            update_option('bellano_admin_upgrades', $upgrades);
            echo '<div class="notice notice-success"><p>✅ השדרוגים נשמרו בהצלחה!</p></div>';
        }
        
        $upgrades = get_option('bellano_admin_upgrades', []);
        if (!is_array($upgrades)) $upgrades = [];
        ?>
        <form method="post">
            <?php wp_nonce_field('bellano_upgrades_action'); ?>
            
            <div class="bellano-card">
                <h2>⬆️ שדרוגים למכירות</h2>
                <p>הגדר שדרוגים זמינים שנציגי מכירות יכולים להוסיף למוצרים. השדרוגים יופיעו בתיבת "שינוי נתונים - למנהלים" בעמוד המוצר.</p>
                
                <div id="upgrades-container">
                    <?php foreach ($upgrades as $index => $upgrade): ?>
                    <div class="upgrade-item" style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px; border: 1px solid #ddd; display: flex; gap: 15px; align-items: center;">
                        <div style="flex: 1;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 500;">שם השדרוג</label>
                            <input type="text" name="upgrades[<?php echo $index; ?>][name]" value="<?php echo esc_attr($upgrade['name']); ?>" class="regular-text" style="width: 100%;">
                        </div>
                        <div style="width: 150px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 500;">מחיר (₪)</label>
                            <input type="number" name="upgrades[<?php echo $index; ?>][price]" value="<?php echo esc_attr($upgrade['price']); ?>" step="0.01" min="0" style="width: 100%;">
                        </div>
                        <button type="button" class="button remove-upgrade" style="margin-top: 20px;">❌</button>
                    </div>
                    <?php endforeach; ?>
                </div>
                
                <button type="button" id="add-upgrade" class="button button-secondary" style="margin-top: 15px;">
                    ➕ הוסף שדרוג
                </button>
            </div>
            
            <p>
                <input type="submit" name="save_upgrades" class="button button-primary" value="💾 שמור שדרוגים" style="font-size: 16px; padding: 8px 24px;">
            </p>
        </form>
        
        <script>
        jQuery(document).ready(function($) {
            var upgradeIndex = <?php echo count($upgrades); ?>;
            
            $('#add-upgrade').on('click', function() {
                var html = `
                    <div class="upgrade-item" style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px; border: 1px solid #ddd; display: flex; gap: 15px; align-items: center;">
                        <div style="flex: 1;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 500;">שם השדרוג</label>
                            <input type="text" name="upgrades[${upgradeIndex}][name]" class="regular-text" style="width: 100%;" placeholder="למשל: התקנה">
                        </div>
                        <div style="width: 150px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: 500;">מחיר (₪)</label>
                            <input type="number" name="upgrades[${upgradeIndex}][price]" step="0.01" min="0" style="width: 100%;" placeholder="0">
                        </div>
                        <button type="button" class="button remove-upgrade" style="margin-top: 20px;">❌</button>
                    </div>
                `;
                $('#upgrades-container').append(html);
                upgradeIndex++;
            });
            
            $(document).on('click', '.remove-upgrade', function() {
                $(this).closest('.upgrade-item').remove();
            });
        });
        </script>
        <?php
    }
    
    /**
     * Get upgrades for REST API
     */
    public function get_upgrades() {
        $upgrades = get_option('bellano_admin_upgrades', []);
        return is_array($upgrades) ? $upgrades : [];
    }
}
