'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Google Reviews Data - Real data
const GOOGLE_RATING = 5.0;
const TOTAL_REVIEWS = 42;
const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/place/Bellano+-+%D7%91%D7%9C%D7%90%D7%A0%D7%95%E2%80%AD/data=!4m2!3m1!1s0x0:0xcf22db8a5a7b040e?sa=X&ved=1t:2428&ictx=111';

const reviews = [
  {
    id: 1,
    name: 'סימה כהן',
    rating: 5,
    date: 'לפני שבוע',
    text: 'תודה ענקית! זו הייתה הקנייה המושלמת של מזנון. טל המקסים! שירות לקוחות זמין ואדיב, מובילים סופר מקצועיים ואדיבים ומזנון mila שנראה כמו תכשיט יפה בסלון.',
    avatar: 'ס',
  },
  {
    id: 2,
    name: 'שמרית גדיש',
    rating: 5,
    date: 'לפני 3 שבועות',
    text: 'חוויית קנייה יוצאת מגדר הרגיל! מהרגע הראשון בשיחה עם טל ועד הכיוונון לאחר ההתקנה, הכל נעשה ברוח טובה, בשירותיות מעולה, בנועם ובהגינות. ממליצה בחום! 😊',
    avatar: 'ש',
  },
  {
    id: 3,
    name: 'מירי רבינוביץ',
    rating: 5,
    date: 'לפני חודש',
    text: 'פניתי אליהם וליווה אותי טל איש עם סבלנות ומקצועיות אין קץ. כשהמוצר לא התאים לי בתחושה - הם הסכימו להחליף את הספרייה. שירות יוצא מן הכלל!',
    avatar: 'מ',
  },
  {
    id: 4,
    name: 'משה רוזן',
    rating: 5,
    date: 'לפני 6 חודשים',
    text: 'החברים בבלאנו הבינו אותי מהרגע הראשון ואף הצליחו לייצר יש מאיין - ייצרו עבורי בדיוק את מה שרציתי במידות שלי. ממליץ בחום - אני עוד אחזור אליהם ❤️',
    avatar: 'מ',
  },
  {
    id: 5,
    name: 'Shmulik Mazor',
    rating: 5,
    date: 'לפני 3 חודשים',
    text: 'תודה לכם על מוצר מהמם. טל ליווה אותי בתהליך, ביצענו גם שינוי בפלטה העליונה כך שהגוון יתאים לקיר המעוצב שלנו והתוצאה לא פחות ממושלמת!',
    avatar: 'S',
  },
];

// Star Rating Component
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

// Single Review Card
function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="bg-white rounded-2xl rounded-bl-none p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-gray-700">{review.avatar}</span>
        </div>
        {/* Name & Date */}
        <div className="flex-1">
          <h4 className="font-bold text-sm">{review.name}</h4>
          <p className="text-gray-400 text-xs">{review.date}</p>
        </div>
        {/* Google Icon */}
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
      
      {/* Stars */}
      <div className="mb-3">
        <StarRating rating={review.rating} size="sm" />
      </div>
      
      {/* Review Text */}
      <p className="text-gray-600 text-sm leading-relaxed flex-1">{review.text}</p>
    </div>
  );
}

export function GoogleReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visibleCount = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const next = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <section className="py-20 md:py-28 bg-[#f5f5f0]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-english text-gray-400 text-xs tracking-[0.3em] uppercase mb-3">
            CUSTOMER REVIEWS
          </p>
          <h2 className="text-3xl md:text-5xl font-light mb-6">
            מה הלקוחות <span className="font-bold">אומרים</span>
          </h2>
          
          {/* Google Rating Summary */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-4xl md:text-5xl font-bold">{GOOGLE_RATING}</span>
              <div className="flex flex-col items-start">
                <StarRating rating={Math.round(GOOGLE_RATING)} size="md" />
                <span className="text-gray-500 text-xs mt-1">
                  מבוסס על {TOTAL_REVIEWS} ביקורות
                </span>
              </div>
            </div>
          </div>
          
          {/* Google Badge */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>ביקורות Google</span>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="הביקורת הקודמת"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          {currentIndex < maxIndex && (
            <button
              onClick={next}
              className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="הביקורת הבאה"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Reviews Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ 
                transform: `translateX(${currentIndex * (100 / visibleCount + (isMobile ? 0 : 2))}%)`,
              }}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className={`${isMobile ? 'w-full' : 'w-1/3'} flex-shrink-0`}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator - Mobile */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-black' : 'bg-gray-300'
                }`}
                aria-label={`עבור לביקורת ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Reviews Link */}
        <div className="text-center mt-10">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-gray-600 hover:text-black transition-colors group"
          >
            <span className="text-sm border-b border-gray-300 group-hover:border-black pb-1">
              לכל הביקורות בגוגל
            </span>
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
