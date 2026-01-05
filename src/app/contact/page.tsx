'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, Send, AlertCircle, ChevronDown, MapPin, Navigation } from 'lucide-react';
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

  // Waze link with coordinates
  const wazeLink = 'https://ul.waze.com/ul?place=ChIJNQOQFe2zAhURg1s0b70T82o&ll=31.94958890%2C34.76781590&navigate=yes';

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
              <div className="space-y-8">
                {/* Greeting */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">נשמח לעמוד לשירותכם</h2>
                  <p className="text-gray-600 leading-relaxed">
                    יש לכם שאלה? רוצים לברר פרטים על הזמנה? אנחנו כאן בשבילכם.
                  </p>
                </div>
                
                {/* Contact Cards */}
                <div className="space-y-4">
                  {/* Phone */}
                  <a 
                    href={`tel:${siteConfig.phoneClean}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#e8f0e6] transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#4a7c59] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">טלפון</p>
                      <p className="font-semibold text-gray-900">{siteConfig.phone}</p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a 
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#dcf8c6] transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">וואטסאפ</p>
                      <p className="font-semibold text-gray-900">שלחו לנו הודעה</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a 
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">אימייל</p>
                      <p className="font-semibold text-gray-900">{siteConfig.email}</p>
                    </div>
                  </a>

                  {/* Address with Waze */}
                  <a 
                    href={wazeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#33ccff]/10 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#33ccff] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">אולם תצוגה - נווטו אלינו</p>
                      <p className="font-semibold text-gray-900">אברהם בומא שביט 1, אולם F-101</p>
                      <p className="text-sm text-gray-500">ראשון לציון</p>
                    </div>
                  </a>
                </div>

                {/* Hours */}
                <div className="bg-[#f8f7f4] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-[#4a7c59]" />
                    <h3 className="font-bold text-gray-900">שעות פעילות</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">אולם תצוגה</p>
                      <p className="text-sm text-gray-700">א׳-ה׳: 10:00-20:00</p>
                      <p className="text-sm text-gray-700">שישי: 10:00-14:00</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">שירות לקוחות</p>
                      <p className="text-sm text-gray-700">א׳-ה׳: 10:00-16:00</p>
                    </div>
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
