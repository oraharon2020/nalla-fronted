import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://nalla.co.il/wp-json/bellano/v1/navigation', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch navigation');
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Navigation API error:', error);
    // Return default navigation on error
    return NextResponse.json([
      { name: 'בית', link: '/', highlight: false, has_mega_menu: false },
      { name: 'NALLA SALE', link: '/product-category/sale', highlight: true, has_mega_menu: false },
      { name: 'חללי מגורים', link: '#', highlight: false, has_mega_menu: true },
      { name: 'SHOWROOM', link: '/showroom', highlight: false, has_mega_menu: false },
      { name: 'בלוג', link: '/blog', highlight: false, has_mega_menu: false },
      { name: 'יצירת קשר', link: '/contact', highlight: false, has_mega_menu: false },
      { name: 'צביעה בתנור', link: '/tambour-color', highlight: false, has_mega_menu: false },
    ]);
  }
}
