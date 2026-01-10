import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'צביעה בטמבור | נלה - Nalla',
  description: 'צביעת רהיטים בתנור בצבעי טמבור – לגימור מושלם בהתאמה אישית. בחרו מתוך מגוון צבעים איכותיים לרהיטים שלכם.',
};

const colorSwatches = [
  { code: '0849P', image: 'https://admin.nalla.co.il/wp-content/uploads/2025/02/5.jpg' },
  { code: '1513P', image: 'https://admin.nalla.co.il/wp-content/uploads/2025/02/3.png' },
  { code: '1515P', image: 'https://admin.nalla.co.il/wp-content/uploads/2025/02/2-1.png' },
  { code: '1517P', image: 'https://admin.nalla.co.il/wp-content/uploads/2025/02/1-2.png' },
];

const galleryImages = [
  'https://admin.nalla.co.il/wp-content/uploads/2025/02/HomePage-OurProjects-img_1.jpg',
  'https://admin.nalla.co.il/wp-content/uploads/2025/02/404_2.jpg',
  'https://admin.nalla.co.il/wp-content/uploads/2025/02/HomePage-OurProjects-img_3.jpg',
];

export default function TambourPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Color Swatches */}
      <section className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {colorSwatches.map((swatch, index) => (
            <div key={swatch.code} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={swatch.image}
                  alt={`צבע טמבור ${swatch.code}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority={index < 2}
                />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium tracking-wider">
                  {swatch.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-8">
            צביעת רהיטים בטמבור
            <span className="block text-xl md:text-2xl font-normal text-gray-600 mt-3">
              לגימור מושלם בהתאמה אישית
            </span>
          </h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
            <p>
              צבע בתנור של טמבור מעניק גימור חלק, יוקרתי ושכבת צבע אחידה הנשמרת לאורך שנים. 
              הצביעה בטכנולוגיה מתקדמת מבטיחה עמידות גבוהה בפני לחות ודהייה, 
              עם גימור מט למראה מודרני ומוקפד.
            </p>
            <p>
              הצבעים מותאמים לכל סגנון – מגוונים קלאסיים וניטרליים 
              ועד צבעים עמוקים ומודרניים.
            </p>
            <p>
              מתלבטים איזה צבע מתאים לרהיטים שלכם? הצוות שלנו כאן לייעץ ולהתאים 
              עבורכם את הגוון המושלם. תוכלו להגיע לתצוגה שלנו ולהתרשם ממניפת צבעי 
              טמבור מקרוב!
            </p>
          </div>

          <div className="mt-10">
            <Link
              href="https://tambour.co.il/color-fan/color-chart/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              מעבר למניפת טמבור
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Color Strip */}
      <section className="w-full overflow-hidden">
        <Image
          src="https://admin.nalla.co.il/wp-content/uploads/2025/02/1-1024x394.webp"
          alt="פלטת צבעי טמבור"
          width={1024}
          height={394}
          className="w-full h-auto"
        />
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden ${index === 1 ? 'md:-mt-8' : ''}`}
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={image}
                    alt={`פרויקט צביעה ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-12">
            צבעי טמבור נבחרים
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Info Card */}
            <div className="bg-[#f5f0e8] p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-medium mb-4">
                גימור מט מושלם
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                צביעה בתנור בגימור מט מעניקה לרהיטים מראה חלק, מודרני ואלגנטי 
                ללא הברקות מיותרות. הצבע נשאר אחיד ומדויק, משתלב נהדר בכל 
                עיצוב ומדגיש את קווי הרהיט בצורה מושלמת.
              </p>
              <Link
                href="https://tambour.co.il/color-fan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-b-2 border-black pb-1 text-sm tracking-wider hover:border-gray-500 transition-colors"
              >
                לכל צבעי טמבור
              </Link>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3]">
              <Image
                src="https://admin.nalla.co.il/wp-content/uploads/2025/02/404Page-Hero.jpg"
                alt="רהיט בצביעת טמבור"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed">
            &ldquo;בכל גוון יש כוח לשנות את המרחב, להוסיף חמימות, עומק ויופי – 
            הבחירה היא שלך.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-medium mb-4">
            רוצים לראות את הצבעים מקרוב?
          </h2>
          <p className="text-gray-600 mb-8">
            בואו לתצוגה שלנו ותוכלו לבחור את הגוון המושלם לרהיטים שלכם
          </p>
          <Link
            href="/contact"
            className="inline-block bg-black text-white px-8 py-4 text-sm tracking-wider hover:bg-gray-800 transition-colors"
          >
            צרו קשר
          </Link>
        </div>
      </section>
    </main>
  );
}
