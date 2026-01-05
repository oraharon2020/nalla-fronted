import { CategoryFilters } from '@/components/products';
import { getProductsByCategorySlugWithSwatches, getCategoryBySlug, getCategories } from '@/lib/woocommerce';
import { BreadcrumbJsonLd } from '@/components/seo';
import { ExpandableDescription } from '@/components/ui/ExpandableDescription';
import { siteConfig } from '@/config/site';
import { getYoastSEO, yoastToMetadata } from '@/lib/wordpress/seo';

const SITE_URL = siteConfig.url;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static pages for all categories at build time
// Falls back to on-demand rendering if API unavailable during build
export async function generateStaticParams() {
  // Skip during build if no API keys
  if (!process.env.WOOCOMMERCE_CONSUMER_KEY) {
    console.log('Skipping static generation - no API keys');
    return [];
  }
  
  try {
    const categories = await getCategories({ per_page: 50 });
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch (error) {
    console.error('Failed to generate category params:', error);
    return [];
  }
}

// Allow dynamic rendering for pages not generated at build time
export const dynamicParams = true;

// Revalidate every 5 minutes
export const revalidate = 300;

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  try {
    // Try to get Yoast SEO data from WordPress first
    const yoastData = await getYoastSEO(`/product-category/${slug}/`);
    
    const category = await getCategoryBySlug(slug);
    const name = category?.name || slug;
    const fallbackDescription = category?.description?.replace(/<[^>]*>/g, '').slice(0, 160) || 
      `מבחר רחב של ${name} איכותיים בעיצוב מודרני. משלוח חינם עד הבית!`;
    const fallbackImage = category?.image?.src || `${SITE_URL}/og-image.jpg`;
    
    // If Yoast data exists, use it (what you configure in WordPress)
    if (yoastData) {
      return yoastToMetadata(yoastData, {
        title: `${name} | בלאנו`,
        description: fallbackDescription,
        url: `${SITE_URL}/category/${slug}`,
        image: fallbackImage,
      });
    }
    
    // Fallback to auto-generated metadata
    return {
      title: name,
      description: fallbackDescription,
      alternates: {
        canonical: `${SITE_URL}/category/${slug}`,
      },
      openGraph: {
        title: `${name} | בלאנו`,
        description: fallbackDescription,
        url: `${SITE_URL}/category/${slug}`,
        type: 'website',
        images: [{ 
          url: fallbackImage,
          width: 1200,
          height: 630,
          alt: name,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} | בלאנו`,
        description: fallbackDescription,
        images: [fallbackImage],
      },
    };
  } catch {
    return {
      title: slug,
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  let category = null;
  let products: any[] = [];
  let allCategories: any[] = [];

  try {
    const [categoryData, productsData, categoriesData] = await Promise.all([
      getCategoryBySlug(slug),
      getProductsByCategorySlugWithSwatches(slug, { per_page: 24 }),
      getCategories({ per_page: 50, hide_empty: true }),
    ]);
    
    category = categoryData;
    products = productsData;
    allCategories = categoriesData.filter((cat: any) => cat.slug !== 'uncategorized' && cat.count > 0);
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  const categoryName = category?.name || slug;

  return (
    <>
      {/* Prefetch product pages for faster navigation */}
      {products.slice(0, 12).map((product) => (
        <link 
          key={product.slug} 
          rel="prefetch" 
          href={`/product/${product.slug}`} 
          as="document"
        />
      ))}
      
      {/* JSON-LD Breadcrumb */}
      <BreadcrumbJsonLd 
        items={[
          { name: 'דף הבית', url: SITE_URL },
          { name: categoryName, url: `${SITE_URL}/category/${slug}` },
        ]} 
      />

      {/* Category Header with Gray Background */}
      <div className="bg-[#f5f5f5] py-6 md:py-10">
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Right Side - Breadcrumb, Title and Count */}
            <div className="md:w-1/3">
              {/* Breadcrumb */}
              <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
                <a href="/" className="hover:text-black">נלה - Nalla</a>
                <span className="mx-2">/</span>
                <span className="text-gray-700">{categoryName}</span>
              </nav>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-2">{categoryName}</h1>
              <p className="text-gray-500 text-sm">{products.length} מוצרים</p>
            </div>
            
            {/* Left Side - Description - Desktop only */}
            <div className="hidden md:block md:w-2/3">
              {category?.description && (
                <ExpandableDescription 
                  description={category.description} 
                  maxLines={5}
                  className="text-gray-600 text-sm leading-relaxed"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        {products.length > 0 ? (
          <CategoryFilters products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">לא נמצאו מוצרים בקטגוריה זו</p>
          </div>
        )}
      </div>

      {/* Mobile Description - Below products section */}
      {category?.description && (
        <div className="md:hidden bg-[#f5f5f5] py-6">
          <div className="max-w-[1300px] mx-auto px-4">
            <h2 className="text-lg font-medium mb-3">אודות {categoryName}</h2>
            <ExpandableDescription 
              description={category.description} 
              maxLines={4}
              className="text-gray-600 text-sm leading-relaxed"
            />
          </div>
        </div>
      )}
    </>
  );
}
