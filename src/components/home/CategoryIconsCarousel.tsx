'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryIcon {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  link: string;
}

interface CategoryIconsCarouselProps {
  categories?: CategoryIcon[];
}

// Default categories with placeholders
const defaultCategories: CategoryIcon[] = [
  { id: 1, name: 'פינות אוכל', slug: 'dining-tables', link: '/product-category/dining-tables' },
  { id: 2, name: 'קונסולות', slug: 'consoles', link: '/product-category/consoles' },
  { id: 3, name: 'ספריות', slug: 'bookcases', link: '/product-category/bookcases' },
  { id: 4, name: 'קומודות', slug: 'dressers', link: '/product-category/dressers' },
  { id: 5, name: 'NALLA SALE', slug: 'sale', link: '/product-category/sale' },
  { id: 6, name: 'שולחנות סלון', slug: 'coffee-tables', link: '/product-category/coffee-tables' },
  { id: 7, name: 'מזנונים', slug: 'tv-stands', link: '/product-category/tv-stands' },
  { id: 8, name: 'שולחנות משרד', slug: 'office-desks', link: '/product-category/office-desks' },
];

// Placeholder SVG component
function PlaceholderIcon() {
  return (
    <svg 
      className="w-8 h-8 text-[#c4a882]" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1} 
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
      />
    </svg>
  );
}

export function CategoryIconsCarousel({ categories: propCategories }: CategoryIconsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [categories, setCategories] = useState<CategoryIcon[]>(propCategories || defaultCategories);

  // Fetch categories from API
  useEffect(() => {
    if (propCategories) return;
    
    async function fetchCategories() {
      try {
        // Use local API route to avoid CORS issues
        const res = await fetch('/api/category-icons');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.icons?.length > 0) {
            setCategories(data.icons);
          }
        }
      } catch (error) {
        console.error('Failed to fetch category icons:', error);
      }
    }
    
    fetchCategories();
  }, [propCategories]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // RTL: scrollLeft is negative or 0
      const maxScroll = scrollWidth - clientWidth;
      setCanScrollRight(Math.abs(scrollLeft) > 10);
      setCanScrollLeft(Math.abs(scrollLeft) < maxScroll - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1300px] mx-auto px-2 md:px-4 py-3 md:py-6">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${
              canScrollRight 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                : 'text-gray-300 cursor-default'
            }`}
            disabled={!canScrollRight}
            aria-label="הקודם"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Categories Container - spread across full width */}
          <div
            ref={scrollRef}
            className="flex-1 flex justify-between overflow-x-auto scrollbar-hide gap-1 md:gap-0"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.link}
                className="flex flex-col items-center gap-1 md:gap-2 min-w-[60px] md:min-w-[80px] group"
              >
                {/* Icon Container */}
                <div className="relative w-10 h-10 md:w-16 md:h-16 flex items-center justify-center transition-transform group-hover:scale-105">
                  {category.icon ? (
                    // Use img tag for better SVG support
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-9 h-9 md:w-14 md:h-14 object-contain"
                    />
                  ) : (
                    <PlaceholderIcon />
                  )}
                </div>
                {/* Category Name */}
                <span className="text-[10px] md:text-xs text-gray-600 text-center whitespace-nowrap group-hover:text-gray-900 transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${
              canScrollLeft 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                : 'text-gray-300 cursor-default'
            }`}
            disabled={!canScrollLeft}
            aria-label="הבא"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
