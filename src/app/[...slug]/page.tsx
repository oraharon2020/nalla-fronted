import { getPageBySlug } from '@/lib/woocommerce/pages';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// Revalidate every 5 minutes
export const revalidate = 300;

// Pages that should NOT be handled by this catch-all
// (they have their own dedicated routes)
const reservedPaths = [
  'product',
  'product-category',
  'category',
  'categories',
  'checkout',
  'blog',
  'contact',
  'faq',
  'about',
  'accessibility',
  'wishlist',
  'design-assistant',
  'api',
  'page',
  'product-tag',
  'tambour',
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug.join('/');
  
  // Don't handle reserved paths
  if (reservedPaths.includes(slug[0])) {
    return { title: 'דף לא נמצא | נלה' };
  }
  
  const page = await getPageBySlug(pageSlug);
  
  if (!page) {
    return { title: 'דף לא נמצא | נלה' };
  }
  
  // Decode HTML entities in title
  const title = page.title.rendered
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
  
  // Extract description from content or use default
  const description = page.content?.rendered
    ? page.content.rendered.replace(/<[^>]+>/g, '').slice(0, 160)
    : `${title} - נלה רהיטים`;
  
  return {
    title: `${title} | נלה - רהיטי מעצבים`,
    description,
  };
}

export default async function WordPressPage({ params }: PageProps) {
  const { slug } = await params;
  const pageSlug = slug.join('/');
  
  // Don't handle reserved paths - let Next.js 404 handle it
  if (reservedPaths.includes(slug[0])) {
    notFound();
  }
  
  const page = await getPageBySlug(pageSlug);
  
  if (!page) {
    notFound();
  }
  
  // Decode HTML entities in title
  const title = page.title.rendered
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
  
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-xs text-gray-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-black">דף הבית</Link>
            <span>/</span>
            <span className="text-gray-900">{title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">{title}</h1>
        
        <article 
          className="max-w-4xl mx-auto prose prose-lg prose-gray
            prose-headings:font-bold prose-headings:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-gray-700
            prose-strong:text-gray-900
            prose-hr:border-gray-200"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </div>
    </div>
  );
}
