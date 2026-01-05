'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, Send, AlertCircle, ChevronDown } from 'lucide-react';
import { siteConfig, getApiEndpoint } from '@/config/site';

const subjectOptions = [
  'שאלה כללית',
  'בירור לגבי הזמנה',
  'שירות לקוחות',
  'שיתוף פעולה עסקי',
  'אחר',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(getApiEndpoint('contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'שגיאה בשליחת ההודעה');
      }
    } catch {
      setError('שגיאה בשליחת ההודעה. אנא נסו שנית.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-xs text-gray-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-black">דף הבית</Link>
            <span>/</span>
            <span className="text-gray-900">צרו קשר</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Left Side - Contact Info */}
            <div className="lg:order-1">
              <div className="space-y-6">
                {/* Contact Details */}
                <div>
                  <h2 className="text-lg font-bold mb-3">לקוחות יקרים,</h2>
                  <p className="text-gray-700 leading-relaxed mb-5">
                    נשמח לעמוד לשירותכם ולספק מענה לכל שאלה, בקשה או בעיה.
                    <br />
                    ניתן ליצור איתנו קשר באחת מהדרכים הבאות:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">טלפון:</span>
                      <a href={`tel:${siteConfig.phoneClean}`} className="text-black hover:underline">
                        {siteConfig.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">WhatsApp:</span>
                      <a 
                        href={`https://wa.me/${siteConfig.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline"
                      >
                        [לחצו כאן]
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">דוא״ל:</span>
                      <a href={`mailto:${siteConfig.email}`} className="text-black hover:underline">
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Customer Service Hours */}
                <div>
                  <h3 className="font-bold mb-1">שעות פעילות שירות הלקוחות:</h3>
                  <p className="text-gray-700">ימים א׳-ה׳: 10:00-16:00</p>
                </div>

                {/* Showroom Hours */}
                <div>
                  <h3 className="font-bold mb-1">שעות פעילות אולם התצוגה:</h3>
                  <div className="text-gray-700 space-y-0.5">
                    <p>ימים א׳-ה׳: 10:00-20:00</p>
                    <p>ימי שישי: 10:00-14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:order-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-10 text-left" style={{ fontFamily: 'var(--font-amandine)' }}>DROP US A LINE</h1>
              
              {submitted ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">ההודעה נשלחה בהצלחה!</h3>
                  <p className="text-gray-500">נחזור אליכם בהקדם</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1: Name & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-black transition-colors text-right"
                        placeholder="שם מלא"
                      />
                    </div>
                    <div className="relative sm:order-first">
                      <input 
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-black transition-colors text-right"
                        placeholder="מספר טלפון"
                      />
                    </div>
                  </div>
                  
                  {/* Row 2: Email */}
                  <div className="relative">
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-black transition-colors text-right"
                      placeholder="אימייל"
                    />
                  </div>
                  
                  {/* Row 3: Subject */}
                  <div className="relative">
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer text-right"
                      dir="rtl"
                    >
                      <option value="">מטרת הפנייה</option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  
                  {/* Row 4: Message */}
                  <div className="relative">
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full min-h-[120px] px-0 py-3 bg-transparent border-0 border-b border-gray-300 resize-none focus:outline-none focus:border-black transition-colors text-right"
                      placeholder="הודעה"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-black text-white text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                    >
                      {isSubmitting ? 'שולח...' : 'שליחה'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
