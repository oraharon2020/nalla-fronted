'use server';

import { searchProducts } from '@/lib/woocommerce/api';

export interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string | null;
}

export async function searchProductsAction(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const products = await searchProducts(query, 8);
    
    return products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price ? `₪${p.price}` : '',
      image: p.images?.[0]?.src || null,
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
