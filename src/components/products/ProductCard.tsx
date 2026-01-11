'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist';
import type { Product, ProductVariation } from '@/lib/types';

// Prefetch queue - shared across all cards
const prefetchedUrls = new Set<string>();
const prefetchQueue: string[] = [];
let isPrefetching = false;

// Process prefetch queue during idle time
const processPrefetchQueue = () => {
  if (isPrefetching || prefetchQueue.length === 0) return;
  
  isPrefetching = true;
  
  const processNext = () => {
    const url = prefetchQueue.shift();
    if (!url) {
      isPrefetching = false;
      return;
    }
    
    if (prefetchedUrls.has(url)) {
      // Already prefetched, skip to next
      if ('requestIdleCallback' in window) {
        requestIdleCallback(processNext, { timeout: 1000 });
      } else {
        setTimeout(processNext, 100);
      }
      return;
    }
    
    // Create invisible link to trigger prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
    prefetchedUrls.add(url);
    
    // Process next after a small delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(processNext, { timeout: 2000 });
    } else {
      setTimeout(processNext, 200);
    }
  };
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(processNext, { timeout: 1000 });
  } else {
    setTimeout(processNext, 100);
  }
};

// Color mapping for visual display (fallback when no image)
const colorMap: Record<string, string> = {
  'לבן': '#FFFFFF',
  'לבן מט': '#F8F8F8',
  'שחור': '#000000',
  'שחור מט': '#1a1a1a',
  'אפור': '#808080',
  'אפור מט': '#6b6b6b',
  'אגוז': '#5D4037',
  'אגוז אמריקאי': '#6D4C41',
  'אלון': '#C4A35A',
  'אלון טבעי': '#D4B896',
  'אבן': '#B8B5A8',
  'עץ טבעי': '#DEB887',
  'טבעי': '#E8DCC4',
  'וונגה': '#3E2723',
  'אפור בטון': '#9E9E9E',
  'כחול': '#3B82F6',
  'ירוק': '#22C55E',
  'אדום': '#EF4444',
  'ורוד': '#EC4899',
  'סגול': '#8B5CF6',
  'צהוב': '#EAB308',
  'כתום': '#F97316',
  'בז\'': '#D4C4B0',
  'קרם': '#FFFDD0',
  'חום': '#8B4513',
};

// Get color value for display
const getColorStyle = (colorName: string): React.CSSProperties => {
  const lowerName = colorName.toLowerCase();
  
  for (const [key, value] of Object.entries(colorMap)) {
    if (lowerName.includes(key.toLowerCase())) {
      return { backgroundColor: value };
    }
  }
  
  return { 
    background: 'linear-gradient(135deg, #DEB887 50%, #8B7355 50%)' 
  };
};

interface ProductCardProps {
  product: Product;
}

// Client-side cache for variation images (shared across all ProductCard instances)
const variationImageCache = new Map<string, string | null>();
const pendingFetches = new Map<string, Promise<string | null>>();

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist, isHydrated } = useWishlistStore();
  const isWishlisted = isHydrated && isInWishlist(product.id);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [variationImage, setVariationImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  
  // Get unique colors from variations (deduplicate by colorName)
  const uniqueColors = useMemo(() => {
    const variations = product.variations || [];
    const seenColors = new Set<string>();
    const unique: ProductVariation[] = [];
    
    for (const v of variations) {
      const colorName = v.colorName?.trim();
      if (colorName && !seenColors.has(colorName)) {
        seenColors.add(colorName);
        unique.push(v);
      }
    }
    
    return unique;
  }, [product.variations]);
  
  // Fetch variation image (with cache)
  const fetchVariationImage = async (colorName: string): Promise<string | null> => {
    const cacheKey = `${product.databaseId}-${colorName}`;
    
    // Check cache first
    if (variationImageCache.has(cacheKey)) {
      return variationImageCache.get(cacheKey) || null;
    }
    
    // Check if already fetching
    if (pendingFetches.has(cacheKey)) {
      return pendingFetches.get(cacheKey)!;
    }
    
    // Start fetch
    const fetchPromise = (async () => {
      try {
        const response = await fetch(`/api/variation-image?productId=${product.databaseId}&colorName=${encodeURIComponent(colorName)}`);
        const data = await response.json();
        const image = data.image || null;
        variationImageCache.set(cacheKey, image);
        return image;
      } catch {
        variationImageCache.set(cacheKey, null);
        return null;
      } finally {
        pendingFetches.delete(cacheKey);
      }
    })();
    
    pendingFetches.set(cacheKey, fetchPromise);
    return fetchPromise;
  };
  
  // Reference to card element
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Queue prefetch when card becomes visible
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const productUrl = `/product/${product.slug}`;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Add to prefetch queue (will be processed during idle time)
          if (!prefetchedUrls.has(productUrl) && !prefetchQueue.includes(productUrl)) {
            prefetchQueue.push(productUrl);
            processPrefetchQueue();
          }
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start queueing before visible
    );
    
    observer.observe(card);
    return () => observer.disconnect();
  }, [product.slug]);
  
  // Prefetch on hover (for desktop) - removed auto-prefetch to avoid blocking clicks
  const handleColorHover = (colorName: string) => {
    fetchVariationImage(colorName);
  };
  
  // Handle color click
  const handleColorClick = async (colorName: string) => {
    if (selectedColor === colorName) {
      setSelectedColor(null);
      setVariationImage(null);
      return;
    }
    
    setSelectedColor(colorName);
    
    const cacheKey = `${product.databaseId}-${colorName}`;
    if (variationImageCache.has(cacheKey)) {
      // Already cached - instant switch
      setVariationImage(variationImageCache.get(cacheKey) || null);
    } else {
      // Not cached yet - show loading
      setIsLoadingImage(true);
      const image = await fetchVariationImage(colorName);
      setVariationImage(image);
      setIsLoadingImage(false);
    }
  };
  
  // Fallback to color options from attributes if no variations
  const colorAttribute = product.attributes?.nodes?.find(
    attr => {
      const name = attr.name.toLowerCase();
      return name === 'צבע' || name === 'בחרו צבע' || name === 'color' || 
             name.includes('צבע') || name.includes('color');
    }
  );
  const colorOptions = colorAttribute?.options || [];
  
  // Use unique colors from variations if available
  const hasColors = uniqueColors.length > 0;

  const wishlistItem = {
    id: product.id,
    databaseId: product.databaseId,
    name: product.name,
    slug: product.slug,
    price: product.price,
    regularPrice: product.regularPrice,
    salePrice: product.salePrice,
    onSale: product.onSale,
    image: product.image,
  };
  
  const hasDiscount = product.onSale && product.regularPrice && product.salePrice;
  
  // Calculate discount percentage
  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(product.regularPrice!.replace(/[^\d.]/g, '')) -
          parseFloat(product.salePrice!.replace(/[^\d.]/g, ''))) /
          parseFloat(product.regularPrice!.replace(/[^\d.]/g, ''))) *
          100
      )
    : 0;

  // Get display image - use variation image if loaded
  const displayImage = variationImage || product.image?.sourceUrl;
  const displayImageAlt = product.image?.altText || product.name;

  return (
    <div ref={cardRef} className="group">
      {/* Image Container */}
      <div className="relative aspect-square bg-[#f5f5f0] rounded-[20px] rounded-tl-none overflow-hidden mb-3">
        {/* Clickable link - supports right-click and open in new tab */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`צפה במוצר ${product.name}`}
        />
        
        {/* Product Image */}
        {displayImage ? (
          <img
            src={displayImage}
            alt={displayImageAlt}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${isLoadingImage ? 'opacity-50' : ''}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            אין תמונה
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoadingImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Sale Badge - Top Right */}
        {hasDiscount && discountPercentage > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-[#e1eadf] text-[#4a7c59] text-xs font-english tracking-wider px-3 py-1.5 rounded-full">
              {discountPercentage}%- OFF
            </span>
          </div>
        )}

        {/* Bottom Left Corner Cover */}
        <div className="absolute bottom-0 left-0 w-[72px] h-[72px] z-10">
          <Image
            src="/images/bg-1.png"
            alt=""
            width={72}
            height={72}
            className="w-full h-full"
          />
        </div>

        {/* Wishlist Heart - bottom left corner */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem(wishlistItem);
          }}
          className="absolute bottom-1.5 left-1.5 w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform z-20 cursor-pointer"
          style={{ backgroundColor: '#D7CEBF' }}
          aria-label={isWishlisted ? `הסר ${product.name} מהמועדפים` : `הוסף ${product.name} למועדפים`}
          aria-pressed={isWishlisted}
        >
          <Heart 
            className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-white'}`} 
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="text-center space-y-2">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`} className="w-full block text-center">
          <h3 className="font-medium text-base hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">החל מ-₪</span>
          <span className="font-bold text-lg">
            {product.price.replace('₪', '').trim()}
          </span>
        </div>

        {/* Available Colors - click to change product image */}
        {hasColors ? (
          <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
            {/* Show 4 on mobile, 6 on desktop */}
            {uniqueColors.slice(0, 6).map((variation, index) => {
              // Only use swatchImage for the circle (NOT the variation product image)
              const swatchImageUrl = variation.swatchImage;
              const hasSwatchImage = !!swatchImageUrl;
              const isSelected = selectedColor === variation.colorName;
              
              return (
                <button
                  key={variation.id}
                  onClick={() => handleColorClick(variation.colorName || '')}
                  onMouseEnter={() => handleColorHover(variation.colorName || '')}
                  disabled={isLoadingImage}
                  className={`relative rounded-full overflow-hidden border shadow-sm cursor-pointer transition-all w-7 h-7 ${
                    isSelected 
                      ? 'ring-2 ring-black ring-offset-1 border-black' 
                      : 'border-gray-200 hover:border-gray-400'
                  } ${index >= 4 ? 'hidden md:block' : ''} ${isLoadingImage ? 'opacity-50' : ''}`}
                  aria-label={`בחר צבע ${variation.colorName || ''}`}
                  aria-pressed={isSelected}
                >
                  {hasSwatchImage ? (
                    <Image
                      src={swatchImageUrl}
                      alt={variation.colorName || ''}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={getColorStyle(variation.colorName || '')}
                    />
                  )}
                </button>
              );
            })}
            {/* Show +X count - different for mobile vs desktop */}
            {uniqueColors.length > 4 && (
              <span className="text-xs text-muted-foreground font-medium ml-1 md:hidden">
                +{uniqueColors.length - 4}
              </span>
            )}
            {uniqueColors.length > 6 && (
              <span className="text-xs text-muted-foreground font-medium ml-1 hidden md:inline">
                +{uniqueColors.length - 6}
              </span>
            )}
          </div>
        ) : colorOptions.length > 0 ? (
          // Fallback to color attributes
          <div className="flex items-center justify-center gap-2 pt-3">
            {colorOptions.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-7 h-7 rounded-full border border-gray-200 shadow-sm"
                style={getColorStyle(color)}
                title={color}
              />
            ))}
            {colorOptions.length > 5 && (
              <span className="text-xs text-muted-foreground font-medium">+{colorOptions.length - 5}</span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
