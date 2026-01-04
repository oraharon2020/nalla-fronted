<?php
/**
 * WooCommerce Color Attribute with Image Support - Backend Only
 * 
 * This file contains the backend/admin functionality for WooCommerce product color attributes
 * with support for color swatches and images. It can be easily moved to another theme
 * while preserving all existing saved data.
 * 
 * @package WooCommerce Color Attribute
 * @version 1.0.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Only load if WooCommerce is active
if ( ! class_exists( 'WooCommerce' ) ) {
	return;
}

class WC_Color_Attribute_Standalone {
	
	/**
	 * Constructor
	 */
	public function __construct() {
		// Register image size
		add_action( 'init', array( $this, 'register_image_size' ) );
		
		// Admin: Add fields to attribute term forms
		add_action( 'init', array( $this, 'add_admin_fields' ), 20 );
		
		// Enqueue admin scripts and styles
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}
	
	/**
	 * Register image size for color swatches
	 */
	public function register_image_size() {
		add_image_size( 'ts_prod_color_thumb', 30, 30, true );
	}
	
	/**
	 * Add admin fields to attribute term forms
	 */
	public function add_admin_fields() {
		// Get all product attribute taxonomies
		$attribute_taxonomies = wc_get_attribute_taxonomies();
		
		if ( ! empty( $attribute_taxonomies ) ) {
			foreach ( $attribute_taxonomies as $tax ) {
				$taxonomy = wc_attribute_taxonomy_name( $tax->attribute_name );
				
				// Add fields to "Add New Term" form
				add_action( "{$taxonomy}_add_form_fields", array( $this, 'add_color_fields' ), 10, 1 );
				
				// Add fields to "Edit Term" form
				add_action( "{$taxonomy}_edit_form_fields", array( $this, 'edit_color_fields' ), 10, 2 );
				
				// Save term meta
				add_action( "created_{$taxonomy}", array( $this, 'save_color_fields' ), 10, 2 );
				add_action( "edited_{$taxonomy}", array( $this, 'save_color_fields' ), 10, 2 );
			}
		}
	}
	
	/**
	 * Add color fields to "Add New Term" form
	 */
	public function add_color_fields( $taxonomy ) {
		?>
		<div class="form-field term-color-color-wrap">
			<label for="ts_color_color"><?php esc_html_e( 'Color', 'woocommerce' ); ?></label>
			<input type="text" name="ts_color_color" id="ts_color_color" value="#ffffff" class="ts-color-picker" />
			<p class="description"><?php esc_html_e( 'Select a color for this attribute term.', 'woocommerce' ); ?></p>
		</div>
		
		<div class="form-field term-color-image-wrap">
			<label><?php esc_html_e( 'Color Image', 'woocommerce' ); ?></label>
			<div id="ts_color_image_preview" style="margin-bottom: 10px;">
				<img src="" style="max-width: 30px; max-height: 30px; display: none;" class="ts_color_preview_image" />
			</div>
			<input type="hidden" name="ts_color_image" id="ts_color_image" value="" />
			<button type="button" class="button ts-upload-color-image"><?php esc_html_e( 'Upload Image', 'woocommerce' ); ?></button>
			<button type="button" class="button ts-remove-color-image" style="display: none;"><?php esc_html_e( 'Remove Image', 'woocommerce' ); ?></button>
			<p class="description"><?php esc_html_e( 'Upload an image for this color. If an image is uploaded, it will be used instead of the color.', 'woocommerce' ); ?></p>
		</div>
		<?php
	}
	
	/**
	 * Add color fields to "Edit Term" form
	 */
	public function edit_color_fields( $term, $taxonomy ) {
		$term_id = $term->term_id;
		$datas = get_term_meta( $term_id, 'ts_product_color_config', true );
		
		if ( $datas ) {
			$datas = maybe_unserialize( $datas );
		} else {
			$datas = array(
				'ts_color_color' => '#ffffff',
				'ts_color_image' => 0
			);
		}
		
		$color = isset( $datas['ts_color_color'] ) ? $datas['ts_color_color'] : '#ffffff';
		$image_id = isset( $datas['ts_color_image'] ) ? absint( $datas['ts_color_image'] ) : 0;
		$image_url = '';
		
		if ( $image_id ) {
			$image_url = wp_get_attachment_image_url( $image_id, 'thumbnail' );
		}
		?>
		<tr class="form-field term-color-color-wrap">
			<th scope="row">
				<label for="ts_color_color"><?php esc_html_e( 'Color', 'woocommerce' ); ?></label>
			</th>
			<td>
				<input type="text" name="ts_color_color" id="ts_color_color" value="<?php echo esc_attr( $color ); ?>" class="ts-color-picker" />
				<p class="description"><?php esc_html_e( 'Select a color for this attribute term.', 'woocommerce' ); ?></p>
			</td>
		</tr>
		
		<tr class="form-field term-color-image-wrap">
			<th scope="row">
				<label><?php esc_html_e( 'Color Image', 'woocommerce' ); ?></label>
			</th>
			<td>
				<div id="ts_color_image_preview" style="margin-bottom: 10px;">
					<?php if ( $image_url ) : ?>
						<img src="<?php echo esc_url( $image_url ); ?>" style="max-width: 30px; max-height: 30px;" class="ts_color_preview_image" />
					<?php else : ?>
						<img src="" style="max-width: 30px; max-height: 30px; display: none;" class="ts_color_preview_image" />
					<?php endif; ?>
				</div>
				<input type="hidden" name="ts_color_image" id="ts_color_image" value="<?php echo esc_attr( $image_id ); ?>" />
				<button type="button" class="button ts-upload-color-image"><?php esc_html_e( 'Upload Image', 'woocommerce' ); ?></button>
				<button type="button" class="button ts-remove-color-image" style="<?php echo $image_id ? '' : 'display: none;'; ?>"><?php esc_html_e( 'Remove Image', 'woocommerce' ); ?></button>
				<p class="description"><?php esc_html_e( 'Upload an image for this color. If an image is uploaded, it will be used instead of the color.', 'woocommerce' ); ?></p>
			</td>
		</tr>
		<?php
	}
	
	/**
	 * Save color fields
	 */
	public function save_color_fields( $term_id, $tt_id ) {
		if ( isset( $_POST['ts_color_color'] ) ) {
			$color = sanitize_hex_color( $_POST['ts_color_color'] );
			if ( ! $color ) {
				$color = '#ffffff';
			}
		} else {
			$color = '#ffffff';
		}
		
		if ( isset( $_POST['ts_color_image'] ) ) {
			$image_id = absint( $_POST['ts_color_image'] );
		} else {
			$image_id = 0;
		}
		
		$datas = array(
			'ts_color_color' => $color,
			'ts_color_image' => $image_id
		);
		
		update_term_meta( $term_id, 'ts_product_color_config', maybe_serialize( $datas ) );
	}
	
	/**
	 * Enqueue admin scripts and styles
	 */
	public function enqueue_admin_assets( $hook ) {
		// Only load on taxonomy term pages
		if ( $hook != 'edit-tags.php' && $hook != 'term.php' ) {
			return;
		}
		
		// Check if we're on a product attribute taxonomy page
		$screen = get_current_screen();
		if ( ! $screen || strpos( $screen->taxonomy, 'pa_' ) !== 0 ) {
			return;
		}
		
		// Enqueue WordPress color picker
		wp_enqueue_style( 'wp-color-picker' );
		wp_enqueue_script( 'wp-color-picker' );
		
		// Enqueue WordPress media uploader
		wp_enqueue_media();
		
		// Add inline CSS
		wp_add_inline_style( 'wp-color-picker', '
			.ts_color_preview_image {
				margin-bottom: 5px;
				width: 30px;
				height: 30px;
				border: 1px solid #ddd;
			}
			.term-color-image-wrap .button {
				margin-right: 5px;
			}
		' );
		
		// Add inline JavaScript
		wp_add_inline_script( 'wp-color-picker', '
			jQuery(document).ready(function($) {
				// Initialize color picker
				if ($.fn.wpColorPicker) {
					$(".ts-color-picker").wpColorPicker();
				}
				
				// Handle image upload
				var file_frame;
				var upload_button = $(".ts-upload-color-image");
				var remove_button = $(".ts-remove-color-image");
				var image_input = $("#ts_color_image");
				var image_preview = $(".ts_color_preview_image");
				
				upload_button.on("click", function(e) {
					e.preventDefault();
					
					if (file_frame) {
						file_frame.open();
						return;
					}
					
					file_frame = wp.media({
						title: "Select Color Image",
						button: {
							text: "Use this image"
						},
						multiple: false
					});
					
					file_frame.on("select", function() {
						var attachment = file_frame.state().get("selection").first().toJSON();
						image_input.val(attachment.id);
						
						if (attachment.sizes && attachment.sizes.thumbnail) {
							image_preview.attr("src", attachment.sizes.thumbnail.url).show();
						} else {
							image_preview.attr("src", attachment.url).show();
						}
						
						remove_button.show();
					});
					
					file_frame.open();
				});
				
				// Handle image removal
				remove_button.on("click", function(e) {
					e.preventDefault();
					image_input.val("");
					image_preview.attr("src", "").hide();
					$(this).hide();
				});
			});
		' );
	}
	
}

// Initialize the class
new WC_Color_Attribute_Standalone();

