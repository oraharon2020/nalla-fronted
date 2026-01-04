'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Real Google Reviews Data for Nalla
const TOTAL_REVIEWS = 227;
const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=nalla+%D7%91%D7%99%D7%A7%D7%95%D7%A8%D7%95%D7%AA';

// Real reviews
const reviews = [
  {
    id: 1,
    name: 'Igal Menachem',
    date: '27 דצמבר 2025',
    rating: 5,
    text: 'חייב לפרגן לנלה, שירות מעולה! לירן עזר לנו בעיצוב המזנון והשולחן והתאמה לדירה',
    avatar: 'I',
    avatarColor: '#1a73e8',
  },
  {
    id: 2,
    name: 'משה כהן',
    date: '27 דצמבר 2025',
    rating: 5,
    text: 'אלופים',
    avatar: 'מ',
    avatarColor: '#e8453c',
  },
  {
    id: 3,
    name: 'נוי',
    date: '26 דצמבר 2025',
    rating: 5,
    text: 'רצינו לעשות בדיוק באתר והיו לי כמה שאלות, פניתי לשירות לקוחות הטלפוני והנציג היה סבלן ואדיב...',
    avatar: 'נ',
    avatarColor: '#34a853',
    hasMore: true,
  },
  {
    id: 4,
    name: 'איתי גרביר',
    date: '26 דצמבר 2025',
    rating: 5,
    text: 'שירות מעולה קיבלנו גם מענה לשאלות אחרי הרכישה',
    avatar: 'א',
    avatarColor: '#fbbc04',
  },
  {
    id: 5,
    name: 'שירה לוי',
    date: '25 דצמבר 2025',
    rating: 5,
    text: 'מזנון מהמם! איכות מעולה ושירות לקוחות מדהים. ממליצה בחום!',
    avatar: 'ש',
    avatarColor: '#1a73e8',
  },
  {
    id: 6,
    name: 'דני אברהם',
    date: '24 דצמבר 2025',
    rating: 5,
    text: 'קנינו שולחן סלון ומזנון, הכל הגיע מושלם. השירות היה יוצא מן הכלל',
    avatar: 'ד',
    avatarColor: '#e8453c',
  },
];

// Google Icon Component
function GoogleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// Review Card Component
function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)] min-w-[260px] w-[260px] flex-shrink-0 border border-gray-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <GoogleIcon className="w-5 h-5" />
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="font-medium text-[13px] text-gray-900 leading-tight">{review.name}</p>
            <p className="text-[11px] text-gray-400">{review.date}</p>
          </div>
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
            style={{ backgroundColor: review.avatarColor }}
          >
            {review.avatar}
          </div>
        </div>
      </div>
      
      {/* Stars Row */}
      <div className="flex items-center justify-end gap-1 mb-3">
        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center ml-1">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      
      {/* Review Text */}
      <p className="text-[13px] text-gray-600 leading-relaxed text-right">{review.text}</p>
      
      {/* Read More */}
      {review.hasMore && (
        <button className="text-gray-400 text-[12px] mt-2 hover:text-blue-600 transition-colors block mr-auto">
          קרא עוד
        </button>
      )}
    </div>
  );
}

export function HappyHomesReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <section className="py-10 md:py-14 bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Title */}
        <h2 className="font-english text-[36px] md:text-[56px] lg:text-[72px] font-[300] italic text-[#333] text-center tracking-wide leading-[1.1] mb-8 md:mb-12">
          HAPPY HOMES, HAPPY PEOPLE
        </h2>

        {/* Content Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {/* Left - Google Rating Summary */}
          <div className="flex-shrink-0 text-center w-[180px]">
            <p className="text-lg font-bold text-gray-800 mb-1">מעולה</p>
            
            {/* Stars */}
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill="#FBBF24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="halfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="50%" stopColor="#FBBF24" />
                    <stop offset="50%" stopColor="#E5E7EB" />
                  </linearGradient>
                </defs>
                <path fill="url(#halfGradient)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            <p className="text-[13px] text-gray-500 mb-4">
              מבוסס על <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{TOTAL_REVIEWS} ביקורות</a>
            </p>
            
            {/* Google Logo */}
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
              <svg className="h-7 mx-auto" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4"/>
              </svg>
            </a>
          </div>

          {/* Right - Reviews Carousel */}
          <div className="relative w-full max-w-[900px]">
            {/* Navigation Arrows */}
            <button
              onClick={() => scroll('right')}
              className={`absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="הקודם"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('left')}
              className={`absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="הבא"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Reviews Scroll Container */}
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-8 md:px-10"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
