'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, ShoppingBag, Menu, Phone, Heart, X, ChevronLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { CartSidebar } from './CartSidebar';
import { SearchModal } from '@/components/search/SearchModal';
import { CategoryIconsCarousel } from '@/components/home/CategoryIconsCarousel';
import { siteConfig } from '@/config/site';

const { navigation } = siteConfig;

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount, toggleCart, isHydrated } = useCartStore();
  const wishlistStore = useWishlistStore();
  const itemCount = isHydrated ? getItemCount() : 0;
  const wishlistCount = wishlistStore.isHydrated ? wishlistStore.getItemCount() : 0;

  return (
    <>
      {/* Top Bar */}
      <div className="px-4 py-2">
        <div className="max-w-[1300px] mx-auto bg-[#e1eadf] text-[#4a7c59] text-center py-3 px-3 text-sm font-medium rounded-[50px]">
          מגוון מוצרים בהנחות ענק בקטגוריית NALLA SALE בין 20% ל-50% הנחה!
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Top Row - Icons and Logo */}
          <div className="flex items-center justify-between py-4">
            {/* Right Side - Hamburger (mobile) / Search & Social (desktop) */}
            <div className="flex items-center gap-3">
              {/* Mobile: Hamburger Menu */}
              <button
                className="lg:hidden p-1"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="פתח תפריט"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-black rounded-full"></span>
                  <span className="w-4 h-0.5 bg-black rounded-full"></span>
                  <span className="w-full h-0.5 bg-black rounded-full"></span>
                </div>
              </button>
              
              {/* Desktop: Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="חיפוש"
                className="hover:bg-transparent hidden lg:flex"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Desktop: Social Icons */}
              <a 
                href="https://facebook.com/nalla" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden lg:flex w-8 h-8 bg-black rounded-full items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="פייסבוק"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/nalla" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden lg:flex w-8 h-8 bg-black rounded-full items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="אינסטגרם"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image
                src={siteConfig.logo.wordpressUrl}
                alt={siteConfig.fullName}
                width={180}
                height={60}
                className="h-10 lg:h-14 w-auto"
                priority
              />
            </Link>

            {/* Left Icons - Search (mobile), Wishlist & Cart */}
            <div className="flex items-center gap-3 lg:gap-3">
              {/* Mobile: Search */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="חיפוש"
                className="lg:hidden"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>
              
              <Link href="/wishlist" className="relative" aria-label="מועדפים">
                <Heart className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 text-[10px] lg:text-xs font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleCart}
                className="relative"
                aria-label="עגלת קניות"
              >
                <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 text-[10px] lg:text-xs font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Row */}
          <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t border-gray-100">
            <Link href="/" className="text-sm hover:text-gray-600 transition-colors">
              בית
            </Link>
            <Link href="/category/sale" className="text-sm hover:text-gray-600 transition-colors">
              NALLA SALE
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm hover:text-gray-600 transition-colors">
                חללי מגורים
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white border rounded-lg shadow-lg py-2 min-w-[180px]">
                  {navigation.main.find(item => 'children' in item)?.children?.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/category/${child.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/showroom" className="text-sm hover:text-gray-600 transition-colors">
              SHOWROOM
            </Link>
            <Link href="/blog" className="text-sm hover:text-gray-600 transition-colors">
              בלוג
            </Link>
            <Link href="/contact" className="text-sm hover:text-gray-600 transition-colors">
              יצירת קשר
            </Link>
            <Link href="/tambour-color" className="text-sm hover:text-gray-600 transition-colors">
              צביעה בתנור
            </Link>
          </nav>
        </div>
      </header>

      {/* Category Icons Carousel */}
      <CategoryIconsCarousel />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-xs bg-white z-50 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src={siteConfig.logo.wordpressUrl}
                  alt={siteConfig.fullName}
                  width={100}
                  height={33}
                  className="h-8 w-auto"
                />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="סגור תפריט"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-auto">
              {/* Main Navigation with Sections */}
              {navigation.main.map((section) => (
                'children' in section && section.children ? (
                  <div key={section.name} className="border-b">
                    <div className="p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{section.name}</p>
                      <nav className="space-y-1">
                        {section.children.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/category/${item.slug}`}
                            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="font-medium">{item.name}</span>
                            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={section.name}
                    href={'slug' in section && section.slug ? `/category/${section.slug}` : ('href' in section ? section.href : '/')}
                    className={`flex items-center justify-between py-3 px-4 border-b transition-colors ${
                      'highlight' in section && section.highlight ? 'bg-red-50 text-red-600 font-semibold' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="font-medium">{section.name}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                )
              ))}
              
              {/* All Categories Link */}
              <Link
                href="/categories"
                className="flex items-center justify-between py-3 px-4 border-b bg-gray-50 transition-colors hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="font-semibold text-primary">כל הקטגוריות</span>
                <ChevronLeft className="w-4 h-4 text-primary" />
              </Link>
              
              {/* Design Assistant Link */}
              <Link
                href="/design-assistant"
                className="flex items-center justify-between py-3 px-4 border-b bg-amber-50 transition-colors hover:bg-amber-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="font-semibold text-amber-600">✨ עוזר עיצוב AI</span>
                <ChevronLeft className="w-4 h-4 text-amber-600" />
              </Link>
              
              {/* Info Links */}
              <div className="p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">מידע</p>
                <nav className="space-y-1">
                  {navigation.info.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="font-medium">{link.name}</span>
                      <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-3 bg-gray-50">
              <a 
                href="tel:03-5566696"
                className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg font-medium"
              >
                <Phone className="w-4 h-4" />
                03-5566696
              </a>
              <a 
                href="https://wa.me/97235566696"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg font-medium hover:bg-white transition-colors"
              >
                וואטסאפ
              </a>
            </div>
          </div>
        </>
      )}

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
