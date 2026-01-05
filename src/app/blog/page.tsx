import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getFeaturedImage, getExcerpt, formatDate } from '@/lib/wordpress';
import { BreadcrumbJsonLd } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ArrowLeft, Calendar } from 'lucide-react';

const SITE_URL = siteConfig.url;

export const revalidate = 300; // 5 minutes

export const metadata = {
  title: 'בלוג',
  description: 'טיפים, השראה ומדריכים לעיצוב הבית עם רהיטי מעצבים',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `בלוג | ${siteConfig.name}`,
    description: 'טיפים, השראה ומדריכים לעיצוב הבית עם רהיטי מעצבים',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export default async function BlogPage() {
  let posts: any[] = [];
  
  try {
    posts = await getPosts({ per_page: 12 });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }

  return (
    <>
      <BreadcrumbJsonLd 
        items={[
          { name: 'דף הבית', url: SITE_URL },
          { name: 'בלוג', url: `${SITE_URL}/blog` },
        ]} 
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-[1300px] mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-black transition-colors">דף הבית</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">בלוג</span>
            </nav>

            {/* Title */}
            <div className="flex justify-center relative z-10">
              <h1 className="font-english text-[32px] md:text-[60px] lg:text-[80px] font-[300] text-[#333] tracking-[0.15em] md:tracking-[0.2em] leading-none">
                OUR BLOG
              </h1>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-[1300px] mx-auto px-4">
            {/* Subtitle */}
            <div className="text-center mb-10 -mt-[20px] md:-mt-[30px]">
              <p className="text-lg text-gray-600">
                טיפים, השראה ומדריכים לעיצוב הבית עם רהיטי מעצבים
              </p>
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => {
                  const featuredImage = getFeaturedImage(post);
                  const excerpt = getExcerpt(post);
                  const date = formatDate(post.date);
                  
                  return (
                    <article 
                      key={post.id}
                      className="group bg-[#f8f7f4] rounded-[20px] overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image */}
                      <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] relative overflow-hidden">
                        {featuredImage ? (
                          <Image
                            src={featuredImage}
                            alt={post.title.rendered}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">אין תמונה</span>
                          </div>
                        )}
                      </Link>
                      
                      {/* Content */}
                      <div className="p-6">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.date}>{date}</time>
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-lg font-bold text-[#333] mb-3 line-clamp-2">
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="hover:text-[#4a7c59] transition-colors"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                          />
                        </h2>
                        
                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {excerpt}
                        </p>
                        
                        {/* Read More */}
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#333] hover:text-[#4a7c59] transition-colors"
                        >
                          קרא עוד
                          <ArrowLeft className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#f8f7f4] rounded-[20px]">
                <p className="text-gray-500">אין פוסטים להצגה כרגע</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-[1300px] mx-auto px-4 text-center">
            <h2 dir="ltr" className="font-english text-[24px] md:text-[40px] font-[300] text-[#333] tracking-[0.1em] mb-6">
              NEED INSPIRATION?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              בואו לבקר באולם התצוגה שלנו ותגלו עולם של רהיטי מעצבים באיכות גבוהה
            </p>
            <Link
              href="/showroom"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              לאולם התצוגה
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
