'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MegaMenuItem {
  name: string;
  description?: string;
  link: string;
  icon_id?: number;
  icon_url?: string;
}

interface FeaturedSection {
  title: string;
  link: string;
  image_id?: number;
  image_url?: string;
  bg_color?: string;
}

interface MegaMenuData {
  living_spaces: MegaMenuItem[];
  featured_sections: FeaturedSection[];
}

// Default data as fallback
const defaultMenuData: MegaMenuData = {
  living_spaces: [
    { name: 'סלון', description: 'כורסאות מעוצבות, שטיחים, מראות ועוד', link: '/product-tag/salon' },
    { name: 'פינת אוכל', description: 'פינות אוכל, כיסאות, שולחנות בר', link: '/product-tag/dining-room' },
    { name: 'חדר אמבטיה', description: 'ארונות שירות, ברזים, כיורים', link: '/product-tag/bathroom' },
    { name: 'חדר שינה', description: 'מיטות, מזרנים, שידות, קומודות', link: '/product-tag/bedroom' },
    { name: 'כניסה', description: 'תמונות קיר, קונסולות, מראות', link: '/product-tag/entrance' },
    { name: 'משרד ביתי', description: 'שולחנות עבודה, כיסאות משרדיים', link: '/product-tag/home-office' },
  ],
  featured_sections: [
    { title: 'עד 50% הנחה', link: '/product-category/sale', bg_color: '#4a7c59' },
    { title: 'ייעוץ עיצוב', link: '/design-assistant', bg_color: '#d7cebf' },
  ],
};

export function MegaMenu() {
  const [menuData, setMenuData] = useState<MegaMenuData>(defaultMenuData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/mega-menu');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Only update if we have data
        if (data.living_spaces?.length > 0 || data.featured_sections?.length > 0) {
          setMenuData({
            living_spaces: data.living_spaces?.length > 0 ? data.living_spaces : defaultMenuData.living_spaces,
            featured_sections: data.featured_sections?.length > 0 ? data.featured_sections : defaultMenuData.featured_sections,
          });
        }
      } catch (error) {
        // Keep default data on error
        console.log('Using default mega menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Emoji icons based on name (fallback when no icon uploaded)
  const getEmoji = (name: string) => {
    const emojiMap: Record<string, string> = {
      'סלון': '🛋️',
      'פינת אוכל': '🪑',
      'חדר אמבטיה': '🚿',
      'חדר שינה': '🛏️',
      'כניסה': '🚪',
      'משרד ביתי': '💼',
      'חדר עבודה': '💼',
      'מטבח': '🍳',
    };
    return emojiMap[name] || '📦';
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="bg-white border rounded-2xl shadow-xl p-6 w-[850px]">
        <div className="flex gap-6">
          {/* Categories List */}
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1">
            {menuData.living_spaces.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f5f0] transition-colors group/item"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {item.icon_url ? (
                    <Image
                      src={item.icon_url}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    getEmoji(item.name)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 group-hover/item:text-[#4a7c59] transition-colors">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          {/* Featured Section */}
          <div className="w-[200px] shrink-0 flex flex-col gap-3">
            {menuData.featured_sections.map((section, index) => {
              const isLight = section.bg_color === '#d7cebf' || section.bg_color === '#fef3c7' || section.bg_color === '#f5ebe0';
              return (
                <Link
                  key={index}
                  href={section.link}
                  className="block relative rounded-xl overflow-hidden flex-1 min-h-[120px] group/featured"
                  style={{ backgroundColor: section.bg_color || '#4a7c59' }}
                >
                  {section.image_url && (
                    <Image
                      src={section.image_url}
                      alt={section.title}
                      fill
                      className="object-cover opacity-50"
                    />
                  )}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>
                    <p className="font-semibold leading-tight">{section.title}</p>
                    <p className={`text-xs mt-1 ${isLight ? 'opacity-80' : 'opacity-90'}`}>לצפייה →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Bottom Link */}
        <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-100">
          <Link href="/categories" className="text-sm text-[#4a7c59] hover:underline transition-colors font-medium">
            לכל הקטגוריות
          </Link>
        </div>
      </div>
    </div>
  );
}
