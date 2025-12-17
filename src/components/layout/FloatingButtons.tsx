'use client';

import { Phone, MessageCircle } from 'lucide-react';

export function FloatingButtons() {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/97235566696"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="וואטסאפ"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Phone Button */}
      <a
        href="tel:03-5566696"
        className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="טלפון"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
