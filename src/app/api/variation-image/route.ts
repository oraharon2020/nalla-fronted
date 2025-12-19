import { NextRequest, NextResponse } from 'next/server';
import { getProductVariations } from '@/lib/woocommerce/api';

// Cache for variation images
const imageCache = new Map<string, { image: string | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get('productId');
  const colorName = searchParams.get('colorName');

  if (!productId || !colorName) {
    return NextResponse.json({ error: 'Missing productId or colorName' }, { status: 400 });
  }

  const cacheKey = `${productId}-${colorName}`;
  const cached = imageCache.get(cacheKey);
  
  // Return cached result if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json({ image: cached.image });
  }

  try {
    const variations = await getProductVariations(Number(productId));
    
    // Find the variation with matching color
    const variation = variations.find(v => {
      const colorAttr = v.attributes?.find(a => 
        a.name === 'צבע' || a.name === 'color' || a.name === 'pa_color' || a.name === 'pa_color-product'
      );
      return colorAttr?.option?.toLowerCase().trim() === colorName.toLowerCase().trim();
    });

    const image = variation?.image?.src || null;
    
    // Cache the result
    imageCache.set(cacheKey, { image, timestamp: Date.now() });

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Error fetching variation image:', error);
    return NextResponse.json({ error: 'Failed to fetch variation' }, { status: 500 });
  }
}
