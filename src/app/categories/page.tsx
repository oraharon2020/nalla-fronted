import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/woocommerce/api';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: `כל הקטגוריות | ${siteConfig.fullName}`,
  description: `צפו בכל הקטגוריות של רהיטי ${siteConfig.name} - מזנונים, שולחנות, קומודות, כורסאות ועוד`,
};

export default async function CategoriesPage() {
  // Fetch real categories from WooCommerce
  let wooCategories: any[] = [];
  try {
    wooCategories = await getCategories({ per_page: 100, hide_empty: true });
  } catch (error) {
    console.error('Error fetching categories:', error);
    wooCategories = [];
  }
  
  // Filter out "uncategorized" category only
  const mainCategories = wooCategories.filter(
    cat => cat.slug !== 'uncategorized' && cat.count > 0
  );

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="max-w-[1300px] mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#333] transition-colors">דף הבית</Link>
          <span className="mx-2">/</span>
          <span className="text-[#333]">כל הקטגוריות</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-light">
            הקולקציות <span className="font-bold">שלנו</span>
          </h1>
        </div>

        {/* Categories Grid - 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {mainCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/product-category/${category.slug}`}
              className="group block"
            >
              {/* Card Container */}
              <div className="flex flex-col">
                {/* Image Container - Square 1:1 */}
                <div className="relative aspect-square rounded-2xl rounded-tl-none overflow-hidden bg-[#f5f5f0] shadow-sm group-hover:shadow-lg transition-all duration-500">
                  {/* Image */}
                  {category.image?.src ? (
                    <Image
                      src={category.image.src}
                      alt={category.image.alt || category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 320px"
                      quality={75}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e1eadf] flex items-center justify-center">
                      <span className="text-[#4a7c59]/40 text-6xl font-bold">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                
                {/* Category Name - below image */}
                <div className="pt-4 pb-2">
                  <h2 className="text-[#333] text-base md:text-lg font-medium text-center">
                    {category.name}
                  </h2>
                  {category.count > 0 && (
                    <p className="text-gray-400 text-xs text-center mt-1">
                      {category.count} מוצרים
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">לא מצאתם מה שחיפשתם?</p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 text-[#333] hover:text-black transition-colors group"
          >
            <span className="border-b border-gray-400 group-hover:border-black pb-1">
              צרו איתנו קשר
            </span>
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
