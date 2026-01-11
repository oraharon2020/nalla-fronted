'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxImage {
  sourceUrl: string;
  altText?: string;
}

interface ProductLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductLightbox({ images, initialIndex = 0, isOpen, onClose }: ProductLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          // In RTL, left arrow goes to next
          setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowRight':
          // In RTL, right arrow goes to previous
          setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length, onClose]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        aria-label="סגור"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 text-white/80 text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="תמונה קודמת"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="תמונה הבאה"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Main image */}
      <div 
        className="relative w-fit h-fit max-w-[90vw] max-h-[80vh] mx-auto my-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {currentImage?.sourceUrl && (
          <Image
            src={currentImage.sourceUrl}
            alt=""
            width={1200}
            height={1200}
            className="object-contain max-w-[90vw] max-h-[80vh] w-auto h-auto"
            quality={90}
            priority
          />
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[90vw] overflow-x-auto py-2 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                index === currentIndex 
                  ? 'ring-2 ring-white opacity-100' 
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={img.sourceUrl}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
                quality={50}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
