'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Color mapping for visual display
const colorMap: Record<string, string> = {
  'לבן': '#FFFFFF',
  'לבן מט': '#FFFFFF',
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
};

// Get color value or gradient for display
const getColorStyle = (colorName: string): React.CSSProperties => {
  const lowerName = colorName.toLowerCase();
  
  // Check for exact match first
  for (const [key, value] of Object.entries(colorMap)) {
    if (lowerName.includes(key.toLowerCase())) {
      return { backgroundColor: value };
    }
  }
  
  // Default gradient for unknown colors
  return { 
    background: 'linear-gradient(135deg, #DEB887 50%, #8B7355 50%)' 
  };
};

interface ProductVariation {
  id: string;
  colorName: string;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
}

interface ProductAttribute {
  name: string;
  options: string[];
}

interface ProductCardProps {
  product: {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
    price: string;
    regularPrice?: string;
    salePrice?: string;
    onSale: boolean;
    image?: {
      sourceUrl: string;
      altText?: string;
    };
    galleryImages?: {
      sourceUrl: string;
      altText?: string;
    }[];
    variations?: ProductVariation[];
    attributes?: {
      nodes: ProductAttribute[];
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
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

  // Get current display image (just use product image, no variation switching on cards)
  const currentImage = product.image;

  // Get color options from attributes (not variations - much faster!)
  const colorAttribute = product.attributes?.nodes?.find(
    attr => attr.name === 'צבע' || attr.name === 'color' || attr.name.toLowerCase().includes('color')
  );
  const colorOptions = colorAttribute?.options || [];

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
            setIsWishlisted(!isWishlisted);
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

        {/* Color Variations - from attributes, display only */}
        {colorOptions.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {colorOptions.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border border-gray-200"
                style={getColorStyle(color)}
                title={color}
              />
            ))}
            {colorOptions.length > 5 && (
              <span className="text-xs text-muted-foreground">+{colorOptions.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
