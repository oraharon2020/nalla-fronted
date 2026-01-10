import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://admin.nalla.co.il/wp-json/bellano/v1/footer', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch footer');
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Footer API error:', error);
    // Return default footer on error
    return NextResponse.json({
      contact: {
        phone: ' 03-3732350',
        address: 'אברהם בומה שביט 1 ראשון לציון, אולם F-101',
        facebook: 'https://www.facebook.com/nollaisrael',
        instagram: 'https://www.instagram.com/nalla_decor',
      },
      hours: {
        showroom_title: 'Show-room ומוקד מכירות',
        showroom_weekdays: 'ימים א-ה: 10:00 - 20:00',
        showroom_friday: 'שישי: 10:00 - 14:00',
        service_title: 'שירות לקוחות',
        service_hours: 'ימים א-ה: 10:00 - 16:00',
      },
      links_col1: [
        { name: 'אודות', href: '/about' },
        { name: 'אחריות המוצרים', href: '/page/warranty' },
        { name: 'בלוג', href: '/blog' },
        { name: 'יצירת קשר', href: '/contact' },
      ],
      links_col2: [
        { name: 'תקנון האתר', href: '/page/terms' },
        { name: 'תקנון משלוחים', href: '/page/shipping' },
        { name: 'הצהרת נגישות', href: '/accessibility' },
        { name: 'מדיניות פרטיות', href: '/page/privacy-policy' },
      ],
    });
  }
}
