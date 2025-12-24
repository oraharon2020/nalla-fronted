'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, ShoppingCart, Sparkles, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string;
  image: string;
}

interface CompleteTheLookProps {
  currentProduct: {
    id: string;
    databaseId: number;
    name: string;
    slug: string;
    price: string;
    image?: { sourceUrl: string };
  };
  relatedData?: {
    enabled: boolean;
    discount: number;
    products: RelatedProduct[];
  } | null;
}

export default function CompleteTheLook({ currentProduct, relatedData }: CompleteTheLookProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set([currentProduct.id])
  );
  const { addItem } = useCartStore();

  // Don't render if no related products
  if (!relatedData || !relatedData.enabled || relatedData.products.length === 0) {
    return null;
  }

  const { discount, products } = relatedData;

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (productId === currentProduct.id) return newSet; // Can't deselect current
      
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Parse price helper
  const parsePrice = (price: string) => {
    return parseFloat(price.replace(/[^\d.]/g, '')) || 0;
  };

  // Calculate totals
  const currentPrice = parsePrice(currentProduct.price);
  const allItems = [
    { id: currentProduct.id, name: currentProduct.name, price: currentPrice, image: currentProduct.image?.sourceUrl || '', slug: currentProduct.slug, databaseId: currentProduct.databaseId },
    ...products.map(p => ({
      id: p.id.toString(),
      name: p.name,
      price: parsePrice(p.price),
      image: p.image,
      slug: p.slug,
      databaseId: p.id,
    }))
  ];

  const selectedItems = allItems.filter(item => selectedProducts.has(item.id));
  const totalOriginal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = selectedProducts.size >= 2 ? discount : 0;
  const savings = totalOriginal * (bundleDiscount / 100);
  const finalPrice = totalOriginal - savings;

  const handleAddBundle = () => {
    selectedItems.forEach(item => {
      const discountedPrice = item.price * (1 - bundleDiscount / 100);
      addItem({
        id: item.id,
        databaseId: item.databaseId,
        name: item.name,
        slug: item.slug,
        price: `₪${Math.round(discountedPrice).toLocaleString()}`,
        image: item.image ? { sourceUrl: item.image } : undefined,
      });
    });
  };

  return (
    <div className="mt-10 md:mt-14">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
          <Sparkles className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-800">השלימו את הלוק</h2>
          <p className="text-sm text-slate-500">קנו יחד וקבלו {discount}% הנחה</p>
        </div>
      </div>

      {/* Products Row */}
      <div className="relative">
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {/* Current Product */}
          <div className="flex-shrink-0 w-[140px] md:w-[180px]">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 ring-2 ring-amber-400 ring-offset-2">
              {currentProduct.image?.sourceUrl && (
                <Image
                  src={currentProduct.image.sourceUrl}
                  alt={currentProduct.name}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] md:text-xs font-medium px-2 py-1 rounded-full">
                הפריט שלך
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <Check className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-700 mt-2 line-clamp-2 font-medium">{currentProduct.name}</p>
            <p className="text-amber-600 font-bold text-sm">₪{currentPrice.toLocaleString()}</p>
          </div>

          {/* Plus Icon */}
          <div className="flex-shrink-0 flex items-center justify-center w-8">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
              <Plus className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Related Products */}
          {products.map((product) => {
            const isSelected = selectedProducts.has(product.id.toString());
            const productPrice = parsePrice(product.price);

            return (
              <div key={product.id} className="flex-shrink-0 w-[140px] md:w-[180px]">
                <button
                  onClick={() => toggleProduct(product.id.toString())}
                  className="w-full text-right"
                >
                  <div className={`relative aspect-square rounded-xl overflow-hidden bg-slate-100 transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-green-500 ring-offset-2' 
                      : 'hover:ring-2 hover:ring-slate-300 hover:ring-offset-2'
                  }`}>
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    
                    {/* Selection Indicator */}
                    <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-green-500 text-white scale-100' 
                        : 'bg-white/90 text-slate-400 border-2 border-slate-200 scale-90'
                    }`}>
                      {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>

                    {/* Bottom Gradient */}
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500/80 to-transparent p-3">
                        <span className="text-white text-xs font-medium">נבחר</span>
                      </div>
                    )}
                  </div>
                </button>
                <Link href={`/product/${product.slug}`} className="block mt-2">
                  <p className="text-xs md:text-sm text-slate-700 line-clamp-2 hover:text-amber-600 transition-colors">{product.name}</p>
                </Link>
                <p className="text-amber-600 font-bold text-sm">₪{productPrice.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bundle Summary - Only show when 2+ items selected */}
      {selectedProducts.size >= 2 && (
        <div className="mt-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 md:p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/70 text-sm">{selectedItems.length} פריטים בסט</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl md:text-3xl font-bold">₪{Math.round(finalPrice).toLocaleString()}</span>
                  <span className="text-white/50 line-through text-lg">₪{totalOriginal.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="bg-green-500 text-white text-center px-4 py-2 rounded-lg font-medium">
                חוסכים ₪{Math.round(savings).toLocaleString()}
              </div>
              <button
                onClick={handleAddBundle}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                הוסיפו הכל לסל
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
