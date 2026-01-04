'use server';

import { siteConfig } from '@/config/site';

const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || siteConfig.wordpressUrl;

interface CartItem {
  productId: number;
  quantity: number;
  variationId?: number;
}

/**
 * Generate a URL that adds multiple products to WooCommerce cart
 * Uses the classic ?add-to-cart format that WooCommerce supports
 */
export async function getWooCommerceCheckoutUrl(items: CartItem[]): Promise<string> {
  if (items.length === 0) {
    return `${WOO_URL}/checkout`;
  }

  // For single item - use simple format
  if (items.length === 1) {
    const item = items[0];
    const productId = item.variationId || item.productId;
    return `${WOO_URL}/?add-to-cart=${productId}&quantity=${item.quantity}`;
  }

  // For multiple items - we need to redirect through a custom endpoint
  // Or add items one by one. Let's use query params approach
  // WooCommerce supports: /cart/?add-to-cart=ID
  
  // Best approach: Add first item, then redirect to cart with others queued
  // This is a limitation of WooCommerce - it doesn't support multiple add-to-cart in one URL
  
  // Workaround: Create a simple page that adds all items via JS
  const itemsParam = encodeURIComponent(JSON.stringify(items.map(i => ({
    id: i.variationId || i.productId,
    qty: i.quantity
  }))));
  
  return `${WOO_URL}/?nalla_cart=${itemsParam}`;
}
