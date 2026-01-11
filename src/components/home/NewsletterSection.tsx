'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';

export function NewsletterSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    marketingConsent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMessage('נא למלא את כל השדות');
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('שגיאה בשליחת הטופס');
      }
      
      // Track newsletter signup
      track('newsletter_signup', {
        source: 'homepage',
        has_marketing_consent: formData.marketingConsent,
      });
      
      // Facebook Pixel - Lead
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Newsletter Signup',
          content_category: 'Newsletter',
        });
      }
      
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', marketingConsent: false });
    } catch (error) {
      setErrorMessage('אירעה שגיאה, נסו שוב מאוחר יותר');
      setStatus('error');
    }
  };

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* INSPIRED LIVING Title */}
        <div className="flex justify-center mb-8">
          <h2 className="font-english text-[32px] md:text-[80px] lg:text-[100px] font-[300] text-[#333] tracking-[0.15em] md:tracking-[0.1em] leading-none">
            INSPIRED LIVING
          </h2>
        </div>
        
        {/* Form Container with green background */}
        <div className="bg-[#e1eadf] rounded-br-[50px] rounded-bl-[50px] rounded-tr-[50px] rounded-tl-none py-12 px-6 md:px-12 -mt-[45px] md:-mt-[55px] lg:-mt-[70px]">
          <div className="max-w-4xl mx-auto">
            {/* Subtitle */}
            <p className="text-center text-lg md:text-xl text-[#333] mb-8">
              רכישה ראשונה אצלנו? <span className="font-bold">קבלו 5% הנחה + משלוח חינם</span>
            </p>
            
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#333] mb-2">תודה שנרשמתם!</h3>
                <p className="text-[#333]">קוד ההנחה נשלח אליכם למייל</p>
              </div>
            ) : (
              <>
                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-center justify-center mb-4">
                  <input
                    type="text"
                    placeholder="שם מלא (חובה)"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full md:w-auto px-6 py-3 rounded-full border border-gray-300 bg-white text-right text-sm focus:outline-none focus:border-gray-400"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="טלפון (חובה)"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full md:w-auto px-6 py-3 rounded-full border border-gray-300 bg-white text-right text-sm focus:outline-none focus:border-gray-400"
                    required
                  />
                  <input
                    type="email"
                    placeholder="אימייל (חובה)"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full md:w-auto px-6 py-3 rounded-full border border-gray-300 bg-white text-right text-sm focus:outline-none focus:border-gray-400"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'שולח...' : 'שלח פרטים'}
                  </button>
                </form>
                
                {/* Error message */}
                {status === 'error' && (
                  <p className="text-center text-red-600 text-sm mb-4">{errorMessage}</p>
                )}
                
                {/* Checkbox */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-[#333]">מאשר/ת קבלת חומר פרסומי</span>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4"
                    checked={formData.marketingConsent}
                    onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
