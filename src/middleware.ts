import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ===========================================
  // 1. REMOVE UNWANTED QUERY PARAMS (prevent duplicate content)
  // ===========================================
  
  // Category pages - remove sorting/filter params
  if (pathname.startsWith('/product-category/')) {
    const hasUnwantedParams = 
      searchParams.has('orderby') || 
      searchParams.has('order') ||
      searchParams.has('filter_color') ||
      searchParams.has('min_price') ||
      searchParams.has('max_price') ||
      searchParams.has('paged') ||
      searchParams.has('product_cat');
    
    if (hasUnwantedParams) {
      const cleanUrl = new URL(pathname, request.url);
      if (searchParams.has('page')) {
        cleanUrl.searchParams.set('page', searchParams.get('page')!);
      }
      return NextResponse.redirect(cleanUrl, 308);
    }
  }

  // Product pages - remove cart/variation params
  if (pathname.startsWith('/product/')) {
    const hasUnwantedParams = 
      searchParams.has('add-to-cart') ||
      searchParams.has('attribute_pa_color') ||
      searchParams.has('attribute_pa_size') ||
      searchParams.has('variation_id') ||
      searchParams.has('nocache') ||
      searchParams.has('gad_source') ||
      searchParams.has('gclid') ||
      searchParams.has('fbclid');
    
    if (hasUnwantedParams) {
      const cleanUrl = new URL(pathname, request.url);
      return NextResponse.redirect(cleanUrl, 308);
    }
  }

  // Product-tag pages
  if (pathname.startsWith('/product-tag/') && searchParams.has('orderby')) {
    const cleanUrl = new URL(pathname, request.url);
    return NextResponse.redirect(cleanUrl, 308);
  }

  // ===========================================
  // 2. SPECIFIC DELETED PRODUCTS -> CATEGORY
  // ===========================================
  
  // Categories that work: מזונים-לסלון, קומודות, מראות, שולחנות-סלון, פינות-אוכל, carpet, ספריות, קונסולות
  const deletedProductRedirects: Record<string, string> = {
    // שולחנות סלון
    'שולחן-דגם-lines': '/product-category/שולחנות-סלון',
    'שולחן-דגם-״lines״': '/product-category/שולחנות-סלון',
    'שולחן-עגול-״ring״': '/product-category/שולחנות-סלון',
    
    // מזנונים - מזונים (שגיאת כתיב בכוונה)
    'מזנון-padani': '/product-category/מזונים-לסלון',
    'מזנון-דגם-״ניס״': '/product-category/מזונים-לסלון',
    'מזנון-דגם-״idan״': '/product-category/מזונים-לסלון',
    'מזנון-לסלון-דגם-״new-york״': '/product-category/מזונים-לסלון',
    'מזנון-דגם-״rayne״ב': '/product-category/מזונים-לסלון',
    
    // קומודות
    'קומודה-דגם-״london״': '/product-category/קומודות',
    'קומודה-דגם-״liz״': '/product-category/קומודות',
    'קומודה-מותאמת-אישית': '/product-category/קומודות',
    
    // מראות
    'מראה-דגם-yuli': '/product-category/מראות',
    'מראה-דגם-lavi': '/product-category/מראות',
    'מראה-מלבנית-דגם-״mia': '/product-category/מראות',
    'מראה-מלבנית-דגם-״-amber״': '/product-category/מראות',
    'מראה-אובלית-דגם-״kim״': '/product-category/מראות',
    'מראה-מלבנית-דגם-״mykonos': '/product-category/מראות',
    
    // פינות אוכל
    'פינת-אוכל-נפתחת-דגם-״merllo״': '/product-category/פינות-אוכל',
    'ספה-פינתית-דגם-peter-שזלונג-פינתי': '/product-category/פינות-אוכל',
    
    // שטיחים
    'שטיח-דגם-x': '/product-category/carpet',
    'שטיח-דגם-y': '/product-category/carpet',
    
    // ספריות
    'ספרייה-מותאמת-אישית': '/product-category/ספריות',
    
    // קונסולות
    'טורונטו': '/product-category/קונסולות',
    
    // תמונות/אמנות -> קטגוריית תמונות-קיר
    'alma': '/product-category/תמונות-קיר',
    'navy-01': '/product-category/תמונות-קיר',
    'navy-02': '/product-category/תמונות-קיר',
    'navy-03': '/product-category/תמונות-קיר',
    'long-01': '/product-category/תמונות-קיר',
    'long-02': '/product-category/תמונות-קיר',
    'long-04': '/product-category/תמונות-קיר',
    'nev-01': '/product-category/תמונות-קיר',
    'nev-02': '/product-category/תמונות-קיר',
    'nev-03': '/product-category/תמונות-קיר',
    'nev-04': '/product-category/תמונות-קיר',
    'shapes-01': '/product-category/תמונות-קיר',
    'shapes-02': '/product-category/תמונות-קיר',
    'shapes-03': '/product-category/תמונות-קיר',
    'shapes-04': '/product-category/תמונות-קיר',
    'nature-02': '/product-category/תמונות-קיר',
    'nature-03': '/product-category/תמונות-קיר',
    'nature-04': '/product-category/תמונות-קיר',
    'goldblack-01': '/product-category/תמונות-קיר',
    'goldblack-02': '/product-category/תמונות-קיר',
    'goldblack-03': '/product-category/תמונות-קיר',
    'goldblack-04': '/product-category/תמונות-קיר',
    'green-leaves-01': '/product-category/תמונות-קיר',
    'green-leaves-03': '/product-category/תמונות-קיר',
    'gold': '/product-category/תמונות-קיר',
    'gold-01': '/product-category/תמונות-קיר',
    'gold-03': '/product-category/תמונות-קיר',
    'kaya': '/product-category/תמונות-קיר',
    'זוג-תמונות-kaya-02': '/product-category/תמונות-קיר',
    'celia': '/product-category/תמונות-קיר',
    'rose': '/product-category/תמונות-קיר',
    'book': '/product-category/תמונות-קיר',
    'bubbles': '/product-category/תמונות-קיר',
    'rox': '/product-category/תמונות-קיר',
    'loren': '/product-category/תמונות-קיר',
    'tik': '/product-category/תמונות-קיר',
    'chicago': '/product-category/תמונות-קיר',
    'toyota': '/product-category/תמונות-קיר',
    'bangkok': '/product-category/תמונות-קיר',
    'lima': '/product-category/תמונות-קיר',
    'mayo-2': '/product-category/תמונות-קיר',
    'willow-2': '/product-category/תמונות-קיר',
    
    // מוצרים עם שם חתוך/לא תקין
    'שידת-צד-מיטה-דגם-״nalla״-אלון-שחור': '/product-category/קומודות',
    'שידת-צד-מיטה-צפה-דגם-״merllo״': '/product-category/קומודות',
    'שידת-צד-מיטה-דגם-״-kloy״': '/product-category/קומודות',
    'מיטה-זוגית-מעץ-מלא-דגם-״oli״': '/',
    'שידה-דגם-״ליינס״': '/product-category/קומודות',
  };
  
  if (pathname.startsWith('/product/')) {
    const productSlug = decodeURIComponent(pathname.replace('/product/', '').replace(/\/$/, ''));
    
    // Check for specific deleted products first
    for (const [deletedSlug, redirectTo] of Object.entries(deletedProductRedirects)) {
      if (productSlug === deletedSlug || productSlug.startsWith(deletedSlug + '-')) {
        return NextResponse.redirect(new URL(redirectTo, request.url), 301);
      }
    }
  }

  // ===========================================
  // 3. PRODUCT VARIANTS -> ORIGINAL PRODUCT
  // ===========================================
  
  // Redirect "מלאי מבצע" / "סייל מיוחד" / "העתק" variants to original product
  if (pathname.startsWith('/product/')) {
    const productSlug = pathname.replace('/product/', '').replace(/\/$/, '');
    
    // Patterns to remove from product slugs
    const variantPatterns = [
      /-מלאי-מבצע-?\d*$/,           // -מלאי-מבצע or -מלאי-מבצע-2
      /-סייל-מיוחד-?\d*-?\d*-?\d*$/, // -סייל-מיוחד-27-31-7
      /-העתק-?\d*$/,                 // -העתק or -העתק-2
      /-סייל$/,                      // -סייל
      /-מבצע$/,                      // -מבצע
      // Removed /-2$|-3$|-4$/ pattern - it was breaking real products like tomas-2
    ];
    
    let cleanSlug = productSlug;
    for (const pattern of variantPatterns) {
      cleanSlug = cleanSlug.replace(pattern, '');
    }
    
    // If slug was cleaned, redirect to original product
    if (cleanSlug !== productSlug && cleanSlug.length > 0) {
      return NextResponse.redirect(new URL(`/product/${cleanSlug}`, request.url), 301);
    }
  }

  // ===========================================
  // 4. REDIRECT OLD/DELETED PAGES
  // ===========================================

  // Spaces -> product-tag (spaces is just an alias for product_tag in WooCommerce permalinks)
  if (pathname.startsWith('/spaces/')) {
    const tag = pathname.replace('/spaces/', '').replace(/\/$/, '');
    return NextResponse.redirect(new URL(`/product-tag/${tag}`, request.url), 301);
  }

  // Collaboration/draft pages -> home
  if (pathname.startsWith('/collaboration/')) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // Old home pages -> home
  if (pathname === '/home-03/' || pathname === '/home-05/' || pathname === '/home-03' || pathname === '/home-05') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // ERP/internal pages -> home
  if (pathname === '/erp-subscription' || pathname === '/designer-dashboard' || pathname === '/customer-files/' || pathname === '/recently-viewed-products') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // 404 page redirect
  if (pathname === '/404-page/' || pathname === '/404-page') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // Old category pages
  if (pathname === '/product-category/new-2023' || pathname === '/product-category/nolla-sale') {
    return NextResponse.redirect(new URL('/product-category/nalla-sale', request.url), 301);
  }

  // Product category base without slug
  if (pathname === '/product-category' || pathname === '/product-category/') {
    return NextResponse.redirect(new URL('/categories', request.url), 301);
  }

  // Old tag pages
  if (pathname.startsWith('/ts_portfolio_cat/') || pathname.startsWith('/tag/')) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // ===========================================
  // 3. BLOCK FEED/API URLs (return 404)
  // ===========================================

  // Feed URLs - redirect to main page
  if (pathname.endsWith('/feed') || pathname.endsWith('/feed/')) {
    const basePath = pathname.replace(/\/feed\/?$/, '');
    return NextResponse.redirect(new URL(basePath || '/', request.url), 301);
  }

  // WP API endpoints that shouldn't be indexed
  if (pathname.startsWith('/wp-json/pys-') || pathname.startsWith('/cdn-cgi/')) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // ===========================================
  // 4. BLOCK QUERY PARAM PAGES
  // ===========================================

  // Query param based pages (like ?page_id=, ?post_type=)
  if (searchParams.has('page_id') || searchParams.has('post_type')) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match product-category paths
    '/product-category/:path*',
    // Match product paths  
    '/product/:path*',
    // Match product-tag paths
    '/product-tag/:path*',
    // Match spaces paths (WP custom taxonomy)
    '/spaces/:path*',
    // Match old pages
    '/collaboration/:path*',
    '/home-03/:path*',
    '/home-05/:path*',
    '/erp-subscription',
    '/designer-dashboard',
    '/customer-files/:path*',
    '/recently-viewed-products',
    '/404-page/:path*',
    '/ts_portfolio_cat/:path*',
    '/tag/:path*',
    // Match feed URLs
    '/:path*/feed',
    // Match WP endpoints
    '/wp-json/:path*',
    '/cdn-cgi/:path*',
    // Match query param pages
    '/',
  ],
};
