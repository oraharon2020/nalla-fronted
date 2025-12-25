'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check, ShoppingCart, Sparkles, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

interface RelatedProduct {
  id: number;
  parent_id?: number;
  name: string;
  slug: string;
  price: string;
  regular_price?: string;
  image: string;
  is_variation?: boolean;
  variation_attributes?: string[];
}

interface VariationBundle {
  products: number[];
  discount: number | null;
}

interface SelectedVariation {
  id: number;
  price: string;
  image?: { src: string; alt: string };
  attributes: { name: string; option: string }[];
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
  selectedVariation?: SelectedVariation | null;
  selectedAttributes?: Record<string, string>;
  relatedData?: {
    enabled: boolean;
    discount: number;
    products: RelatedProduct[];
    variation_bundles?: Record<string, VariationBundle> | null;
  } | null;
}

export default function CompleteTheLook({ currentProduct, selectedVariation, selectedAttributes, relatedData }: CompleteTheLookProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set([currentProduct.id])
  );
  const [isOpen, setIsOpen] = useState(true);
  const { addItem } = useCartStore();

  // Don't render if no related products
  if (!relatedData || !relatedData.enabled) {
    return null;
  }

  // Determine which bundle to show based on selected variation
  const { activeProducts, activeDiscount } = useMemo(() => {
    const variationId = selectedVariation?.id?.toString();
    const variationBundles = relatedData.variation_bundles;
    
    // Check if there's a specific bundle for this variation
    if (variationId && variationBundles && variationBundles[variationId]) {
      const varBundle = variationBundles[variationId];
      // Filter products array to only include variation bundle products
      const varProducts = relatedData.products.filter(p => 
        varBundle.products.includes(p.id)
      );
      const varDiscount = varBundle.discount !== null ? varBundle.discount : relatedData.discount;
      return { activeProducts: varProducts, activeDiscount: varDiscount };
    }
    
    // Check if we have variation bundles but current variation doesn't have one
    // In this case, we need to filter out products that belong ONLY to other variation bundles
    if (variationBundles && Object.keys(variationBundles).length > 0) {
      // Get all product IDs that are in variation bundles
      const variationBundleProductIds = new Set<number>();
      Object.values(variationBundles).forEach(bundle => {
        bundle.products.forEach(id => variationBundleProductIds.add(id));
      });
      
      // Default products are those NOT in any variation bundle
      const defaultProducts = relatedData.products.filter(p => 
        !variationBundleProductIds.has(p.id)
      );
      
      return { activeProducts: defaultProducts, activeDiscount: relatedData.discount };
    }
    
    // Use default bundle (all products)
    return { activeProducts: relatedData.products, activeDiscount: relatedData.discount };
  }, [selectedVariation?.id, relatedData]);

  // Reset selected products when variation changes
  useEffect(() => {
    setSelectedProducts(new Set([currentProduct.id]));
  }, [selectedVariation?.id, currentProduct.id]);

  // Don't render if no products in active bundle
  if (activeProducts.length === 0) {
    return null;
  }

  // Get variation info for display - use selectedAttributes (has all user selections)
  const variationLabel = selectedAttributes && Object.keys(selectedAttributes).length > 0
    ? Object.values(selectedAttributes).filter(Boolean).join(' / ')
    : null;
  
  // Use variation image if available
  const currentImage = selectedVariation?.image?.src || currentProduct.image?.sourceUrl;

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
  
  // Build variation data for cart - use selectedAttributes for full attribute list
  const currentVariationData = selectedVariation ? {
    id: selectedVariation.id,
    name: variationLabel || '',
    attributes: selectedAttributes 
      ? Object.entries(selectedAttributes).map(([name, value]) => ({
          name: name.replace(/^pa_/, ''),
          value
        }))
      : selectedVariation.attributes.map(attr => ({
          name: attr.name.replace(/^pa_/, ''),
          value: attr.option
        }))
  } : undefined;

  const allItems = [
    { 
      id: currentProduct.id, 
      name: currentProduct.name, 
      price: currentPrice, 
      image: currentImage || '', 
      slug: currentProduct.slug, 
      databaseId: currentProduct.databaseId, 
      variationLabel,
      variation: currentVariationData,
      isVariation: false,
      parentId: undefined as number | undefined
    },
    ...activeProducts.map(p => ({
      id: p.id.toString(),
      name: p.name,
      price: parsePrice(p.price),
      image: p.image,
      slug: p.slug,
      databaseId: p.is_variation && p.parent_id ? p.parent_id : p.id,
      variationLabel: p.is_variation && p.variation_attributes ? p.variation_attributes.join(' / ') : null as string | null,
      variation: p.is_variation ? {
        id: p.id,
        name: p.name,
        attributes: p.variation_attributes?.map(attr => {
          const [name, value] = attr.includes(':') ? attr.split(':') : ['', attr];
          return { name: name || 'attribute', value: value || attr };
        }) || []
      } : undefined as { id: number; name: string; attributes: { name: string; value: string }[] } | undefined,
      isVariation: p.is_variation || false,
      parentId: p.parent_id
    }))
  ];

  const selectedItems = allItems.filter(item => selectedProducts.has(item.id));
  const totalOriginal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = selectedProducts.size >= 2 ? activeDiscount : 0;
  const savings = totalOriginal * (bundleDiscount / 100);
  const finalPrice = totalOriginal - savings;

  const handleAddBundle = () => {
    selectedItems.forEach(item => {
      const discountedPrice = item.price * (1 - bundleDiscount / 100);
      
      // For variation products, use variation id in the cart id
      const cartId = item.variation 
        ? `${item.databaseId}-${item.variation.id}` 
        : item.id;
      
      addItem({
        id: cartId,
        databaseId: item.databaseId,
        name: item.name,
        slug: item.slug,
        price: `₪${Math.round(discountedPrice).toLocaleString()}`,
        image: item.image ? { sourceUrl: item.image } : undefined,
        variation: item.variation,
        bundleDiscount: bundleDiscount > 0 ? bundleDiscount : undefined,
        originalPrice: bundleDiscount > 0 ? `₪${Math.round(item.price).toLocaleString()}` : undefined,
      });
    });
  };

  return (
    <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-slate-800">השלימו את הלוק</span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{activeDiscount}% הנחה</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pb-4 border-t border-slate-100">
          {/* Products Row - Responsive sizing */}
          <div className="flex gap-2 md:gap-3 overflow-x-auto py-3 -mx-1 px-1 scrollbar-hide">
            {/* Current Product - Responsive */}
            <div className="flex-shrink-0 w-20 md:w-32">
              <div className="relative">
                <div className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden bg-slate-100 ring-2 ring-amber-400">
                  {currentImage && (
                    <Image
                      src={currentImage}
                      alt={currentProduct.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 128px"
                    />
                  )}
                  <div className="absolute bottom-1 md:bottom-2 right-1 md:right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" strokeWidth={3} />
                  </div>
                </div>
                <div className="mt-1.5 md:mt-2">
                  <p className="text-[10px] md:text-xs text-slate-600 line-clamp-2 leading-tight">{currentProduct.name}</p>
                  {variationLabel && (
                    <p className="text-[9px] md:text-[10px] text-amber-600 font-medium truncate mt-0.5">{variationLabel}</p>
                  )}
                  <p className="text-xs md:text-sm font-bold text-slate-800 mt-0.5">₪{currentPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Plus Divider */}
            <div className="flex-shrink-0 flex items-center px-1 self-start pt-7 md:pt-12">
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-300" />
            </div>

            {/* Related Products - Responsive */}
            {activeProducts.map((product) => {
              const isSelected = selectedProducts.has(product.id.toString());
              const productPrice = parsePrice(product.price);
              const productVariationLabel = product.is_variation && product.variation_attributes 
                ? product.variation_attributes.join(' / ')
                : null;

              return (
                <div key={product.id} className="flex-shrink-0 w-20 md:w-32">
                  <button
                    onClick={() => toggleProduct(product.id.toString())}
                    className="w-full text-right"
                  >
                    <div className={`relative aspect-square rounded-lg md:rounded-xl overflow-hidden bg-slate-100 transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-green-500' 
                        : 'ring-1 ring-slate-200 hover:ring-slate-300'
                    }`}>
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80px, 128px"
                        />
                      )}
                      <div className={`absolute bottom-1 md:bottom-2 right-1 md:right-2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/90 text-slate-400 border border-slate-200'
                      }`}>
                        {isSelected ? <Check className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} /> : <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                      </div>
                    </div>
                  </button>
                  <Link href={`/product/${product.slug}`} className="block mt-1.5 md:mt-2">
                    <p className="text-[10px] md:text-xs text-slate-600 line-clamp-2 leading-tight hover:text-amber-600 transition-colors">{product.name}</p>
                  </Link>
                  {productVariationLabel && (
                    <p className="text-[9px] md:text-[10px] text-amber-600 font-medium truncate mt-0.5">{productVariationLabel}</p>
                  )}
                  <p className="text-xs md:text-sm font-bold text-slate-800 mt-0.5">₪{productPrice.toLocaleString()}</p>
                </div>
              );
            })}
          </div>

          {/* Bundle Summary - Minimal */}
          {selectedProducts.size >= 2 ? (
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-slate-800">₪{Math.round(finalPrice).toLocaleString()}</span>
                    <span className="text-xs text-slate-400 line-through">₪{totalOriginal.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-green-600 font-medium">חוסכים ₪{Math.round(savings).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={handleAddBundle}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>הוסיפו לסל</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500 text-center">
                בחרו מוצר נוסף לקבלת {activeDiscount}% הנחה
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
