import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || siteConfig.wordpressUrl;

interface WPMenuItem {
  title: string;
  url: string;
  icon?: string;
  children?: WPMenuItem[];
  submenu?: WPMenuItem[];
}

interface MenuItem {
  title: string;
  url: string;
  icon?: string;
  children?: MenuItem[];
}

// Normalize menu items to always use 'children' instead of 'submenu'
function normalizeMenuItems(items: WPMenuItem[]): MenuItem[] {
  return items.map(item => ({
    title: item.title,
    url: item.url,
    icon: item.icon,
    children: item.children?.length 
      ? normalizeMenuItems(item.children)
      : item.submenu?.length 
        ? normalizeMenuItems(item.submenu)
        : undefined
  }));
}

export async function GET() {
  try {
    const response = await fetch(`${WP_URL}/wp-json/bellano/v1/mobile-menu`, {
      next: { 
        revalidate: 60, // Cache for 1 minute
        tags: ['mobile-menu', 'woocommerce']
      },
    });

    if (!response.ok) {
      // Return default menu if API fails
      return NextResponse.json(getDefaultMenu());
    }

    const data = await response.json();
    
    // Normalize the data to use 'children' consistently
    const normalizedData = {
      ...data,
      items: data.items ? normalizeMenuItems(data.items) : []
    };
    
    return NextResponse.json(normalizedData);
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
        children: [
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
        children: [
          { title: 'קומודות', url: '/product-category/dressers', icon: '🗄️' },
          { title: 'שידות', url: '/product-category/nightstands', icon: '🛏️' },
        ]
      },
      {
        title: 'פינת אוכל',
        url: '/product-category/dining-room',
        icon: '🍽️',
      },
      {
        title: 'NALLA SALE',
        url: '/product-category/sale',
        icon: '🏷️',
      },
    ],
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
  };
}
