import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || siteConfig.wordpressUrl;

export async function GET() {
  try {
    const response = await fetch(`${WP_URL}/wp-json/bellano/v1/mobile-menu`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      // Return default menu if API fails
      return NextResponse.json(getDefaultMenu());
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching mobile menu:', error);
    return NextResponse.json(getDefaultMenu());
  }
}

function getDefaultMenu() {
  return {
    items: [
      {
        title: 'סלון',
        url: '/product-category/living-room',
        icon: '🛋️',
        has_submenu: true,
        submenu: [
          { title: 'מזנונים', url: '/product-category/tv-units', icon: '📺' },
          { title: 'שולחנות סלון', url: '/product-category/coffee-tables', icon: '☕' },
          { title: 'ספריות', url: '/product-category/bookcases', icon: '📚' },
          { title: 'קונסולות', url: '/product-category/consoles', icon: '🪞' },
        ]
      },
      {
        title: 'חדר שינה',
        url: '/product-category/bedroom',
        icon: '🛏️',
        has_submenu: true,
        submenu: [
          { title: 'קומודות', url: '/product-category/dressers', icon: '🗄️' },
          { title: 'שידות', url: '/product-category/nightstands', icon: '🛏️' },
        ]
      },
      {
        title: 'פינת אוכל',
        url: '/product-category/dining-room',
        icon: '🍽️',
        has_submenu: false,
        submenu: []
      },
      {
        title: 'NALLA SALE',
        url: '/product-category/sale',
        icon: '🏷️',
        has_submenu: false,
        submenu: []
      },
    ],
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
  };
}
