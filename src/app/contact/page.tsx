'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, Send } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
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

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">צרו קשר</h1>
          <p className="text-gray-500 text-center mb-10">נשמח לעמוד לשירותכם ולענות על כל שאלה</p>
          
          {/* Contact Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <a 
              href="tel:03-5566696"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-black transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-500 mb-1">טלפון</span>
              <span className="font-medium">03-5566696</span>
            </a>

            <a 
              href="https://wa.me/97235566696"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-green-500 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-500 mb-1">וואטסאפ</span>
              <span className="font-medium">03-5566696</span>
            </a>

            <a 
              href="mailto:info@bellano.co.il"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-black transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-500 mb-1">אימייל</span>
              <span className="font-medium">info@bellano.co.il</span>
            </a>
          </div>

          {/* Hours */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <h2 className="font-medium">שעות פעילות</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <span className="text-gray-600">ימים א׳ - ה׳</span>
                <span className="font-medium">10:00 - 17:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <span className="text-gray-600">יום ו׳ וערבי חג</span>
                <span className="font-medium">10:00 - 13:00</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-bold mb-2">שלחו לנו הודעה</h2>
            <p className="text-gray-500 text-sm mb-6">נחזור אליכם בהקדם האפשרי</p>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">ההודעה נשלחה בהצלחה!</h3>
                <p className="text-gray-500">נחזור אליכם בהקדם</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">שם מלא *</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="השם שלכם"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">טלפון *</label>
                    <input 
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="מספר טלפון"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">אימייל</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="כתובת אימייל"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">נושא</label>
                  <input 
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="נושא הפנייה"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">הודעה *</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full min-h-[120px] px-4 py-2.5 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="כתבו את ההודעה שלכם..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'שולח...' : 'שליחת הודעה'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
