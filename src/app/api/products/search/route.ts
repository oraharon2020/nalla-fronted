import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const perPage = searchParams.get('per_page') || '12';
  
  console.log('Search API called with query:', query);
  
  if (!query) {
    return NextResponse.json({ products: [] });
  }

  try {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || siteConfig.wordpressUrl;
    
    // Use our custom Bellano search endpoint for better Hebrew support
    const url = new URL(`${wpUrl}/wp-json/bellano/v1/search`);
    url.searchParams.append('q', query);
    url.searchParams.append('per_page', perPage);

    console.log('Fetching from Bellano search...');
    
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Bellano search response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bellano search API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Search API error: ${response.status}`, products: [] },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Got', data.products?.length || 0, 'products from Bellano search');
    
    return NextResponse.json({ 
      products: data.products || [],
      total: data.total || 0,
    });
  } catch (error) {
    console.error('Product search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search products', products: [] },
      { status: 500 }
    );
  }
}
