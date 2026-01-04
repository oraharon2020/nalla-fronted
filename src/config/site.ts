/**
 * Site Configuration
 * ==================
 * כל הפרטים הספציפיים לאתר מרוכזים כאן.
 * לשכפול לאתר חדש - שנה רק את הקובץ הזה!
 */

export const siteConfig = {
  // Basic Info
  name: 'נלה',
  tagline: 'מעצבים את הבית',
  fullName: 'נלה - Nalla',
  description: 'מעצבים את הבית עם נלה | מזנונים | שולחנות סלון | תמונות קיר | קונסולות. משלוח חינם עד הבית!',
  shortDescription: 'מעצבים את הבית עם נלה. משלוח חינם עד הבית!',
  
  // URLs
  // TODO: לאחר ההעברה - לשנות url ל-https://www.nalla.co.il ו-wordpressUrl ל-https://admin.nalla.co.il
  url: 'http://localhost:3000', // בפיתוח - לשנות ל-https://www.nalla.co.il בפרודקשן
  wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://nalla.co.il',
  vercelUrl: 'https://nalla.vercel.app',
  
  // ============================================================
  // NAVIGATION - תפריט הניווט
  // ============================================================
  navigation: {
    // תפריט ראשי - מחשב (מוצג ב-Header)
    main: [
      { name: 'דף הבית', href: '/' },
      { name: 'SALE', slug: 'nalla-sale', highlight: true },
      {
        name: 'סלון',
        href: '/categories',
        children: [
          { name: 'מזנונים', slug: 'מזנונים-לסלון' },
          { name: 'שולחנות סלון', slug: 'שולחנות-סלון' },
          { name: 'ספריות', slug: 'ספריות' },
          { name: 'ספות', slug: 'ספות' },
        ],
      },
      {
        name: 'חדר שינה',
        href: '/categories',
        children: [
          { name: 'מיטות', slug: 'מיטות-לחדר-שינה' },
          { name: 'קומודות', slug: 'קומודות' },
          { name: 'שידות לילה', slug: 'שידות-לצד-המיטה' },
        ],
      },
      {
        name: 'פינת אוכל',
        href: '/categories',
        children: [
          { name: 'פינות אוכל', slug: 'פינות-אוכל' },
          { name: 'שולחנות בר', slug: 'שולחנות-בר' },
        ],
      },
      {
        name: 'כניסה ומסדרון',
        href: '/categories',
        children: [
          { name: 'קונסולות', slug: 'קונסולות' },
          { name: 'מראות', slug: 'מראות' },
          { name: 'ארונות שירות', slug: 'shirot' },
        ],
      },
    ],
    
    // קישורים מהירים (ללא dropdown)
    quickLinks: [
      { name: 'מזנונים', slug: 'מזנונים-לסלון' },
      { name: 'שולחנות סלון', slug: 'שולחנות-סלון' },
      { name: 'קומודות', slug: 'קומודות' },
      { name: 'קונסולות', slug: 'קונסולות' },
      { name: 'שידות לילה', slug: 'שידות-לצד-המיטה' },
      { name: 'מיטות', slug: 'מיטות-לחדר-שינה' },
      { name: 'ספריות', slug: 'ספריות' },
    ],
    
    // דפי מידע
    info: [
      { name: 'בלוג', href: '/blog' },
      { name: 'אודותינו', href: '/page/about-us' },
      { name: 'צרו קשר', href: '/contact' },
      { name: 'שאלות נפוצות', href: '/faq' },
      { name: 'הצהרת נגישות', href: '/accessibility' },
    ],
  },

  // Contact
  email: 'info@nalla.co.il',
  phone: '03-3732350',
  phoneClean: '033732350', // Without dashes for tel: links
  whatsapp: '972559871850', // International format for WhatsApp
  
  // Social Media
  social: {
    instagram: 'https://www.instagram.com/nalla_decor/',
    instagramHandle: 'nalla_decor',
    facebook: 'https://www.facebook.com/nollaisrael',
    facebookHandle: 'nollaisrael',
  },
  
  // SEO Keywords
  keywords: [
    'רהיטים',
    'מזנונים',
    'שולחנות סלון',
    'קומודות',
    'קונסולות',
    'מיטות',
    'תמונות קיר',
    'נלה',
    'nalla',
    'ריהוט לבית',
    'ריהוט מעוצב',
    'רהיטים אונליין',
  ],
  
  // Images/Logos
  // TODO: להעלות לוגו של נלה לתיקיית public/images
  logo: {
    dark: '/images/nalla-logo.png', // Black logo on transparent
    light: '/images/nalla-logo-white.png', // White logo for dark backgrounds
    square: '/images/nalla-logo-square.png',
    wordpressUrl: 'https://nalla.co.il/wp-content/uploads/2025/09/logo-19.png',
  },
  favicon: {
    // TODO: לעדכן עם favicon של נלה
    ico32: 'https://nalla.co.il/wp-content/uploads/2025/09/logo-19.png',
    ico192: 'https://nalla.co.il/wp-content/uploads/2025/09/logo-19.png',
    appleTouchIcon: 'https://nalla.co.il/wp-content/uploads/2025/09/logo-19.png',
  },
  ogImage: '/images/nalla-logo.png',
  
  // Analytics & Tracking
  // TODO: לעדכן עם קודי Analytics של נלה!
  analytics: {
    googleTagManager: '', // TODO: להוסיף GTM של נלה
    googleAds: '', // TODO: להוסיף Google Ads של נלה
    googleAdsConversionLabel: '', // TODO: Purchase conversion
    googleAdsAddToCartLabel: '', // TODO: Add to cart conversion
    googleVerification: '', // TODO: Google Search Console verification
    facebookPixel: '', // TODO: להוסיף Facebook Pixel של נלה
    facebookDomainVerification: '', // TODO: Facebook domain verification
  },
  
  // Business Info (for JSON-LD)
  business: {
    type: 'FurnitureStore',
    priceRange: '₪₪₪',
    address: {
      street: 'אברהם בומא שביט 1, מחסן F-101',
      city: 'ראשון לציון',
      region: 'מרכז',
      postalCode: '',
      country: 'IL',
    },
    geo: {
      latitude: 31.9697,
      longitude: 34.7722,
    },
    openingHours: [
      'Su-Th 10:00-20:00',
      'Fr 10:00-14:00',
    ],
  },
  
  // WooCommerce API (these should match .env.local)
  woocommerce: {
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  },
  
  // Payment Gateway - Meshulam
  // TODO: לעדכן עם פרטי משולם של נלה!
  // Note: Page codes are fetched from WordPress, these are fallbacks
  meshulam: {
    userId: process.env.MESHULAM_USER_ID || '', // TODO: להוסיף userId של נלה
    apiKey: process.env.MESHULAM_API_KEY || '', // TODO: להוסיף apiKey של נלה
    sandboxApiKey: process.env.MESHULAM_SANDBOX_API_KEY || '',
    isSandbox: process.env.MESHULAM_SANDBOX === 'true',
    // Default page codes (will be overridden by WordPress settings)
    pageCodes: {
      creditCard: process.env.MESHULAM_PAGECODE_CREDIT || '', // TODO
      bit: process.env.MESHULAM_PAGECODE_BIT || '', // TODO
      applePay: process.env.MESHULAM_PAGECODE_APPLE || '', // TODO
      googlePay: process.env.MESHULAM_PAGECODE_GOOGLE || '', // TODO
    },
  },
  
  // Prefix for localStorage, cookies, etc.
  prefix: 'nalla',
  
  // API namespace - keep as 'bellano' because the WordPress plugin uses this namespace
  apiNamespace: 'bellano',
  
  // Default banner image
  defaultBannerImage: 'https://nalla.co.il/wp-content/uploads/2025/09/banner-main.jpg',
  
  // Currency
  currency: {
    code: 'ILS',
    symbol: '₪',
    locale: 'he-IL',
  },
  
  // Locale
  locale: 'he_IL',
  language: 'he',
  direction: 'rtl',
} as const;

// Helper function to get full URL
export const getFullUrl = (path: string = '') => {
  return `${siteConfig.url}${path}`;
};

// Helper function to get WordPress URL
export const getWpUrl = (path: string = '') => {
  return `${siteConfig.wordpressUrl}${path}`;
};

// Helper function to fix media URLs - convert nalla.co.il to admin.nalla.co.il
// TODO: לאחר העברת WordPress ל-admin.nalla.co.il - להפעיל את הפונקציה
export const fixMediaUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  // כרגע WordPress יושב על nalla.co.il אז לא צריך להמיר
  // לאחר ההעברה: Replace any nalla.co.il/wp-content URL with admin.nalla.co.il
  // return url.replace(
  //   /https?:\/\/(www\.)?nalla\.co\.il\/wp-content/g,
  //   'https://admin.nalla.co.il/wp-content'
  // );
  return url;
};

// Helper function to get API endpoint
export const getApiEndpoint = (endpoint: string) => {
  return `${siteConfig.wordpressUrl}/wp-json/${siteConfig.apiNamespace}/v1/${endpoint}`;
};

// Helper function to format phone for tel: link
export const getTelLink = () => {
  return `tel:${siteConfig.phoneClean}`;
};

// Helper function to get WhatsApp link
export const getWhatsAppLink = (message?: string) => {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export type SiteConfig = typeof siteConfig;
