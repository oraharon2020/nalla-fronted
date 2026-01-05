'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import type { Product } from '@/lib/types';

interface CategoryFiltersProps {
  products: Product[];
}

type PriceRange = 'all' | 'under-2000' | '2000-5000' | '5000-10000' | 'over-10000';
type SortOption = 'default' | 'price-low' | 'price-high' | 'newest';

const priceRanges: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'under-2000', label: 'עד ₪2,000' },
  { value: '2000-5000', label: '₪2,000 - ₪5,000' },
  { value: '5000-10000', label: '₪5,000 - ₪10,000' },
  { value: 'over-10000', label: 'מעל ₪10,000' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'מומלץ' },
  { value: 'price-low', label: 'מחיר: נמוך לגבוה' },
  { value: 'price-high', label: 'מחיר: גבוה לנמוך' },
  { value: 'newest', label: 'חדשים ביותר' },
];

// Extract numeric price from string like "₪1,234" or "1234"
function extractPrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}

export function CategoryFilters({ products }: CategoryFiltersProps) {
  const [priceFilter, setPriceFilter] = useState<PriceRange>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply price filter
    if (priceFilter !== 'all') {
      result = result.filter((product) => {
        const price = extractPrice(product.price);
        switch (priceFilter) {
          case 'under-2000':
            return price < 2000;
          case '2000-5000':
            return price >= 2000 && price < 5000;
          case '5000-10000':
            return price >= 5000 && price < 10000;
          case 'over-10000':
            return price >= 10000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
        break;
      case 'newest':
        // Sort by database ID (higher ID = newer product)
        result.sort((a, b) => (b.databaseId || 0) - (a.databaseId || 0));
        break;
      default:
        // Keep original order (recommended/default)
        break;
    }

    return result;
  }, [products, priceFilter, sortBy]);

  const activeFiltersCount = (priceFilter !== 'all' ? 1 : 0);

  return (
    <>
      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-2 md:gap-4 mb-6 pb-4 border-b">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Price Filter */}
          <div className="relative">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as PriceRange)}
              className="appearance-none bg-white border border-gray-200 rounded-full px-3 py-1.5 pl-6 md:px-4 md:py-2 md:pl-8 text-xs md:text-sm text-center cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  מחיר: {range.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                setPriceFilter('all');
              }}
              className="text-xs md:text-sm text-gray-500 hover:text-black transition-colors underline"
            >
              נקה
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Results Count - Hidden on mobile */}
          <span className="hidden md:inline text-sm text-gray-500">
            {filteredProducts.length} מוצרים
          </span>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-gray-200 rounded-full px-3 py-1.5 pl-6 md:px-4 md:py-2 md:pl-8 text-xs md:text-sm text-center cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  מיון: {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">לא נמצאו מוצרים בטווח המחירים הזה</p>
          <button
            onClick={() => setPriceFilter('all')}
            className="text-sm text-black underline hover:no-underline"
          >
            הצג את כל המוצרים
          </button>
        </div>
      )}
    </>
  );
}
