<?php
/**
 * Product Assembly Module
 * Adds assembly included/required setting to products
 */

if (!defined('ABSPATH')) {
    exit;
}

class Bellano_Product_Assembly {
    
    public function __construct() {
        add_action('add_meta_boxes', array($this, 'add_meta_box'));
        add_action('save_post_product', array($this, 'save_meta_box'));
    }
    
    public function add_meta_box() {
        add_meta_box(
            'bellano_assembly',
            '🔧 הרכבה',
            array($this, 'render_meta_box'),
            'product',
            'side',
            'default'
        );
    }
    
    public function render_meta_box($post) {
        wp_nonce_field('bellano_assembly_nonce', 'bellano_assembly_nonce');
        
        $assembly = get_post_meta($post->ID, '_bellano_assembly', true);
        // Default to true (comes assembled)
        $assembly = ($assembly === '' || $assembly === '1') ? '1' : '0';
        
        ?>
        <p>
            <label>
                <input type="radio" name="bellano_assembly" value="1" <?php checked($assembly, '1'); ?>>
                מגיע מורכב
            </label>
        </p>
        <p>
            <label>
                <input type="radio" name="bellano_assembly" value="0" <?php checked($assembly, '0'); ?>>
                נדרש הרכבה
            </label>
        </p>
        <p class="description">בחר האם המוצר מגיע מורכב או דורש הרכבה עצמאית</p>
        <?php
    }
    
    public function save_meta_box($post_id) {
        if (!isset($_POST['bellano_assembly_nonce']) || 
            !wp_verify_nonce($_POST['bellano_assembly_nonce'], 'bellano_assembly_nonce')) {
            return;
        }
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        $assembly = isset($_POST['bellano_assembly']) ? sanitize_text_field($_POST['bellano_assembly']) : '1';
        update_post_meta($post_id, '_bellano_assembly', $assembly);
    }
}

new Bellano_Product_Assembly();
