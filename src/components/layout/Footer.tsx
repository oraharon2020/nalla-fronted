'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Instagram, Facebook, LogIn, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { useAdminStore } from '@/lib/store/admin';

interface FooterData {
  contact: {
    phone: string;
    address: string;
    facebook: string;
    instagram: string;
  };
  hours: {
    showroom_title: string;
    showroom_weekdays: string;
    showroom_friday: string;
    service_title: string;
    service_hours: string;
  };
  links_col1: { name: string; href: string }[];
  links_col2: { name: string; href: string }[];
}

const defaultFooterData: FooterData = {
  contact: {
    phone: ' 03-3732350',
    address: 'אברהם בומה שביט 1 ראשון לציון, אולם F-101',
    facebook: 'https://facebook.com/nalla',
    instagram: 'https://instagram.com/nalla',
  },
  hours: {
    showroom_title: 'Show-room ומוקד מכירות',
    showroom_weekdays: 'ימים א-ה: 10:00 - 20:00',
    showroom_friday: 'שישי: 10:00 - 14:00',
    service_title: 'שירות לקוחות',
    service_hours: 'ימים א-ה: 10:00 - 16:00',
  },
  links_col1: [
    { name: 'אודות', href: '/about' },
    { name: 'אחריות המוצרים', href: '/page/warranty' },
    { name: 'בלוג', href: '/blog' },
    { name: 'יצירת קשר', href: '/contact' },
  ],
  links_col2: [
    { name: 'תקנון האתר', href: '/page/terms' },
    { name: 'תקנון משלוחים', href: '/page/shipping' },
    { name: 'הצהרת נגישות', href: '/accessibility' },
    { name: 'מדיניות פרטיות', href: '/page/privacy-policy' },
  ],
};

export function Footer() {
  const { isAdmin, adminName, openLoginModal, logout } = useAdminStore();
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch('/api/footer');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (data.contact || data.links_col1) {
          setFooterData({
            contact: data.contact || defaultFooterData.contact,
            hours: data.hours || defaultFooterData.hours,
            links_col1: data.links_col1?.length > 0 ? data.links_col1 : defaultFooterData.links_col1,
            links_col2: data.links_col2?.length > 0 ? data.links_col2 : defaultFooterData.links_col2,
          });
        }
      } catch (error) {
        console.log('Using default footer data');
      }
    };
    fetchFooter();
  }, []);
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-[1300px] mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:flex lg:flex-row-reverse lg:justify-between">
          
          {/* שעות פעילות - Left Side */}
          <div className="text-center">
            <h4 className="font-bold text-lg mb-4">שעות פעילות</h4>
            
            <p className="font-medium text-[15px] text-gray-800 mb-1">{footerData.hours.showroom_title}</p>
            <p className="text-[14px] text-gray-600 mb-0.5">{footerData.hours.showroom_weekdays}</p>
            <p className="text-[14px] text-gray-600 mb-4">{footerData.hours.showroom_friday}</p>
            
            <p className="font-medium text-[15px] text-gray-800 mb-1">{footerData.hours.service_title}</p>
            <p className="text-[14px] text-gray-600 mb-5">{footerData.hours.service_hours}</p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-3 justify-center">
              {/* Apple Pay */}
              <svg className="h-6" viewBox="0 0 165.521 105.965" xmlns="http://www.w3.org/2000/svg">
                <path fill="#000" d="M150.698 0H14.823c-.566 0-1.133 0-1.698.003-.477.004-.953.009-1.43.022-1.039.028-2.087.09-3.113.274a10.51 10.51 0 0 0-2.958.975 9.932 9.932 0 0 0-4.35 4.35 10.463 10.463 0 0 0-.975 2.96C.113 9.611.052 10.658.024 11.696a70.22 70.22 0 0 0-.022 1.43C0 13.69 0 14.256 0 14.823v76.318c0 .567 0 1.132.002 1.699.003.476.009.953.022 1.43.028 1.036.09 2.084.275 3.11a10.46 10.46 0 0 0 .974 2.96 9.897 9.897 0 0 0 1.83 2.52 9.874 9.874 0 0 0 2.52 1.83c.947.483 1.917.79 2.96.977 1.025.183 2.073.245 3.112.273.477.011.953.017 1.43.02.565.004 1.132.004 1.698.004h135.875c.565 0 1.132 0 1.697-.004.476-.002.952-.009 1.431-.02 1.037-.028 2.085-.09 3.113-.273a10.478 10.478 0 0 0 2.958-.977 9.955 9.955 0 0 0 4.35-4.35c.483-.947.789-1.917.974-2.96.186-1.026.246-2.074.274-3.11.013-.477.02-.954.022-1.43.004-.567.004-1.132.004-1.699V14.824c0-.567 0-1.133-.004-1.699a63.067 63.067 0 0 0-.022-1.429c-.028-1.038-.088-2.085-.274-3.112a10.4 10.4 0 0 0-.974-2.96 9.94 9.94 0 0 0-4.35-4.35A10.52 10.52 0 0 0 156.939.3c-1.028-.185-2.076-.246-3.113-.274a71.345 71.345 0 0 0-1.431-.022C151.83 0 151.263 0 150.698 0z"/>
                <path fill="#fff" d="M150.698 3.532l1.672.003c.452.003.905.008 1.36.02.793.022 1.719.063 2.56.2.755.124 1.38.317 1.984.59a6.426 6.426 0 0 1 2.804 2.807c.271.601.463 1.226.588 1.988.136.84.177 1.762.2 2.558.01.457.016.912.02 1.36l.002 1.672V91.14l-.002 1.672c-.004.453-.01.906-.02 1.36-.023.795-.064 1.717-.2 2.56-.125.76-.317 1.385-.588 1.985a6.42 6.42 0 0 1-2.808 2.807c-.6.272-1.226.465-1.984.59-.844.138-1.77.178-2.56.2-.455.012-.906.017-1.36.02l-1.672.002H14.823l-1.674-.003a62.61 62.61 0 0 1-1.36-.02c-.79-.021-1.716-.062-2.56-.199-.757-.125-1.382-.318-1.987-.591a6.428 6.428 0 0 1-2.804-2.807c-.271-.6-.463-1.225-.588-1.986-.136-.843-.177-1.766-.2-2.56a62.91 62.91 0 0 1-.02-1.358L3.53 91.14V14.82l.003-1.673c.003-.451.009-.904.02-1.359.022-.794.063-1.717.199-2.559.125-.761.318-1.386.589-1.988a6.392 6.392 0 0 1 1.17-1.633 6.399 6.399 0 0 1 1.633-1.17c.603-.273 1.228-.466 1.988-.591.845-.138 1.77-.18 2.56-.2a55.37 55.37 0 0 1 1.36-.02l1.673-.003H150.698"/>
                <path fill="#000" d="M43.508 35.77c1.404-1.755 2.356-4.112 2.105-6.52-2.054.102-4.56 1.355-6.012 3.112-1.303 1.504-2.456 3.96-2.156 6.266 2.306.2 4.61-1.152 6.063-2.858"/>
                <path fill="#000" d="M45.587 39.079c-3.35-.2-6.196 1.9-7.795 1.9-1.6 0-4.049-1.8-6.698-1.751-3.447.05-6.645 2-8.395 5.1-3.598 6.2-.95 15.4 2.55 20.45 1.699 2.5 3.747 5.25 6.445 5.151 2.55-.1 3.549-1.65 6.647-1.65 3.097 0 3.997 1.65 6.696 1.6 2.798-.05 4.548-2.5 6.247-5 1.95-2.85 2.747-5.6 2.797-5.75-.05-.05-5.396-2.101-5.446-8.251-.05-5.15 4.198-7.6 4.398-7.751-2.399-3.548-6.147-3.948-7.447-4.048"/>
                <path fill="#000" d="M78.94 32.352c7.32 0 12.416 5.043 12.416 12.387 0 7.371-5.173 12.439-12.572 12.439h-8.092v12.869H65.52V32.352H78.94zm-8.248 20.034h6.714c5.1 0 8.01-2.754 8.01-7.57 0-4.818-2.91-7.544-7.984-7.544h-6.74v15.114z"/>
                <path fill="#000" d="M93.625 59.544c0-4.818 3.692-7.779 10.25-8.136l7.544-.41v-2.134c0-3.07-2.057-4.898-5.485-4.898-3.25 0-5.28 1.568-5.77 4.014h-4.79c.334-4.89 4.48-8.5 10.715-8.5 6.28 0 10.354 3.432 10.354 8.734v18.308h-4.994v-4.378h-.126c-1.464 2.99-4.66 4.817-7.984 4.817-4.97 0-8.715-3.043-8.715-7.417zm17.794-2.289v-2.16l-6.79.38c-3.378.231-5.28 1.724-5.28 4.117 0 2.448 1.98 4.04 5.02 4.04 3.95 0 7.05-2.703 7.05-6.377z"/>
                <path fill="#000" d="M122.086 79.271v-4.504c.41.077 1.31.126 1.696.126 2.42 0 3.717-1.024 4.505-3.638l.487-1.593-9.375-25.95h5.363l6.79 21.623h.1l6.79-21.623h5.235l-9.733 27.313c-2.24 6.34-4.816 8.368-10.227 8.368-.385 0-1.28-.05-1.631-.122z"/>
              </svg>
              
              {/* Mastercard */}
              <svg className="h-6" viewBox="0 0 152.407 108" xmlns="http://www.w3.org/2000/svg">
                <rect width="152.407" height="108" rx="8" fill="#f7f7f7"/>
                <circle cx="60.412" cy="54" r="30" fill="#eb001b"/>
                <circle cx="91.995" cy="54" r="30" fill="#f79e1b"/>
                <path d="M76.203 29.408a29.903 29.903 0 0 0-11.109 23.25 29.903 29.903 0 0 0 11.11 23.25 29.903 29.903 0 0 0 11.109-23.25 29.903 29.903 0 0 0-11.11-23.25z" fill="#ff5f00"/>
              </svg>
              
              {/* VISA */}
              <svg className="h-6" viewBox="0 0 152.407 108" xmlns="http://www.w3.org/2000/svg">
                <rect width="152.407" height="108" rx="8" fill="#f7f7f7"/>
                <path fill="#1a1f71" d="M62.394 73.68H52.19l6.376-39.378h10.204l-6.376 39.378zM46.013 34.302l-9.738 27.012-1.152-5.79-3.433-17.63s-.414-3.592-4.85-3.592H11.476l-.178.59s4.863 1.013 10.556 4.443l8.77 33.345h10.63l16.23-38.378H46.013zM131.57 73.68h9.36l-8.164-39.378h-8.217c-3.8 0-4.72 2.932-4.72 2.932l-15.212 36.446h10.63l2.113-5.842h12.987l1.223 5.842zm-11.26-13.865l5.35-14.74 3 14.74h-8.35zM106.01 43.12l1.455-8.469s-4.489-1.716-9.172-1.716c-5.06 0-17.073 2.217-17.073 12.996 0 10.166 14.162 10.295 14.162 15.64 0 5.344-12.707 4.385-16.904 1.018l-1.518 8.854s4.553 2.22 11.499 2.22c6.947 0 17.394-3.607 17.394-13.44 0-10.23-14.29-11.189-14.29-15.639 0-4.449 9.98-3.874 14.447-1.465z"/>
              </svg>
              
              {/* Bit */}
              <svg className="h-6" viewBox="0 0 152.407 108" xmlns="http://www.w3.org/2000/svg">
                <rect width="152.407" height="108" rx="8" fill="#3fccfa"/>
                <text x="76.2" y="62" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold" fontFamily="Arial, sans-serif">bit</text>
              </svg>
              
              {/* Diners Club */}
              <svg className="h-6" viewBox="0 0 152.407 108" xmlns="http://www.w3.org/2000/svg">
                <rect width="152.407" height="108" rx="8" fill="#0165ac"/>
                <text x="76.2" y="62" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif">DINERS</text>
              </svg>
            </div>
          </div>

          {/* אודות Column */}
          <div className="text-center">
            <ul className="space-y-3">
              {footerData.links_col1.map((link, index) => (
                <li key={index}>
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
              {footerData.links_col2.map((link, index) => (
                <li key={index}>
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
              <p className="text-[14px] text-gray-600">{footerData.contact.address}</p>
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            </div>
            
            {/* Phone */}
            <div className="flex items-center gap-2 mb-6 justify-center">
              <a href={`tel:${footerData.contact.phone}`} className="text-[14px] text-gray-600 hover:text-black transition-colors">
                {footerData.contact.phone}
              </a>
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-3 justify-center">
              <a
                href={footerData.contact.facebook || siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a
                href={footerData.contact.instagram || siteConfig.social.instagram}
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
