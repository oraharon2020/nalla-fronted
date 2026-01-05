'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist';

export default function WishlistPage() {
  const { items, removeItem, isHydrated } = useWishlistStore();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#333] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-black transition-colors">דף הבית</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">מועדפים</span>
          </nav>

          {/* Title */}
          <div className="flex justify-center relative z-10">
            <h1 className="font-english text-[32px] md:text-[60px] lg:text-[80px] font-[300] text-[#333] tracking-[0.15em] md:tracking-[0.2em] leading-none">
              WISHLIST
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Counter */}
          <div className="text-center mb-10 -mt-[20px] md:-mt-[30px]">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#f8f7f4] rounded-full">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="text-[#333] font-medium">
                {items.length === 0 
                  ? 'עדיין לא הוספת מוצרים'
                  : `${items.length} מוצרים במועדפים`
                }
              </span>
            </div>
          </div>

          {items.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 bg-[#f8f7f4] rounded-[30px]">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-[#333] mb-3">הרשימה ריקה</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                לחצו על ה-❤️ במוצרים שאתם אוהבים כדי לשמור אותם כאן לאחר מכן
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                גלו את המוצרים שלנו
              </Link>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {items.map((item) => {
                  const hasDiscount = item.onSale && item.regularPrice && item.salePrice;
                  
                  return (
                    <div key={item.id} className="group">
                      {/* Card */}
                      <div className="bg-[#f8f7f4] rounded-[20px] overflow-hidden">
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden">
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
                              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                אין תמונה
                              </div>
                            )}
                          </Link>

                          {/* Remove Button */}
                          <button
                            className="absolute top-3 left-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                            onClick={() => removeItem(item.id)}
                            aria-label={`הסר ${item.name} מהמועדפים`}
                          >
                            <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-500" />
                          </button>

                          {/* Heart Badge */}
                          <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </div>

                          {/* Sale Badge */}
                          {hasDiscount && (
                            <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                              מבצע
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 text-center">
                          <Link href={`/product/${item.slug}`}>
                            <h3 className="font-medium text-[#333] hover:text-[#4a7c59] transition-colors line-clamp-2 mb-2">
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
                                <span className="text-gray-400 line-through text-sm">
                                  {item.regularPrice}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-lg text-[#333]">
                                {item.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#333] rounded-full font-medium border-2 border-[#333] hover:bg-gray-100 transition-colors"
                >
                  המשך בקניות
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
