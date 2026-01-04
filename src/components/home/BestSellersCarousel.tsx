'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist';

interface ProductSwatch {
  name: string;
  color: string;
}

interface Product {
  id: number | string;
  databaseId?: number;
  name: string;
  slug: string;
  price: string;
  regularPrice?: string;
  onSale: boolean;
  image?: { sourceUrl: string };
  swatches?: ProductSwatch[];
  categories?: { name: string }[];
  isNew?: boolean;
  salePercent?: number;
}

interface BestSellersCarouselProps {
  products: Product[];
  title?: string;
}

export function BestSellersCarousel({ products, title = 'OUR BEST SELLERS' }: BestSellersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { toggleItem, isInWishlist, isHydrated } = useWishlistStore();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Calculate sale percentage
  const getSalePercent = (regular: string, sale: string): number => {
    const regularNum = parseFloat(regular.replace(/[^\d.]/g, ''));
    const saleNum = parseFloat(sale.replace(/[^\d.]/g, ''));
    if (regularNum && saleNum) {
      return Math.round(((regularNum - saleNum) / regularNum) * 100);
    }
    return 0;
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-english text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
            {title}
          </h2>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="הקודם"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-700'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="הבא"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            const salePercent = product.onSale && product.regularPrice 
              ? getSalePercent(product.regularPrice, product.price)
              : 0;
            const categoryName = product.categories?.[0]?.name || '';
            const isNew = product.isNew || false;

            return (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px] md:w-[300px] group"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-[#f5f5f0] mb-4 rounded-[20px] rounded-tl-none">
                  <Link href={`/product/${product.slug}`}>
                    {product.image && (
                      <Image
                        src={product.image.sourceUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        sizes="300px"
                        quality={75}
                      />
                    )}
                  </Link>
                  
                  {/* Badge - Sale or New */}
                  {(salePercent > 0 || isNew) && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#e1eadf] text-[#4a7c59] text-xs font-english tracking-wider px-4 py-2 rounded-full">
                        {salePercent > 0 ? `UP TO -${salePercent}% OFF` : 'NEW COLLECTION'}
                      </span>
                    </div>
                  )}
                  
                  {/* Bottom Left Corner Cover */}
                  <div className="absolute bottom-0 left-0 w-20 h-20">
                    <Image
                      src="https://nalla.co.il/wp-content/uploads/2025/09/bg-1.png"
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Wishlist Heart - bottom left corner */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const productId = product.databaseId || (typeof product.id === 'number' ? product.id : parseInt(String(product.id)));
                      toggleItem({
                        id: String(product.id),
                        databaseId: productId,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        regularPrice: product.regularPrice,
                        onSale: product.onSale,
                        image: product.image ? { sourceUrl: product.image.sourceUrl } : undefined,
                      });
                    }}
                    className="absolute bottom-0 left-0 m-2 w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm z-20 cursor-pointer"
                    style={{ backgroundColor: '#D7CEBF' }}
                    aria-label={isHydrated && isInWishlist(String(product.id)) ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
                  >
                    <Heart 
                      className={`w-5 h-5 ${isHydrated && isInWishlist(String(product.id)) ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                    />
                  </button>
                </div>
                
                {/* Product Info */}
                <div className="space-y-2 text-center">
                  {/* Category */}
                  {categoryName && (
                    <p className="text-gray-400 text-xs">{categoryName}</p>
                  )}
                  
                  {/* Product Name */}
                  <Link href={`/product/${product.slug}`}>
                    {(() => {
                      const cleanName = product.name.replace(/[""״׳']/g, '');
                      // Check if text contains Hebrew characters
                      const hasHebrew = /[\u0590-\u05FF]/.test(cleanName);
                      return (
                        <h3 
                          className="font-light tracking-wide group-hover:text-gray-600 transition-colors"
                          style={{ 
                            fontSize: hasHebrew ? '1.25rem' : '1.875rem',
                            fontFamily: hasHebrew ? 'inherit' : 'var(--font-amandine), serif'
                          }}
                        >
                          {cleanName}
                        </h3>
                      );
                    })()}
                  </Link>
                  
                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-gray-500">החל מ-</span>
                    {product.onSale && product.regularPrice && (
                      <span className="text-gray-400 line-through">
                        {product.regularPrice}
                      </span>
                    )}
                    <span className="font-bold">{product.price}</span>
                  </div>
                  
                  {/* Color Swatches */}
                  {product.swatches && product.swatches.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 pt-2">
                      {product.swatches.slice(0, 5).map((swatch, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: swatch.color }}
                          title={swatch.name}
                        />
                      ))}
                      {product.swatches.length > 5 && (
                        <span className="text-xs text-gray-400">
                          +{product.swatches.length - 5} סגנונות נוספים
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
