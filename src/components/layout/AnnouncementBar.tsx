'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Announcement {
  text: string;
  link?: string;
  bg_color?: string;
  text_color?: string;
}

interface AnnouncementsData {
  enabled: boolean;
  interval: number;
  announcements: Announcement[];
}

const defaultAnnouncements: AnnouncementsData = {
  enabled: true,
  interval: 5000,
  announcements: [
    {
      text: 'מגוון מוצרים בהנחות ענק בקטגוריית NALLA SALE בין 20% ל-50% הנחה!',
      link: '/product-category/nalla-sale',
      bg_color: '#e1eadf',
      text_color: '#4a7c59',
    },
  ],
};

export function AnnouncementBar() {
  const [data, setData] = useState<AnnouncementsData>(defaultAnnouncements);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Fetch announcements from API
  useEffect(() => {
    setIsHydrated(true);
    
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcements');
        if (res.ok) {
          const json = await res.json();
          if (json.announcements && json.announcements.length > 0) {
            setData(json);
          }
        }
      } catch (error) {
        console.log('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Auto-rotate announcements
  useEffect(() => {
    if (!isHydrated || !data.enabled || data.announcements.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % data.announcements.length);
        setIsAnimating(false);
      }, 300);
    }, data.interval);

    return () => clearInterval(interval);
  }, [isHydrated, data.enabled, data.announcements.length, data.interval]);

  // Don't render if disabled
  if (!data.enabled) {
    return null;
  }

  const currentAnnouncement = data.announcements[currentIndex];
  
  if (!currentAnnouncement) {
    return null;
  }

  const content = (
    <span
      className={`transition-all duration-300 ${
        isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
      }`}
    >
      {currentAnnouncement.text}
    </span>
  );

  return (
    <div className="px-4 py-2">
      <div
        className="max-w-[1300px] mx-auto text-center py-3 px-3 text-sm font-medium rounded-[50px] overflow-hidden"
        style={{
          backgroundColor: currentAnnouncement.bg_color || '#e1eadf',
          color: currentAnnouncement.text_color || '#4a7c59',
        }}
      >
        {currentAnnouncement.link ? (
          <Link 
            href={currentAnnouncement.link} 
            className="hover:underline block"
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
