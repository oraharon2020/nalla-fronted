'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { promoPopupConfig } from '@/config/promo-popup';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { enabled, showOncePerSession, delay, content } = promoPopupConfig;

  useEffect(() => {
    if (!enabled) return;

    if (showOncePerSession) {
      const hasSeenPopup = sessionStorage.getItem('nalla_promo_popup_seen');
      if (hasSeenPopup) return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
      if (showOncePerSession) {
        sessionStorage.setItem('nalla_promo_popup_seen', 'true');
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [enabled, showOncePerSession, delay]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = content.couponCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div 
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div 
          className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-6 pt-8 text-center">
            {/* Badge */}
            <span className="inline-block bg-[#e8f0e6] text-[#4a7c59] text-xs font-medium px-3 py-1 rounded-full mb-4">
              {content.badge}
            </span>

            {/* Headline */}
            <h2 className="text-gray-900 text-xl font-bold mb-1">
              {content.headline}
            </h2>
            
            {/* Discount */}
            <div className="my-4">
              <span className="text-[#4a7c59] text-4xl font-bold">
                {content.discountNumber}
              </span>
              <p className="text-gray-500 text-sm mt-1">
                {content.discountText}
              </p>
            </div>

            {/* Coupon Code */}
            <div className="mb-5">
              <p className="text-gray-400 text-xs mb-2">
                {content.couponLabel}
              </p>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 hover:bg-gray-100 transition-colors"
              >
                <span className="font-mono text-lg font-semibold text-gray-800 tracking-wide">
                  {content.couponCode}
                </span>
                {copied ? (
                  <Check className="w-4 h-4 text-[#4a7c59]" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {copied && (
                <p className="text-[#4a7c59] text-xs mt-1.5">הקוד הועתק!</p>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href={content.ctaLink}
              onClick={handleClose}
              className="block w-full bg-[#4a7c59] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#3d6a4a] transition-colors"
            >
              {content.ctaText}
            </Link>

            {/* Footer */}
            <p className="text-gray-400 text-[11px] mt-4">
              {content.footerNote}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
