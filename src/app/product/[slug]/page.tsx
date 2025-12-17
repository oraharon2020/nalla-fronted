import { ProductPageClient } from './ProductPageClient';
import { getProductBySlug, getProductVariations, transformProduct } from '@/lib/woocommerce/api';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

// Revalidate every 5 minutes
export const revalidate = 300;

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const wooProduct = await getProductBySlug(slug);
    if (!wooProduct) {
      return { title: 'מוצר לא נמצא | בלאנו' };
    }
    
    const product = transformProduct(wooProduct);
    const description = product.description?.replace(/<[^>]*>/g, '').slice(0, 160) || '';
    
    return {
      title: `${product.name} | בלאנו - רהיטי מעצבים`,
      description,
      openGraph: {
        title: product.name,
        description,
        images: product.image?.sourceUrl ? [product.image.sourceUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error fetching product metadata:', error);
    return { title: 'בלאנו - רהיטי מעצבים' };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const wooProduct = await getProductBySlug(slug);
    
    if (!wooProduct) {
      notFound();
    }
    
    // Fetch variations if it's a variable product
    let variations: any[] = [];
    if (wooProduct.type === 'variable' && wooProduct.variations?.length > 0) {
      try {
        variations = await getProductVariations(wooProduct.id);
      } catch (error) {
        console.error('Error fetching variations:', error);
      }
    }
    
    const product = transformProduct(wooProduct, variations);

    return <ProductPageClient product={product} variations={variations} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
