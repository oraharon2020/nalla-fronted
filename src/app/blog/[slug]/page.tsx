import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPosts, getPostBySlug, getFeaturedImage, formatDate, getAuthorName } from '@/lib/wordpress';
import { BreadcrumbJsonLd } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { ArrowRight, Calendar, User } from 'lucide-react';

const SITE_URL = siteConfig.url;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static pages for posts at build time
export async function generateStaticParams() {
  try {
    const posts = await getPosts({ per_page: 50 });
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error('Failed to generate blog post params:', error);
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 300;

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: 'פוסט לא נמצא' };
    
    const title = post.title.rendered.replace(/<[^>]*>/g, '');
    const description = post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160);
    const featuredImage = getFeaturedImage(post);
    
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}/blog/${slug}`,
      },
      openGraph: {
        title: `${title} | ${siteConfig.name}`,
        description,
        url: `${SITE_URL}/blog/${slug}`,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        images: featuredImage ? [{ url: featuredImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | ${siteConfig.name}`,
        description,
        images: featuredImage ? [featuredImage] : [],
      },
    };
  } catch {
    return { title: 'פוסט לא נמצא' };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  let post = null;
  
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
  }
  
  if (!post) {
    notFound();
  }
  
  const featuredImage = getFeaturedImage(post);
  const date = formatDate(post.date);
  const author = getAuthorName(post);
  const title = post.title.rendered;

  return (
    <>
      {/* JSON-LD */}
      <BreadcrumbJsonLd 
        items={[
          { name: 'דף הבית', url: SITE_URL },
          { name: 'בלוג', url: `${SITE_URL}/blog` },
          { name: title.replace(/<[^>]*>/g, ''), url: `${SITE_URL}/blog/${slug}` },
        ]} 
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title.replace(/<[^>]*>/g, ''),
            image: featuredImage || undefined,
            datePublished: post.date,
            dateModified: post.modified,
            author: {
              '@type': 'Organization',
              name: siteConfig.name,
              url: SITE_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.name,
              url: SITE_URL,
            },
          }),
        }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-[1000px] mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-black transition-colors">דף הבית</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-black transition-colors">בלוג</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900" dangerouslySetInnerHTML={{ __html: title }} />
            </nav>

            {/* Back Button */}
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mb-8"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לבלוג
            </Link>
          </div>
        </section>

        {/* Article Content */}
        <article className="pb-14 md:pb-20">
          <div className="max-w-[1000px] mx-auto px-4">
            {/* Featured Image */}
            {featuredImage && (
              <div className="relative aspect-[16/9] mb-8 rounded-[30px] overflow-hidden">
                <Image
                  src={featuredImage}
                  alt={title.replace(/<[^>]*>/g, '')}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1000px) 100vw, 1000px"
                />
              </div>
            )}

            {/* Article Header */}
            <header className="mb-10">
              <h1 
                className="text-2xl md:text-4xl font-bold text-[#333] mb-6 leading-tight"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>{date}</time>
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{author}</span>
                </div>
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-[#333]
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-[#4a7c59] prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-[20px]
                prose-ul:list-disc prose-ul:pr-5
                prose-ol:list-decimal prose-ol:pr-5
                prose-li:text-gray-700
                prose-blockquote:border-r-4 prose-blockquote:border-[#4a7c59] prose-blockquote:pr-4 prose-blockquote:italic prose-blockquote:text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>
        </article>

        {/* Back to Blog Section */}
        <section className="py-10 md:py-14 bg-[#f8f7f4]">
          <div className="max-w-[1000px] mx-auto px-4 text-center">
            <h2 className="font-english text-[24px] md:text-[36px] font-[300] text-[#333] tracking-[0.1em] mb-6">
              MORE ARTICLES
            </h2>
            <p className="text-gray-600 mb-8">
              גלו עוד טיפים והשראה לעיצוב הבית שלכם
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              לכל המאמרים
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
