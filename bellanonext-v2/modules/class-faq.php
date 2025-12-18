<?php
/**
 * Bellano FAQ Module
 * Handles FAQ templates and product-specific FAQs
 */

if (!defined('ABSPATH')) exit;

class Bellano_FAQ {
    
    public function render_tab() {
        $templates = get_option('bellano_faq_templates', $this->get_default_templates());
        $default_template = get_option('bellano_faq_default_template', 'standard');
        
        // Handle save
        if (isset($_POST['save_faq']) && check_admin_referer('bellano_faq_save')) {
            if (isset($_POST['templates'])) {
                $templates = $this->sanitize_templates($_POST['templates']);
                update_option('bellano_faq_templates', $templates);
            }
            if (isset($_POST['default_template'])) {
                update_option('bellano_faq_default_template', sanitize_text_field($_POST['default_template']));
                $default_template = $_POST['default_template'];
            }
            echo '<div class="notice notice-success"><p>✅ השאלות נשמרו בהצלחה!</p></div>';
        }
        ?>
        <style>
            .faq-item { 
                background: #f9f9f9; 
                padding: 15px; 
                margin: 10px 0; 
                border-radius: 5px; 
                border: 1px solid #ddd;
            }
            .template-section { margin: 20px 0; padding: 20px; background: #f0f0f1; border-radius: 8px; }
            .template-section h3 { margin-top: 0; }
        </style>
        
        <form method="post">
            <?php wp_nonce_field('bellano_faq_save'); ?>
            
            <div class="bellano-card">
                <h2>❓ תבניות שאלות נפוצות</h2>
                <p>הגדר תבניות שאלות ותשובות שיופיעו בדפי המוצרים. ניתן לבחור תבנית שונה לכל מוצר.</p>
                
                <p>
                    <label><strong>תבנית ברירת מחדל:</strong></label>
                    <select name="default_template">
                        <?php foreach ($templates as $key => $template): ?>
                            <option value="<?php echo esc_attr($key); ?>" <?php selected($default_template, $key); ?>>
                                <?php echo esc_html($template['name']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </p>
            </div>
            
            <?php foreach ($templates as $key => $template): ?>
                <div class="bellano-card template-section">
                    <h3>📋 <?php echo esc_html($template['name']); ?></h3>
                    <input type="hidden" name="templates[<?php echo $key; ?>][name]" value="<?php echo esc_attr($template['name']); ?>">
                    
                    <div class="faq-items" data-template="<?php echo $key; ?>">
                        <?php 
                        if (!empty($template['faqs'])):
                            foreach ($template['faqs'] as $faqIndex => $faq): 
                        ?>
                            <div class="faq-item">
                                <p>
                                    <label>שאלה:</label><br>
                                    <input type="text" name="templates[<?php echo $key; ?>][faqs][<?php echo $faqIndex; ?>][question]" 
                                           value="<?php echo esc_attr($faq['question']); ?>" class="large-text">
                                </p>
                                <p>
                                    <label>תשובה:</label><br>
                                    <textarea name="templates[<?php echo $key; ?>][faqs][<?php echo $faqIndex; ?>][answer]" 
                                              rows="2" class="large-text"><?php echo esc_textarea($faq['answer']); ?></textarea>
                                </p>
                                <button type="button" class="button remove-faq">🗑️ הסר</button>
                            </div>
                        <?php 
                            endforeach;
                        endif; 
                        ?>
                    </div>
                    <button type="button" class="button add-faq" data-template="<?php echo $key; ?>">➕ הוסף שאלה</button>
                </div>
            <?php endforeach; ?>
            
            <button type="submit" name="save_faq" class="button button-primary button-hero">💾 שמור שאלות נפוצות</button>
        </form>
        
        <script>
        jQuery(document).ready(function($) {
            // Add FAQ
            $('.add-faq').click(function() {
                var template = $(this).data('template');
                var container = $(this).siblings('.faq-items');
                var index = container.children().length;
                
                container.append(`
                    <div class="faq-item">
                        <p>
                            <label>שאלה:</label><br>
                            <input type="text" name="templates[${template}][faqs][${index}][question]" class="large-text">
                        </p>
                        <p>
                            <label>תשובה:</label><br>
                            <textarea name="templates[${template}][faqs][${index}][answer]" rows="2" class="large-text"></textarea>
                        </p>
                        <button type="button" class="button remove-faq">🗑️ הסר</button>
                    </div>
                `);
            });
            
            // Remove FAQ
            $(document).on('click', '.remove-faq', function() {
                $(this).closest('.faq-item').remove();
            });
        });
        </script>
        <?php
    }
    
    public function get_default_templates() {
        return [
            'standard' => [
                'name' => 'רהיטים מעץ (ברירת מחדל)',
                'faqs' => [
                    ['question' => 'זמני אספקה', 'answer' => 'זמני האספקה נעים בין 12-26 ימי עסקים, בהתאם לסוג המוצר והזמינות במלאי. מוצרים בהתאמה אישית עשויים לדרוש זמן ייצור ארוך יותר. נציג שירות יצור אתכם קשר לתיאום מועד אספקה נוח.'],
                    ['question' => 'אחריות המוצרים', 'answer' => 'שנה אחריות מלאה על המוצר מיום הקנייה. האחריות מכסה פגמים במבנה ובייצור. האחריות אינה כוללת בלאי טבעי, נזק שנגרם משימוש לא נכון, או נזקי הובלה לאחר מסירת המוצר.'],
                    ['question' => 'נקיון ותחזוקת המוצרים', 'answer' => 'מומלץ לנקות את המוצר באופן קבוע עם מטלית רכה ויבשה. להסרת כתמים, השתמשו במטלית לחה עם מעט סבון עדין. הימנעו משימוש בחומרי ניקוי אגרסיביים או שוחקים. מומלץ להרחיק את המוצר ממקורות חום ישירים ומלחות גבוהה.'],
                    ['question' => 'אפשרויות תשלום', 'answer' => 'אנו מציעים מגוון אפשרויות תשלום נוחות: תשלום מאובטח בכרטיס אשראי, עד 12 תשלומים ללא ריבית, תשלום בביט או בהעברה בנקאית. כל התשלומים מאובטחים בתקן PCI DSS.'],
                    ['question' => 'משלוח והובלה', 'answer' => 'משלוח חינם עד הבית! ההובלה כוללת הכנסה לבית עד לקומה השלישית ללא מעלית, או לכל קומה עם מעלית. נציג יתאם אתכם מועד אספקה נוח מראש.'],
                ]
            ],
            'custom' => [
                'name' => 'ייצור בהתאמה אישית',
                'faqs' => [
                    ['question' => 'זמני אספקה', 'answer' => 'זמני הייצור למוצרים בהתאמה אישית הם כ-21-30 ימי עסקים. המוצר מיוצר בהזמנה אישית בדיוק לפי הצבע והמידות שבחרתם. נציג שירות יצור אתכם קשר לתיאום מועד אספקה.'],
                    ['question' => 'אחריות המוצרים', 'answer' => 'שנה אחריות מלאה על המוצר מיום הקנייה. האחריות מכסה פגמים במבנה ובייצור. אנו גאים באיכות המוצרים שלנו ועומדים מאחוריהם לאורך זמן.'],
                    ['question' => 'האם ניתן להזמין במידות מיוחדות?', 'answer' => 'בהחלט! המוצר מיוצר בארץ וניתן להתאים אותו למידות ספציפיות לפי הצורך שלכם. צרו קשר לקבלת הצעת מחיר מותאמת.'],
                    ['question' => 'נקיון ותחזוקת המוצרים', 'answer' => 'מומלץ לנקות את המוצר באופן קבוע עם מטלית רכה ויבשה. להסרת כתמים, השתמשו במטלית לחה עם מעט סבון עדין. הימנעו משימוש בחומרי ניקוי אגרסיביים.'],
                    ['question' => 'אפשרויות תשלום', 'answer' => 'אנו מציעים מגוון אפשרויות תשלום נוחות: תשלום מאובטח בכרטיס אשראי, עד 12 תשלומים ללא ריבית, תשלום בביט או בהעברה בנקאית.'],
                    ['question' => 'משלוח והובלה', 'answer' => 'משלוח חינם עד הבית! ההובלה כוללת הכנסה והרכבה מלאה בביתכם ללא עלות נוספת.'],
                    ['question' => 'מדיניות ביטולים', 'answer' => 'מכיוון שהמוצר מיוצר בהזמנה אישית, ניתן לבטל תוך 24 שעות מרגע ביצוע ההזמנה. לאחר תחילת הייצור לא ניתן לבטל את ההזמנה.'],
                ]
            ],
            'upholstery' => [
                'name' => 'ריפוד (כורסאות/מיטות)',
                'faqs' => [
                    ['question' => 'זמני אספקה', 'answer' => 'זמני הייצור לפריטי ריפוד הם כ-30-45 ימי עסקים, בהתאם לסוג הבד והמורכבות. המוצר מיוצר בהזמנה אישית לפי בחירתכם.'],
                    ['question' => 'אחריות המוצרים', 'answer' => 'שנתיים אחריות על השלד והמנגנונים, ושנה על הריפוד. האחריות אינה כוללת בלאי טבעי של הבד או נזק שנגרם משימוש לא נכון.'],
                    ['question' => 'האם ניתן לבחור בד אחר?', 'answer' => 'בהחלט! יש לנו מגוון רחב של בדים ועורות. מוזמנים להגיע לאולם התצוגה לראות את הדוגמאות או לבקש משלוח דוגמיות לבית.'],
                    ['question' => 'נקיון ותחזוקת הריפוד', 'answer' => 'מומלץ לנקות כתמים מיד עם מטלית לחה. לניקוי יסודי יש להשתמש בתכשיר ייעודי לבדים. הימנעו מחשיפה ישירה לשמש ממושכת.'],
                    ['question' => 'אפשרויות תשלום', 'answer' => 'אנו מציעים מגוון אפשרויות תשלום נוחות: תשלום מאובטח בכרטיס אשראי, עד 12 תשלומים ללא ריבית, תשלום בביט או בהעברה בנקאית.'],
                    ['question' => 'משלוח והובלה', 'answer' => 'משלוח חינם עד הבית! ההובלה כוללת הכנסה והרכבה מלאה בביתכם ללא עלות נוספת.'],
                ]
            ],
        ];
    }
    
    private function sanitize_templates($templates) {
        $sanitized = [];
        foreach ($templates as $key => $template) {
            $sanitized[$key] = [
                'name' => sanitize_text_field($template['name']),
                'faqs' => []
            ];
            if (!empty($template['faqs'])) {
                foreach ($template['faqs'] as $faq) {
                    if (!empty($faq['question'])) {
                        $sanitized[$key]['faqs'][] = [
                            'question' => sanitize_text_field($faq['question']),
                            'answer' => sanitize_textarea_field($faq['answer'])
                        ];
                    }
                }
            }
        }
        return $sanitized;
    }
    
    /**
     * Add product metabox for FAQ
     */
    public function add_product_metabox() {
        add_meta_box(
            'bellano_product_faq',
            '❓ שאלות ותשובות',
            [$this, 'render_product_metabox'],
            'product',
            'normal',
            'default'
        );
    }
    
    public function render_product_metabox($post) {
        wp_nonce_field('bellano_product_faq', 'bellano_faq_nonce');
        
        $templates = get_option('bellano_faq_templates', $this->get_default_templates());
        $default_template = get_option('bellano_faq_default_template', 'standard');
        
        $product_template = get_post_meta($post->ID, '_bellano_faq_template', true);
        $use_custom = get_post_meta($post->ID, '_bellano_faq_custom', true);
        $custom_faqs = get_post_meta($post->ID, '_bellano_faq_items', true);
        
        if (empty($product_template)) {
            $product_template = $default_template;
        }
        ?>
        <style>
            .bellano-metabox label { font-weight: 600; }
            .bellano-metabox .custom-faq-item { background: #f9f9f9; padding: 10px; margin: 10px 0; border-radius: 5px; }
        </style>
        
        <div class="bellano-metabox">
            <p>
                <label>
                    <input type="checkbox" name="bellano_faq_custom" value="1" <?php checked($use_custom, '1'); ?> id="use-custom-toggle">
                    השתמש בשאלות מותאמות אישית (במקום תבנית)
                </label>
            </p>
            
            <div id="template-select" style="<?php echo $use_custom ? 'display:none;' : ''; ?>">
                <p>
                    <label>בחר תבנית:</label>
                    <select name="bellano_faq_template">
                        <?php foreach ($templates as $key => $template): ?>
                            <option value="<?php echo esc_attr($key); ?>" <?php selected($product_template, $key); ?>>
                                <?php echo esc_html($template['name']); ?>
                                <?php if ($key === $default_template) echo ' (ברירת מחדל)'; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </p>
                <p class="description">
                    <a href="<?php echo admin_url('admin.php?page=bellano-settings&tab=faq'); ?>" target="_blank">ערוך תבניות →</a>
                </p>
            </div>
            
            <div id="custom-faqs" style="<?php echo $use_custom ? '' : 'display:none;'; ?>">
                <h4>שאלות מותאמות אישית:</h4>
                <div id="custom-faq-items">
                    <?php 
                    if (!empty($custom_faqs) && is_array($custom_faqs)):
                        foreach ($custom_faqs as $index => $faq): 
                    ?>
                        <div class="custom-faq-item">
                            <p>
                                <label>שאלה:</label>
                                <input type="text" name="bellano_custom_faqs[<?php echo $index; ?>][question]" 
                                       value="<?php echo esc_attr($faq['question']); ?>" class="large-text">
                            </p>
                            <p>
                                <label>תשובה:</label>
                                <textarea name="bellano_custom_faqs[<?php echo $index; ?>][answer]" 
                                          rows="2" class="large-text"><?php echo esc_textarea($faq['answer']); ?></textarea>
                            </p>
                            <button type="button" class="button remove-custom-faq">🗑️ הסר</button>
                        </div>
                    <?php 
                        endforeach;
                    endif; 
                    ?>
                </div>
                <button type="button" class="button" id="add-custom-faq">➕ הוסף שאלה</button>
            </div>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            $('#use-custom-toggle').change(function() {
                $('#template-select').toggle(!this.checked);
                $('#custom-faqs').toggle(this.checked);
            });
            
            var faqIndex = <?php echo !empty($custom_faqs) ? count($custom_faqs) : 0; ?>;
            
            $('#add-custom-faq').click(function() {
                $('#custom-faq-items').append(`
                    <div class="custom-faq-item">
                        <p>
                            <label>שאלה:</label>
                            <input type="text" name="bellano_custom_faqs[${faqIndex}][question]" class="large-text">
                        </p>
                        <p>
                            <label>תשובה:</label>
                            <textarea name="bellano_custom_faqs[${faqIndex}][answer]" rows="2" class="large-text"></textarea>
                        </p>
                        <button type="button" class="button remove-custom-faq">🗑️ הסר</button>
                    </div>
                `);
                faqIndex++;
            });
            
            $(document).on('click', '.remove-custom-faq', function() {
                $(this).closest('.custom-faq-item').remove();
            });
        });
        </script>
        <?php
    }
    
    public function save_product_faq($post_id) {
        if (!isset($_POST['bellano_faq_nonce']) || !wp_verify_nonce($_POST['bellano_faq_nonce'], 'bellano_product_faq')) {
            return;
        }
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // Save template choice
        if (isset($_POST['bellano_faq_template'])) {
            update_post_meta($post_id, '_bellano_faq_template', sanitize_text_field($_POST['bellano_faq_template']));
        }
        
        // Save custom toggle
        update_post_meta($post_id, '_bellano_faq_custom', isset($_POST['bellano_faq_custom']) ? '1' : '');
        
        // Save custom FAQs
        if (isset($_POST['bellano_custom_faqs']) && is_array($_POST['bellano_custom_faqs'])) {
            $custom_faqs = [];
            foreach ($_POST['bellano_custom_faqs'] as $faq) {
                if (!empty($faq['question'])) {
                    $custom_faqs[] = [
                        'question' => sanitize_text_field($faq['question']),
                        'answer' => sanitize_textarea_field($faq['answer'])
                    ];
                }
            }
            update_post_meta($post_id, '_bellano_faq_items', $custom_faqs);
        } else {
            delete_post_meta($post_id, '_bellano_faq_items');
        }
    }
    
    /**
     * Get product FAQ for REST API
     */
    public function get_product_faq($product_id) {
        $use_custom = get_post_meta($product_id, '_bellano_faq_custom', true);
        
        if ($use_custom === '1') {
            $custom_faqs = get_post_meta($product_id, '_bellano_faq_items', true);
            return [
                'type' => 'custom',
                'faqs' => is_array($custom_faqs) ? $custom_faqs : []
            ];
        }
        
        $template_key = get_post_meta($product_id, '_bellano_faq_template', true);
        $templates = get_option('bellano_faq_templates', $this->get_default_templates());
        $default_template = get_option('bellano_faq_default_template', 'standard');
        
        if (empty($template_key)) {
            $template_key = $default_template;
        }
        
        $faqs = isset($templates[$template_key]['faqs']) ? $templates[$template_key]['faqs'] : [];
        
        return [
            'type' => 'template',
            'template' => $template_key,
            'faqs' => $faqs
        ];
    }
    
    /**
     * Get all FAQ templates for REST API
     */
    public function get_templates() {
        $templates = get_option('bellano_faq_templates', $this->get_default_templates());
        $default_template = get_option('bellano_faq_default_template', 'standard');
        
        return [
            'templates' => $templates,
            'default' => $default_template
        ];
    }
}
