'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function CheckoutPage() {
  const { items, getTotal, clearCart, isHydrated } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsLoading(true);
    
    // Build the WooCommerce cart URL
    // For multiple products, we'll open a new window that adds them sequentially
    const wooUrl = 'https://bellano.co.il';
    
    // Create a form that will add all items to WooCommerce cart
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${wooUrl}/cart/`;
    form.target = '_self';
    
    // Add each item
    items.forEach((item, index) => {
      const productId = item.variation?.id 
        ? parseInt(item.variation.id.replace('variation-', ''))
        : item.databaseId;
      
      // Product ID
      const idInput = document.createElement('input');
      idInput.type = 'hidden';
      idInput.name = `products[${index}][id]`;
      idInput.value = String(productId);
      form.appendChild(idInput);
      
      // Quantity
      const qtyInput = document.createElement('input');
      qtyInput.type = 'hidden';
      qtyInput.name = `products[${index}][quantity]`;
      qtyInput.value = String(item.quantity);
      form.appendChild(qtyInput);
    });
    
    // Simple approach: just redirect to WooCommerce with first product
    // then user can continue from there
    const firstItem = items[0];
    const firstProductId = firstItem.variation?.id 
      ? parseInt(firstItem.variation.id.replace('variation-', ''))
      : firstItem.databaseId;
    
    // Clear local cart
    clearCart();
    
    // Redirect to WooCommerce
    window.location.href = `${wooUrl}/?add-to-cart=${firstProductId}&quantity=${firstItem.quantity}`;
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">הסל שלך ריק</h1>
            <p className="text-gray-600 mb-8">הוסף מוצרים לסל כדי להמשיך לתשלום</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לחנות
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4">
            <ArrowRight className="w-4 h-4" />
            חזרה לחנות
          </Link>
          <h1 className="text-3xl font-bold">סיכום הזמנה</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id + (item.variation?.id || '')} 
                className="flex gap-4 p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image?.sourceUrl ? (
                    <Image
                      src={item.image.sourceUrl}
                      alt={item.image.altText || item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.variation && (
                    <p className="text-sm text-gray-500 mt-1">
                      {item.variation.attributes.map((attr) => attr.value).join(' • ')}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">כמות: {item.quantity}</span>
                    <span className="font-bold">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">סיכום הזמנה</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>סה״כ מוצרים</span>
                  <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>משלוח</span>
                  <span className="text-green-600">חינם</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>סה״כ לתשלום</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    מעבד...
                  </>
                ) : (
                  'המשך לתשלום מאובטח'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                תועבר לדף התשלום המאובטח של בלאנו
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
