import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const res = await fetch(`${siteConfig.wordpressUrl}/wp-json/bellano/v1/announcements`, {
      next: { revalidate: 300 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch announcements');
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log('Announcements API error:', error);
    // Return default announcements
    return NextResponse.json({
      enabled: true,
      interval: 5000,
      announcements: [
        {
          text: 'מגוון מוצרים בהנחות ענק בקטגוריית NALLA SALE בין 20% ל-50% הנחה!',
          link: '/product-category/nalla-sale',
          bg_color: '#e1eadf',
          text_color: '#4a7c59',
        },
      ],
    });
  }
}
