'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, Phone, Heart, X, ChevronLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { CartSidebar } from './CartSidebar';
import { SearchModal } from '@/components/search/SearchModal';
import { CategoryIconsCarousel } from '@/components/home/CategoryIconsCarousel';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { siteConfig } from '@/config/site';

const { navigation } = siteConfig;

interface NavItem {
  name: string;
  link: string;
  highlight?: boolean;
  has_mega_menu?: boolean;
}

interface MobileMenuItem {
  title: string;
  url: string;
  icon?: string;
  children?: MobileMenuItem[];
}

interface MobileMenuData {
  items: MobileMenuItem[];
  phone: string;
  whatsapp: string;
}

const defaultNavItems: NavItem[] = [
  { name: 'בית', link: '/', highlight: false, has_mega_menu: false },
  { name: 'NALLA SALE', link: '/product-category/nalla-sale', highlight: true, has_mega_menu: false },
  { name: 'חללי מגורים', link: '#', highlight: false, has_mega_menu: true },
  { name: 'SHOWROOM', link: '/showroom-page', highlight: false, has_mega_menu: false },
  { name: 'בלוג', link: '/blog', highlight: false, has_mega_menu: false },
  { name: 'יצירת קשר', link: '/contact-us', highlight: false, has_mega_menu: false },
  { name: 'צביעה בתנור', link: '/tambour', highlight: false, has_mega_menu: false },
];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [mobileMenuData, setMobileMenuData] = useState<MobileMenuData | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { getItemCount, toggleCart, isHydrated } = useCartStore();
  
  const toggleSection = (name: string) => {
    setExpandedSections(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };
  const wishlistStore = useWishlistStore();
  const itemCount = isHydrated ? getItemCount() : 0;
  const wishlistCount = wishlistStore.isHydrated ? wishlistStore.getItemCount() : 0;

  // Fetch navigation from API
  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const res = await fetch('/api/navigation');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setNavItems(data);
          }
        }
      } catch (error) {
        console.log('Error fetching navigation:', error);
      }
    };
    fetchNavigation();
  }, []);

  // Fetch mobile menu from API
  useEffect(() => {
    const fetchMobileMenu = async () => {
      try {
        const res = await fetch('/api/mobile-menu');
        if (res.ok) {
          const data = await res.json();
          if (data && data.items && data.items.length > 0) {
            setMobileMenuData(data);
          }
        }
      } catch (error) {
        console.log('Error fetching mobile menu:', error);
      }
    };
    fetchMobileMenu();
  }, []);

  return (
    <>
      {/* Top Bar - Announcements */}
      <AnnouncementBar />

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
            {navItems.map((item, index) => (
              item.has_mega_menu ? (
                <div key={index} className="relative group">
                  <button className="flex items-center gap-1 text-sm hover:text-gray-600 transition-colors">
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  {/* Mega Menu */}
                  <MegaMenu />
                </div>
              ) : (
                <Link 
                  key={index}
                  href={item.link} 
                  className={`text-sm hover:text-gray-600 transition-colors${item.highlight ? ' text-red-600 font-medium' : ''}`}
                >
                  {item.name}
                </Link>
              )
            ))}
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
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel - Clean Classic Design */}
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-[#fafafa] z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header - Minimal */}
            <div className="flex items-center justify-between p-5 bg-white border-b border-gray-100">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src={siteConfig.logo.wordpressUrl}
                  alt={siteConfig.fullName}
                  width={90}
                  height={30}
                  className="h-7 w-auto"
                />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                aria-label="סגור תפריט"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-auto py-2">
              {/* Dynamic Menu from WordPress */}
              {mobileMenuData && mobileMenuData.items.length > 0 ? (
                <>
                  {mobileMenuData.items.map((item, idx) => (
                    item.children && item.children.length > 0 ? (
                      /* Item with sub-menu */
                      <div key={idx}>
                        <button
                          onClick={() => toggleSection(`wp-${idx}`)}
                          className="w-full flex items-center gap-3 py-4 px-5 hover:bg-white transition-colors"
                        >
                          {item.icon && <span className="text-xl">{item.icon}</span>}
                          <span className="text-[15px] font-medium text-gray-800">{item.title}</span>
                          <div className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 mr-auto ${
                            expandedSections.includes(`wp-${idx}`) ? 'bg-black border-black rotate-180' : ''
                          }`}>
                            <ChevronDown className={`w-3.5 h-3.5 transition-colors ${
                              expandedSections.includes(`wp-${idx}`) ? 'text-white' : 'text-gray-500'
                            }`} />
                          </div>
                        </button>
                        
                        {/* Sub-menu */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            expandedSections.includes(`wp-${idx}`) 
                              ? 'max-h-[500px] opacity-100' 
                              : 'max-h-0 opacity-0'
                          }`}
                        >
                          <nav className="bg-white mx-3 mb-3 rounded-xl overflow-hidden shadow-sm">
                            {item.children.map((child, childIdx) => (
                              <Link
                                key={childIdx}
                                href={child.url}
                                className={`flex items-center gap-2 py-3.5 px-4 hover:bg-gray-50 transition-colors ${
                                  childIdx !== item.children!.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.icon && <span className="text-base">{child.icon}</span>}
                                <span className="text-[14px] text-gray-600">{child.title}</span>
                                <ChevronLeft className="w-4 h-4 text-gray-300 mr-auto" />
                              </Link>
                            ))}
                          </nav>
                        </div>
                      </div>
                    ) : (
                      /* Simple item without sub-menu */
                      <Link
                        key={idx}
                        href={item.url}
                        className="flex items-center gap-3 py-4 px-5 hover:bg-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon && <span className="text-xl">{item.icon}</span>}
                        <span className="text-[15px] font-medium text-gray-800">{item.title}</span>
                        <ChevronLeft className="w-4 h-4 text-gray-400 mr-auto" />
                      </Link>
                    )
                  ))}
                  
                  {/* Divider */}
                  <div className="h-px bg-gray-200 mx-5 my-3" />
                </>
              ) : (
                /* Fallback: Main Navigation with Accordion */
                navigation.main.map((section) => (
                  'children' in section && section.children ? (
                    <div key={section.name}>
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleSection(section.name)}
                        className="w-full flex items-center justify-between py-4 px-5 hover:bg-white transition-colors"
                      >
                        <span className="text-[15px] font-medium text-gray-800">{section.name}</span>
                        <div className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 ${
                          expandedSections.includes(section.name) ? 'bg-black border-black rotate-180' : ''
                        }`}>
                          <ChevronDown className={`w-3.5 h-3.5 transition-colors ${
                            expandedSections.includes(section.name) ? 'text-white' : 'text-gray-500'
                          }`} />
                        </div>
                      </button>
                      
                      {/* Accordion Content */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedSections.includes(section.name) 
                            ? 'max-h-[500px] opacity-100' 
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <nav className="bg-white mx-3 mb-3 rounded-xl overflow-hidden shadow-sm">
                          {section.children.map((item, idx) => (
                            <Link
                              key={item.slug}
                              href={`/product-category/${item.slug}`}
                              className={`flex items-center justify-between py-3.5 px-4 hover:bg-gray-50 transition-colors ${
                                idx !== section.children!.length - 1 ? 'border-b border-gray-100' : ''
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span className="text-[14px] text-gray-600">{item.name}</span>
                              <ChevronLeft className="w-4 h-4 text-gray-300" />
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={section.name}
                      href={'slug' in section && section.slug ? `/product-category/${section.slug}` : ('href' in section ? section.href : '/')}
                      className={`flex items-center justify-between py-4 px-5 transition-colors ${
                        'highlight' in section && section.highlight 
                          ? 'text-red-500 font-semibold' 
                          : 'hover:bg-white text-gray-800'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-[15px] font-medium">{section.name}</span>
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </Link>
                  )
                ))
              )}
              
              {/* All Categories */}
              <Link
                href="/categories"
                className="flex items-center justify-between py-4 px-5 hover:bg-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-[15px] font-medium text-gray-800">כל הקטגוריות</span>
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </Link>
              
              {/* Info Links Accordion */}
              <div>
                <button
                  onClick={() => toggleSection('info')}
                  className="w-full flex items-center justify-between py-4 px-5 hover:bg-white transition-colors"
                >
                  <span className="text-[15px] font-medium text-gray-800">מידע ושירות</span>
                  <div className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-300 ${
                    expandedSections.includes('info') ? 'bg-black border-black rotate-180' : ''
                  }`}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-colors ${
                      expandedSections.includes('info') ? 'text-white' : 'text-gray-500'
                    }`} />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedSections.includes('info') 
                      ? 'max-h-[400px] opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <nav className="bg-white mx-3 mb-3 rounded-xl overflow-hidden shadow-sm">
                    {navigation.info.map((link, idx) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center justify-between py-3.5 px-4 hover:bg-gray-50 transition-colors ${
                          idx !== navigation.info.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-[14px] text-gray-600">{link.name}</span>
                        <ChevronLeft className="w-4 h-4 text-gray-300" />
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Footer - Clean */}
            <div className="p-5 bg-white border-t border-gray-100 space-y-3">
              <a 
                href={`tel:${mobileMenuData?.phone || siteConfig.phoneClean}`}
                className="flex items-center justify-center gap-2 py-3.5 bg-black text-white text-[14px] font-medium tracking-wide"
              >
                <Phone className="w-4 h-4" />
                {mobileMenuData?.phone || siteConfig.phone}
              </a>
              <a 
                href={`https://wa.me/${mobileMenuData?.whatsapp || siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 text-[14px] font-medium hover:bg-gray-50 transition-colors"
              >
                שלחו לנו הודעה
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
