<?php
/**
 * Bellano Contact Form Handler
 * 
 * Handles contact form submissions from the Next.js frontend
 */

if (!defined('ABSPATH')) exit;

class Bellano_Contact_Form {
    
    public function __construct() {
        // Register REST API endpoint
        add_action('rest_api_init', [$this, 'register_routes']);
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        register_rest_route('bellano/v1', '/contact', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_contact_form'],
            'permission_callback' => '__return_true', // Public endpoint
            'args' => [
                'name' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'phone' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'email' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_email',
                ],
                'subject' => [
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'message' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_textarea_field',
                ],
            ],
        ]);
    }
    
    /**
     * Handle contact form submission
     */
    public function handle_contact_form($request) {
        $name = $request->get_param('name');
        $phone = $request->get_param('phone');
        $email = $request->get_param('email') ?: 'לא צוין';
        $subject = $request->get_param('subject') ?: 'פנייה מהאתר';
        $message = $request->get_param('message');
        
        // Get admin email
        $admin_email = get_option('admin_email');
        
        // Build email
        $email_subject = "פנייה חדשה מהאתר: {$subject}";
        
        $email_body = "
<div dir='rtl' style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
    <h2 style='color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;'>פנייה חדשה מאתר בלאנו</h2>
    
    <table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>
        <tr>
            <td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;'>שם:</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee;'>{$name}</td>
        </tr>
        <tr>
            <td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>טלפון:</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee;'>
                <a href='tel:{$phone}' style='color: #000;'>{$phone}</a>
            </td>
        </tr>
        <tr>
            <td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>אימייל:</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee;'>
                <a href='mailto:{$email}' style='color: #000;'>{$email}</a>
            </td>
        </tr>
        <tr>
            <td style='padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;'>נושא:</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee;'>{$subject}</td>
        </tr>
    </table>
    
    <div style='margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;'>
        <strong>הודעה:</strong>
        <p style='margin-top: 10px; white-space: pre-wrap;'>{$message}</p>
    </div>
    
    <p style='margin-top: 30px; color: #666; font-size: 12px;'>
        הודעה זו נשלחה מטופס יצירת הקשר באתר bellano.co.il
    </p>
</div>
";
        
        // Email headers
        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: אתר בלאנו <noreply@bellano.co.il>',
        ];
        
        // Add reply-to if email provided
        if ($email && $email !== 'לא צוין') {
            $headers[] = "Reply-To: {$name} <{$email}>";
        }
        
        // Send email
        $sent = wp_mail($admin_email, $email_subject, $email_body, $headers);
        
        if ($sent) {
            // Log the submission (optional)
            $this->log_submission($name, $phone, $email, $subject, $message);
            
            return new WP_REST_Response([
                'success' => true,
                'message' => 'ההודעה נשלחה בהצלחה',
            ], 200);
        } else {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'שגיאה בשליחת ההודעה',
            ], 500);
        }
    }
    
    /**
     * Log submission to database (optional)
     */
    private function log_submission($name, $phone, $email, $subject, $message) {
        global $wpdb;
        
        $table = $wpdb->prefix . 'bellano_contact_submissions';
        
        // Create table if not exists
        if ($wpdb->get_var("SHOW TABLES LIKE '{$table}'") != $table) {
            $charset_collate = $wpdb->get_charset_collate();
            
            $sql = "CREATE TABLE {$table} (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                name varchar(255) NOT NULL,
                phone varchar(50) NOT NULL,
                email varchar(255) DEFAULT '',
                subject varchar(255) DEFAULT '',
                message text NOT NULL,
                created_at datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) {$charset_collate};";
            
            require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($sql);
        }
        
        // Insert submission
        $wpdb->insert($table, [
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
        ]);
    }
}
