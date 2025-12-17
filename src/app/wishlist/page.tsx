'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/lib/store/wishlist';

export default function WishlistPage() {
  const { items, removeItem, isHydrated } = useWishlistStore();

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h1 className="text-3xl md:text-4xl font-bold mb-2">המועדפים שלי</h1>
        <p className="text-muted-foreground">
          {items.length === 0 
            ? 'עדיין לא הוספת מוצרים למועדפים'
            : `${items.length} מוצרים במועדפים`
          }
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-8">
            לחצו על הלב ❤️ במוצרים שאתם אוהבים כדי לשמור אותם כאן
          </p>
          <Link href="/categories">
            <Button size="lg">
              המשך בקניות
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => {
              const hasDiscount = item.onSale && item.regularPrice && item.salePrice;
              
              return (
                <div key={item.id} className="group relative">
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                    <Link href={`/product/${item.slug}`}>
                      {item.image?.sourceUrl ? (
                        <Image
                          src={item.image.sourceUrl}
                          alt={item.image.altText || item.name}
                          fill
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          אין תמונה
                        </div>
                      )}
                    </Link>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 left-3 bg-white/80 hover:bg-white shadow-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </Button>

                    {/* Filled Heart */}
                    <div className="absolute bottom-3 left-3">
                      <Heart className="h-6 w-6 fill-red-500 text-red-500" />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="text-center space-y-2">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-medium text-base hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-red-500 font-bold text-lg">
                            {item.salePrice}
                          </span>
                          <span className="text-muted-foreground line-through text-sm">
                            {item.regularPrice}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">
                          {item.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-12 text-center">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                המשך בקניות
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
