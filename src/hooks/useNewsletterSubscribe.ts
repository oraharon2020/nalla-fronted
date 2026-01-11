'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';

interface SubscribeData {
  name: string;
  phone: string;
  email: string;
  marketingConsent: boolean;
}

interface UseNewsletterSubscribeReturn {
  subscribe: (data: SubscribeData) => Promise<boolean>;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string;
  reset: () => void;
}

export function useNewsletterSubscribe(): UseNewsletterSubscribeReturn {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const subscribe = async (data: SubscribeData): Promise<boolean> => {
    const { name, phone, email, marketingConsent } = data;

    // Validation
    if (!name) {
      setErrorMessage('נא להזין שם מלא');
      setStatus('error');
      return false;
    }

    if (!phone) {
      setErrorMessage('נא להזין מספר טלפון');
      setStatus('error');
      return false;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('נא להזין כתובת אימייל תקינה');
      setStatus('error');
      return false;
    }

    if (!marketingConsent) {
      setErrorMessage('נא לאשר קבלת חומר פרסומי');
      setStatus('error');
      return false;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'שגיאה בשליחת הטופס');
      }

      // Track newsletter signup
      track('newsletter_signup', {
        source: 'website',
        has_marketing_consent: marketingConsent,
      });

      // Facebook Pixel - Lead
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Newsletter Signup',
          content_category: 'Newsletter',
        });
      }

      setStatus('success');
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'אירעה שגיאה, נסו שוב מאוחר יותר');
      setStatus('error');
      return false;
    }
  };

  const reset = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  return {
    subscribe,
    status,
    errorMessage,
    reset,
  };
}
