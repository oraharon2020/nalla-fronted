import Link from 'next/link';
import { MapPin, Phone, Clock, Navigation, Car, Calendar, Sparkles, ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'אולם התצוגה שלנו',
  description: 'בואו לבקר באולם התצוגה של נלה בראשון לציון. חוו את הרהיטים מקרוב, קבלו ייעוץ מקצועי והתרשמו מהאיכות.',
  alternates: {
    canonical: `${siteConfig.url}/showroom`,
  },
  openGraph: {
    title: 'אולם התצוגה | נלה',
    description: 'בואו לבקר באולם התצוגה של נלה בראשון לציון',
    type: 'website',
  },
};

export default function ShowroomPage() {
  const wazeLink = 'https://ul.waze.com/ul?place=ChIJNQOQFe2zAhURg1s0b70T82o&ll=31.94958890%2C34.76781590&navigate=yes';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Video */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-black transition-colors">דף הבית</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">אולם התצוגה</span>
          </nav>

          {/* OUR SHOWROOM Title - Same style as homepage */}
          <div className="flex justify-center relative z-10">
            <h1 className="font-english text-[32px] md:text-[80px] lg:text-[100px] font-[300] text-[#333] tracking-[0.15em] md:tracking-[0.2em] leading-none">
              OUR SHOWROOM
            </h1>
          </div>
          
          {/* Video - with negative margin to overlap title */}
          <div className="relative w-full aspect-video rounded-[30px] overflow-hidden -mt-[12px] md:-mt-[70px] lg:-mt-[50px]">
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

      {/* Info Section with Green Background */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* VISIT US Title */}
          <div className="flex justify-center mb-8">
            <h2 className="font-english text-[50px] md:text-[80px] lg:text-[100px] font-[300] text-[#333] tracking-[0.15em] md:tracking-[0.1em] leading-none">
              VISIT US
            </h2>
          </div>
          
          {/* Content Container with green background */}
          <div className="bg-[#e1eadf] rounded-br-[50px] rounded-bl-[50px] rounded-tr-[50px] rounded-tl-none py-12 px-6 md:px-12 -mt-[45px] md:-mt-[55px] lg:-mt-[70px]">
            <div className="max-w-5xl mx-auto">
              {/* Subtitle */}
              <p className="text-center text-lg md:text-xl text-[#333] mb-10">
                בואו <span className="font-bold">לחוות את הרהיטים מקרוב</span> ולקבל ייעוץ אישי מהצוות שלנו
              </p>
              
              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {/* Location */}
                <div className="bg-white rounded-[20px] p-6 text-center shadow-sm">
                  <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-[#333] mb-2">כתובת</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    אברהם בומא שביט 1<br />
                    אולם F-101, ראשון לציון
                  </p>
                  <a 
                    href={wazeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#33ccff] text-sm font-medium hover:underline"
                  >
                    <Navigation className="w-4 h-4" />
                    נווטו ב-Waze
                  </a>
                </div>

                {/* Hours */}
                <div className="bg-white rounded-[20px] p-6 text-center shadow-sm">
                  <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-[#333] mb-2">שעות פתיחה</h3>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>א׳ - ה׳: 10:00 - 20:00</p>
                    <p>שישי: 10:00 - 14:00</p>
                    <p className="text-gray-400">שבת: סגור</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-[20px] p-6 text-center shadow-sm">
                  <div className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-[#333] mb-2">טלפון</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    יש לכם שאלות?<br />
                    אנחנו כאן בשבילכם
                  </p>
                  <a 
                    href="tel:033732350"
                    className="inline-flex items-center gap-1.5 text-[#333] text-lg font-bold hover:underline"
                  >
                    03-3732350
                  </a>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="text-center">
                <a 
                  href={wazeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  <Navigation className="w-5 h-5" />
                  נווטו אלינו עכשיו
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Visit Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-[1300px] mx-auto px-4">
          {/* Title */}
          <div className="flex justify-center mb-12">
            <h2 className="font-english text-[50px] md:text-[60px] lg:text-[80px] font-[300] text-[#333] tracking-[0.15em] leading-none">
              WHY VISIT
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'חוויה אמיתית',
                desc: 'לראות, לגעת ולחוות את הרהיטים לפני הרכישה',
              },
              {
                icon: Calendar,
                title: 'ייעוץ אישי',
                desc: 'צוות מקצועי שיעזור לכם לבחור את המוצר המושלם',
              },
              {
                icon: Car,
                title: 'חנייה חינם',
                desc: 'חנייה נוחה וחינמית ממש ליד הכניסה לאולם',
              },
              {
                icon: MapPin,
                title: 'מיקום נגיש',
                desc: 'קל להגיע מכל מקום במרכז הארץ',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 border-2 border-[#333] rounded-full flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-[#333]" />
                </div>
                <h3 className="font-bold text-[#333] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-14 md:py-20 bg-[#f8f7f4]">
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              {/* Map Embed */}
              <div className="aspect-square md:aspect-[4/3] rounded-[30px] overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.5!2d34.76781590!3d31.94958890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU2JzU4LjUiTiAzNMKwNDYnMDQuMiJF!5e0!3m2!1siw!2sil!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="font-english text-[28px] md:text-[50px] font-[300] text-[#333] tracking-[0.1em] leading-none mb-6">
                FIND US
              </h2>
              <div className="space-y-4 text-gray-600 mb-8">
                <p className="text-lg">
                  אנחנו ממוקמים באזור התעשייה של ראשון לציון, 
                  עם גישה נוחה מכביש 4 וכביש 20.
                </p>
                <p>
                  <strong className="text-[#333]">כתובת מלאה:</strong><br />
                  אברהם בומא שביט 1, אולם F-101, ראשון לציון
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <a 
                  href={wazeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#33ccff] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00b8f0] transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Waze
                </a>
                <a 
                  href="https://maps.google.com/?q=31.94958890,34.76781590"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#333] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <MapPin className="w-4 h-4" />
                  Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 text-center">
          <h2 className="font-english text-[28px] md:text-[60px] font-[300] text-[#333] tracking-[0.15em] leading-none mb-6">
            SEE YOU SOON
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            מחכים לראות אתכם באולם התצוגה!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={wazeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              <Navigation className="w-5 h-5" />
              נווטו אלינו
            </a>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#333] px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors border-2 border-[#333]"
            >
              צור קשר
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
