'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Instagram, Facebook, LogIn, LogOut, User } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useAdminStore } from '@/lib/store/admin';

const linksCol1 = [
  { name: 'אודות', href: '/about' },
  { name: 'אחריות המוצרים', href: '/page/warranty' },
  { name: 'בלוג', href: '/blog' },
  { name: 'יצירת קשר', href: '/contact' },
];

const linksCol2 = [
  { name: 'תקנון האתר', href: '/page/terms' },
  { name: 'תקנון משלוחים', href: '/page/shipping' },
  { name: 'הצהרת נגישות', href: '/accessibility' },
  { name: 'מדיניות פרטיות', href: '/page/privacy-policy' },
];

export function Footer() {
  const { isAdmin, adminName, openLoginModal, logout } = useAdminStore();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-[1300px] mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:flex lg:flex-row-reverse lg:justify-between">
          
          {/* שעות פעילות - Left Side */}
          <div className="text-center">
            <h4 className="font-bold text-lg mb-4">שעות פעילות</h4>
            
            <p className="font-medium text-[15px] text-gray-800 mb-1">Show-room ומוקד מכירות</p>
            <p className="text-[14px] text-gray-600 mb-0.5">ימים א-ה: 10:00 - 20:00</p>
            <p className="text-[14px] text-gray-600 mb-4">שישי: 10:00 - 14:00</p>
            
            <p className="font-medium text-[15px] text-gray-800 mb-1">שירות לקוחות</p>
            <p className="text-[14px] text-gray-600 mb-5">ימים א-ה: 10:00 - 16:00</p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-2 justify-center">
              {/* Apple Pay */}
              <svg className="h-5" viewBox="0 0 50 20" fill="currentColor">
                <path d="M9.6 4.9c-.6.7-1.5 1.2-2.4 1.1-.1-.9.3-1.9.9-2.5.6-.7 1.5-1.1 2.3-1.2.1 1 -.3 1.9-.8 2.6zm.8 1.3c-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.7-2.7-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.4.7 1 1.5 2.2 2.7 2.1 1-.1 1.5-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.4 0-2.2 1.8-3.2 1.9-3.3-1.1-1.5-2.7-1.7-3.3-1.7v.2z"/>
                <path d="M21.8 2.5c3.2 0 5.4 2.2 5.4 5.4s-2.3 5.5-5.5 5.5h-3.5v5.7h-2.5V2.5h6.1zm-3.5 8.7h2.9c2.2 0 3.5-1.2 3.5-3.3s-1.3-3.3-3.5-3.3h-2.9v6.6zm9.8 3.5c0-2.2 1.7-3.5 4.6-3.7l3.4-.2v-1c0-1.4-.9-2.2-2.5-2.2-1.5 0-2.4.7-2.6 1.8h-2.3c.1-2.3 2-4 5-4 2.9 0 4.8 1.5 4.8 4v8.3h-2.3v-2h-.1c-.7 1.4-2.1 2.2-3.7 2.2-2.3 0-3.9-1.4-3.9-3.4l-.4.2zm8-1.2v-1l-3 .2c-1.5.1-2.4.8-2.4 1.8s.9 1.7 2.2 1.7c1.7 0 3.2-1.2 3.2-2.7zm4.4 6.6v-2c.2 0 .6.1.9.1 1.3 0 2-.5 2.4-1.9l.3-.8-4.5-12.4h2.6l3.2 10.2h.1l3.2-10.2h2.5l-4.7 13.1c-1.1 3-2.3 4-4.9 4-.3 0-.9 0-1.1-.1z"/>
              </svg>
              
              {/* Mastercard */}
              <svg className="h-4" viewBox="0 0 40 25">
                <circle cx="12" cy="12.5" r="10" fill="#EB001B"/>
                <circle cx="28" cy="12.5" r="10" fill="#F79E1B"/>
                <path d="M20 5.3a10 10 0 000 14.4 10 10 0 000-14.4z" fill="#FF5F00"/>
              </svg>
              
              {/* VISA */}
              <svg className="h-3.5" viewBox="0 0 60 20" fill="#1A1F71">
                <path d="M22.4 0l-4.1 19.5h3.3L25.7 0h-3.3zm16.8 0l-5.1 13.3-.6-2.8-1.7-8.7c-.3-1.2-1.2-1.8-2.4-1.8h-5.2l-.1.4c1.8.4 3.4 1 4.8 1.8l4 15.3h3.5L43.5 0h-4.3zM49.5 6c0-.8.7-1.4 2-1.4 1.1 0 2.3.5 2.3.5l.4-2.8s-1.2-.5-3-.5c-3.3 0-5.6 1.7-5.6 4.2 0 1.8 1.7 2.8 3 3.4s1.7 1 1.7 1.6c0 .9-.9 1.4-2.2 1.4-1.5 0-2.9-.6-2.9-.6l-.5 2.9s1.4.6 3.5.6c3.4 0 5.7-1.7 5.7-4.3 0-2-1.2-2.9-3-3.6-1.2-.4-2.4-.8-2.4-1.4zM10.3 12.6l-.5-2.5-.5-2.8c-.3-1.2-1.2-1.8-2.4-1.8H1.7l-.1.4c2.8.7 5.3 2.4 6.6 4.9l1.1 1.8h1z"/>
              </svg>
              
              {/* Bit */}
              <svg className="h-3.5" viewBox="0 0 40 20">
                <rect width="40" height="20" rx="3" fill="#3FCCFA"/>
                <text x="20" y="14" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">bit</text>
              </svg>
            </div>
          </div>

          {/* אודות Column */}
          <div className="text-center">
            <ul className="space-y-3">
              {linksCol1.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-gray-700 hover:text-black transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* תקנון Column */}
          <div className="text-center">
            <ul className="space-y-3">
              {linksCol2.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-gray-700 hover:text-black transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Logo & Contact - Right Side */}
          <div className="text-center">
            {/* Logo */}
            <div className="mb-6">
              <Link href="/">
                <span className="font-english text-[42px] font-light tracking-[0.15em] text-[#333]">
                  NALLA
                </span>
              </Link>
            </div>
            
            {/* Address */}
            <div className="flex items-start gap-2 mb-3 justify-center">
              <p className="text-[14px] text-gray-600">אברהם בומה שביט 1 ראשון לציון, מחסן F-101</p>
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            </div>
            
            {/* Phone */}
            <div className="flex items-center gap-2 mb-6 justify-center">
              <a href="tel:03-3732350" className="text-[14px] text-gray-600 hover:text-black transition-colors">
                03-3732350
              </a>
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3 justify-center">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Instagram className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-[1300px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Admin Login/Logout Button - Left */}
          {isAdmin ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>{adminName}</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>כניסת נציגים</span>
            </button>
          )}
          
          {/* Copyright - Right */}
          <span className="text-xs text-gray-500">
            כל הזכויות שמורות ל{siteConfig.name} © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
