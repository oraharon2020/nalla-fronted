'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/lib/store/wishlist';
import type { Product, ProductVariation } from '@/lib/types';

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

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist, isHydrated } = useWishlistStore();
  const isWishlisted = isHydrated && isInWishlist(product.id);
  
  // Get variations with images (for clickable swatches)
  const variationsWithImages = useMemo(() => {
    const variations = product.variations || [];
    // Filter variations that have either an image or a color name
    return variations.filter(v => v.image?.sourceUrl || v.colorName);
  }, [product.variations]);

  // Selected variation state
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);

  // Current image to display - either selected variation image or product default
  const currentImage = selectedVariation?.image || product.image;
  
  // Fallback to color options from attributes if no variations with images
  const colorAttribute = product.attributes?.nodes?.find(
    attr => attr.name === 'צבע' || attr.name === 'color' || attr.name.toLowerCase().includes('color')
  );
  const colorOptions = colorAttribute?.options || [];
  
  // Use variations if available, otherwise use color attributes
  const hasVariationImages = variationsWithImages.length > 0;

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

  // Handle variation click - changes the displayed image
  const handleVariationClick = (variation: ProductVariation, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle off if clicking the same variation
    setSelectedVariation(selectedVariation?.id === variation.id ? null : variation);
  };

  return (
    <div className="group">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
        <Link href={`/product/${product.slug}`}>
          {currentImage?.sourceUrl ? (
            <Image
              src={currentImage.sourceUrl}
              alt={currentImage.altText || product.name}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              אין תמונה
            </div>
          )}
        </Link>

        {/* Discount Badge */}
        {hasDiscount && discountPercentage > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {discountPercentage}%-
          </Badge>
        )}

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-3 left-3 bg-transparent hover:bg-transparent p-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem(wishlistItem);
          }}
        >
          <Heart 
            className={`h-6 w-6 transition-colors ${
              isWishlisted 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400 hover:text-gray-600'
            }`} 
          />
        </Button>
      </div>

      {/* Product Info */}
      <div className="text-center space-y-2">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
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

        {/* Color Variations with Images - clickable to change product image */}
        {hasVariationImages ? (
          <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
            {/* Show 4 on mobile, 6 on desktop */}
            {variationsWithImages.slice(0, 6).map((variation, index) => {
              const isSelected = selectedVariation?.id === variation.id;
              // Use swatchImage for the circle, or fallback to variation image
              const swatchImageUrl = variation.swatchImage || variation.image?.sourceUrl;
              const hasSwatchImage = !!swatchImageUrl;
              
              return (
                <button
                  key={variation.id}
                  onClick={(e) => handleVariationClick(variation, e)}
                  className={`relative rounded-full overflow-hidden transition-all duration-200 cursor-pointer 
                    border border-gray-200 shadow-sm
                    ${isSelected 
                      ? 'ring-2 ring-primary ring-offset-2 scale-110 border-primary' 
                      : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 hover:scale-105'
                    } ${index >= 4 ? 'hidden md:block' : ''}`}
                  title={variation.colorName || ''}
                  style={{ width: 32, height: 32 }}
                >
                  {hasSwatchImage ? (
                    <Image
                      src={swatchImageUrl}
                      alt={variation.colorName || ''}
                      fill
                      className="object-cover"
                      sizes="32px"
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
            {variationsWithImages.length > 4 && (
              <span className="text-xs text-muted-foreground font-medium ml-1 md:hidden">
                +{variationsWithImages.length - 4}
              </span>
            )}
            {variationsWithImages.length > 6 && (
              <span className="text-xs text-muted-foreground font-medium ml-1 hidden md:inline">
                +{variationsWithImages.length - 6}
              </span>
            )}
          </div>
        ) : colorOptions.length > 0 ? (
          // Fallback to color attributes (no image switching)
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
