import Link from 'next/link';
import Image from 'next/image';
import { getProductsWithSwatches, getCategories, transformCategory, getProductsByCategorySlugWithSwatches } from '@/lib/woocommerce';
import { WhatsAppSubscribeForm } from '@/components/home/WhatsAppSubscribeForm';
import { GoogleReviews } from '@/components/home/GoogleReviews';
import { ShopByRoom } from '@/components/home/ShopByRoom';
import { BestSellersCarousel } from '@/components/home/BestSellersCarousel';
import { HappyHomesReviews } from '@/components/home/HappyHomesReviews';
import { siteConfig, getApiEndpoint, fixMediaUrl } from '@/config/site';

// Helper to get optimized image URL through Next.js
const getOptimizedImageUrl = (src: string, width: number = 750) => {
  if (!src) return '';
  // Use Next.js image optimization API
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
};

// Types for homepage banners
interface HomepageBanner {
  mediaType: 'image' | 'video';
  image: string;
  mobileImage: string;
  video: string;
  mobileVideo: string;
  videoPoster: string;
  videoAutoplay: boolean;
  videoLoop: boolean;
  videoMuted: boolean;
  title: string;
  titleFont: 'hebrew' | 'english';
  titleWeight: 'normal' | 'bold';
  subtitle: string;
  subtitleFont: 'hebrew' | 'english';
  subtitleWeight: 'normal' | 'bold';
  buttonText: string;
  buttonFont: 'hebrew' | 'english';
  buttonWeight: 'normal' | 'bold';
  buttonLink: string;
  textColor: 'white' | 'black';
  textPosition: 'top' | 'center' | 'bottom';
}

// Fetch homepage data from WordPress
async function getHomepageData(): Promise<{ banners: HomepageBanner[] } | null> {
  try {
    const res = await fetch(getApiEndpoint('homepage'), {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Hero Banner Component - Now supports video!
async function HeroSection() {
  const homepageData = await getHomepageData();
  const banner = homepageData?.banners?.[0]; // Get first banner
  
  // Default values if no banner from WordPress
  const mediaType = banner?.mediaType || 'image';
  const imageUrl = banner?.image || siteConfig.defaultBannerImage;
  const mobileImageUrl = banner?.mobileImage || imageUrl;
  const videoUrl = fixMediaUrl(banner?.video) || '';
  const mobileVideoUrl = fixMediaUrl(banner?.mobileVideo) || videoUrl; // Fallback to main video
  const videoPoster = banner?.videoPoster || imageUrl;
  const title = banner?.title || '';
  const titleFont = banner?.titleFont || 'hebrew';
  const titleWeight = banner?.titleWeight || 'bold';
  const subtitle = banner?.subtitle || '';
  const subtitleFont = banner?.subtitleFont || 'hebrew';
  const subtitleWeight = banner?.subtitleWeight || 'normal';
  const buttonText = banner?.buttonText || '';
  const buttonFont = banner?.buttonFont || 'english';
  const buttonWeight = banner?.buttonWeight || 'normal';
  const buttonLink = banner?.buttonLink || '/categories';
  const textColor = banner?.textColor || 'white';
  const textPosition = banner?.textPosition || 'center';
  
  // Check if we have any video (desktop or mobile)
  const hasDesktopVideo = mediaType === 'video' && videoUrl;
  const hasMobileVideo = mediaType === 'video' && mobileVideoUrl;
  
  // Font classes helper
  const getFontClass = (font: string, weight: string) => {
    const fontClass = font === 'english' ? 'font-english' : '';
    const weightClasses: Record<string, string> = {
      light: 'font-light',
      normal: 'font-normal',
      bold: 'font-bold'
    };
    const weightClass = weightClasses[weight] || 'font-normal';
    return `${fontClass} ${weightClass}`.trim();
  };
  
  const textColorClass = textColor === 'white' ? 'text-white' : 'text-black';
  const textColorMuted = textColor === 'white' ? 'text-white/90' : 'text-black/80';
  const overlayClass = textColor === 'white' ? 'bg-black/30' : 'bg-white/30';
  
  // Text position classes
  const positionClasses = {
    top: 'items-start pt-24 md:pt-32',
    center: 'items-center',
    bottom: 'items-end pb-24 md:pb-32'
  };
  const textPositionClass = positionClasses[textPosition] || positionClasses.center;

  return (
    <section className="py-4 px-4">
      <div className="max-w-[1300px] mx-auto">
        {/* Banner Image Container */}
        <div className="relative overflow-hidden rounded-tr-[50px] rounded-br-[50px] rounded-bl-[50px] rounded-tl-none">
      {/* Background - Video or Image */}
      <div className="relative bg-[#f5f5f0]">
        {/* Desktop: Show video if available, otherwise image */}
        {hasDesktopVideo ? (
          <video
            autoPlay
            muted
            playsInline
            poster={getOptimizedImageUrl(videoPoster || imageUrl, 1200)}
            className="w-full h-auto hidden md:block"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={imageUrl}
            alt="נלה - מעצבים את הבית"
            className="w-full h-auto hidden md:block"
          />
        )}
        
        {/* Mobile: Show video if available, otherwise image */}
        {hasMobileVideo ? (
          <video
            autoPlay
            muted
            playsInline
            poster={getOptimizedImageUrl(videoPoster || mobileImageUrl, 750)}
            className="w-full h-auto md:hidden"
          >
            <source src={mobileVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={mobileImageUrl}
            alt="נלה - מעצבים את הבית"
            className="w-full h-auto md:hidden"
          />
        )}
      </div>

      {/* Content - Only show if there's any text */}
      {(title || subtitle || buttonText) && (
        <div className={`relative h-full flex ${textPositionClass} justify-center text-center`}>
          <div className="max-w-3xl px-6">
            {title && (
              <h1 className={`text-4xl md:text-6xl lg:text-7xl ${getFontClass(titleFont, titleWeight)} ${textColorClass} mb-6 leading-tight ${titleFont === 'english' ? 'tracking-wider' : ''}`}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className={`${getFontClass(subtitleFont, subtitleWeight)} ${textColorMuted} text-lg md:text-xl mb-8 ${subtitleFont === 'english' ? 'tracking-wide' : ''}`}>
                {subtitle}
              </p>
            )}
            {buttonText && buttonLink && (
              <Link
                href={buttonLink}
                className={`inline-block ${getFontClass(buttonFont, buttonWeight)} ${textColor === 'white' ? 'bg-white text-black hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-white hover:text-black'} px-8 py-4 text-sm tracking-wider transition-all duration-300 uppercase`}
              >
                {buttonText}
              </Link>
            )}
          </div>
        </div>
      )}
        </div>
      
        {/* WELCOME HOME Text - Below banner with negative margin to overlap */}
        <div className="flex justify-center -mt-[20px] md:-mt-[80px] lg:-mt-[50px] relative z-10">
          <span className="font-english text-[32px] md:text-[80px] lg:text-[100px] font-[300] text-[#333] tracking-[0.15em] md:tracking-[0.2em] leading-none" aria-hidden="true">
            WELCOME HOME
          </span>
        </div>
      </div>
    </section>
  );
}

// Categories Section - Beautiful Full-Width Cards with Hover Effects
async function CategoriesSection() {
  // Define category type
  interface CategoryItem {
    id: string | number;
    name: string;
    slug: string;
    image?: { sourceUrl: string };
  }
  
  // Try to get featured categories from WordPress, fallback to WooCommerce
  let categories: CategoryItem[] = [];
  
  try {
    const res = await fetch(getApiEndpoint('featured-categories'), {
      next: { revalidate: 300 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.categories && data.categories.length > 0) {
        categories = data.categories;
      }
    }
  } catch {
    // Fallback to WooCommerce categories
  }
  
  // Fallback: get from WooCommerce
  if (categories.length === 0) {
    const wooCategories = await getCategories({ per_page: 20, hide_empty: true });
    categories = wooCategories
      .filter((cat: { parent: number }) => cat.parent === 0)
      .map(transformCategory) as CategoryItem[];
  }

  // Category descriptions for better engagement
  const categoryDescriptions: Record<string, string> = {
    'ספות': 'נוחות מושלמת לכל רגע בבית',
    'כורסאות': 'עיצוב ייחודי שמשדרג כל חלל',
    'שולחנות': 'מרכז הבית שלכם',
    'כסאות': 'סטייל ונוחות בכל ארוחה',
    'מיטות': 'שינה איכותית בעיצוב מרהיב',
    'ארונות': 'פתרונות אחסון חכמים',
    'default': 'גלו את הקולקציה המלאה'
  };

  return (
    <section className="py-10 md:py-14 bg-[#fafaf8]">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-light">
            הקולקציות <span className="font-bold">שלנו</span>
          </h2>
        </div>

        {/* Categories Grid - 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/product-category/${category.slug}`}
              className="group"
            >
              {/* Card Container */}
              <div className="flex flex-col">
                {/* Image Container - Square 1:1 with rounded corners except top-left */}
                <div className="relative aspect-square overflow-hidden rounded-2xl rounded-tl-none bg-[#f5f5f0] shadow-sm group-hover:shadow-lg transition-all duration-500">
                  {/* Background Image */}
                  {category.image?.sourceUrl && (
                    <Image
                      src={category.image.sourceUrl}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 420px"
                      quality={75}
                    />
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                
                {/* Category Name - below image */}
                <div className="pt-4 pb-2">
                  <h3 className="text-[#333] text-base md:text-lg font-medium text-center">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-3 text-[#333] hover:text-black transition-colors group"
          >
            <span className="text-base border-b border-gray-400 group-hover:border-black pb-1">
              לכל הקטגוריות
            </span>
            <span className="group-hover:-translate-x-1 transition-transform text-lg">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Best Sellers Section - Wrapper to fetch data
async function BestSellersSection() {
  const products = await getProductsWithSwatches({ per_page: 10, orderby: 'popularity' });
  return <BestSellersCarousel products={products} />;
}

// Nalla Sale Section - Products on sale
async function NallaSaleSection() {
  const products = await getProductsByCategorySlugWithSwatches('nalla-sale', { per_page: 10 });
  return <BestSellersCarousel products={products} title="NALLA SALE" />;
}

// Choose Your Color Section - Tambour painting
function ChooseColorSection() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
          {/* Left - Image */}
          <div className="w-full md:w-1/2">
            <Image
              src="https://nalla.co.il/wp-content/uploads/2025/09/tanoor.png.webp"
              alt="צביעה בתנור"
              width={600}
              height={500}
              className="w-full h-auto"
            />
          </div>
          
          {/* Right - Content */}
          <div className="w-full md:w-1/2 text-right">
            <h2 className="font-english text-[40px] md:text-[50px] lg:text-[60px] font-[300] italic text-[#333] leading-tight mb-4">
              CHOOSE<br />YOUR COLOR
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-[#333] mb-6">
              צביעה בתנור - כל צבע אפשרי!
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              מתלבטים איזה צבע מתאים לרהיטים שלכם? הצוות שלנו כאן לייעץ
              ולהתאים עבורכם את הגוון המושלם. תוכלו להגיע לתצוגה שלנו ולהתרשם
              ממניפת צבעי טמבור מקרוב, לבחור את הצבע המדויק ולראות איך הוא
              משתלב במציאות!
            </p>
            <Link 
              href="/tambour-color"
              className="inline-flex items-center flex-row-reverse gap-2 text-[#333] hover:text-black transition-colors group"
            >
              <span className="group-hover:translate-x-1 transition-transform">↙</span>
              <span className="border-b border-gray-400 group-hover:border-black pb-1">
                לצפייה במניפת צבעי טמבור
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Showroom Video Section
function ShowroomSection() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* OUR SHOWROOM Title - Same style as WELCOME HOME */}
        <div className="flex justify-center relative z-10">
          <h2 className="font-english text-[32px] md:text-[80px] lg:text-[100px] font-[300] text-[#333] tracking-[0.15em] md:tracking-[0.2em] leading-none">
            OUR SHOWROOM
          </h2>
        </div>
        
        {/* Video - with negative margin to overlap title */}
        <div className="relative w-full aspect-video rounded-[30px] overflow-hidden -mt-[15px] md:-mt-[70px] lg:-mt-[50px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/nalla-showroom.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section - Inspired Living design
function NewsletterSection() {
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
            
            {/* Form */}
            <form className="flex flex-col md:flex-row gap-3 items-center justify-center mb-4">
              <input
                type="text"
                placeholder="שם מלא (חובה)"
                className="w-full md:w-auto px-6 py-3 rounded-full border border-gray-300 bg-white text-right text-sm focus:outline-none focus:border-gray-400"
                required
              />
              <input
                type="tel"
                placeholder="טלפון (חובה)"
                className="w-full md:w-auto px-6 py-3 rounded-full border border-gray-300 bg-white text-right text-sm focus:outline-none focus:border-gray-400"
                required
              />
              <input
                type="email"
                placeholder="אימייל (חובה)"
                className="w-full md:w-auto px-6 py-3 rounded-full border border-gray-300 bg-white text-right text-sm focus:outline-none focus:border-gray-400"
                required
              />
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                שלח פרטים
              </button>
            </form>
            
            {/* Checkbox */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-[#333]">מאשר/ת קבלת חומר פרסומי</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Instagram Section
// To update images: Replace files in /public/images/instagram/
// Files: 1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg, 6.jpg
function InstagramSection() {
  // Images loaded from: public/images/instagram/1.jpg through 6.jpg
  // Just replace those files to change the images!
  const instagramImages = [
    '/images/instagram/1.jpg',
    '/images/instagram/2.jpg',
    '/images/instagram/3.jpg',
    '/images/instagram/4.jpg',
    '/images/instagram/5.jpg',
    '/images/instagram/6.jpg',
  ];
  
  const instagramHandle = siteConfig.social.instagramHandle;

  return (
    <section className="py-10 md:py-20">
      <div className="container mx-auto px-4 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-english text-gray-400 text-xs tracking-[0.3em] uppercase mb-3">
              @{instagramHandle.toUpperCase()}
            </p>
            <h2 className="text-3xl md:text-4xl font-light">
              עקבו <span className="font-bold">אחרינו</span>
            </h2>
          </div>
          <a 
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors group"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>עקבו אחרינו באינסטגרם</span>
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
          </a>
        </div>
      </div>
      
      {/* Full Width Image Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
        {instagramImages.map((img, index) => (
          <a
            key={index}
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden group bg-[#f5f5f0]"
          >
            <Image
              src={img}
              alt={`Instagram ${index + 1}`}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 33vw, 200px"
              quality={75}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// Stone Travertine Collection Section
function StoneTravertineSection() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-8">
          {/* Right Side - Image + Text (60%) */}
          <div className="w-full md:w-[60%]">
            {/* Sideboard Image */}
            <div className="relative rounded-[30px] rounded-tl-none overflow-hidden bg-[#f5f5f0] mb-6">
              <Image
                src="https://nalla.co.il/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-07-at-12.15.58-1.jpg.webp"
                alt="מזנון Stone Travertine"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Title and CTA */}
            <div className="text-left">
              <h2 className="font-english text-[40px] md:text-[50px] lg:text-[60px] font-[400] text-[#333] tracking-wide leading-none mb-2">
                STONE TRAVERTINE
              </h2>
              <p className="font-english text-sm md:text-base text-gray-500 tracking-[0.3em] mb-4">
                .STONE. STYLE. STATEMENT
              </p>
              <Link 
                href="/product-tag/stone-travertine"
                className="inline-flex items-center gap-2 text-[#333] hover:text-black transition-colors group"
              >
                <span className="border-b border-gray-400 group-hover:border-black pb-1">
                  לצפיה בקולקציה
                </span>
                <span className="group-hover:translate-x-1 transition-transform">↙</span>
              </Link>
            </div>
          </div>
          
          {/* Left Side - Table Image (40%) */}
          <div className="w-full md:w-[40%] flex items-end">
            <div className="relative rounded-[30px] rounded-tl-none overflow-hidden bg-[#f5f5f0] w-full">
              <Image
                src="https://nalla.co.il/wp-content/uploads/2025/09/DSC_9517-1.jpg.webp"
                alt="שולחן Stone Travertine"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default async function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CategoriesSection />
      <ShopByRoom />
      <BestSellersSection />
      <ShowroomSection />
      <ChooseColorSection />
      <NewsletterSection />
      <NallaSaleSection />
      <StoneTravertineSection />
      <HappyHomesReviews />
    </div>
  );
}
