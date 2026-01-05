import Image from 'next/image';
import Link from 'next/link';
import { Truck, Shield, Sparkles, Users, MapPin, Phone, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'אודותינו | נלה - מעצבים את הבית',
  description: 'הכירו את נלה - מעצבים את הבית. רהיטים מעוצבים באיכות גבוהה, משלוח חינם עד הבית ושירות אישי.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#f8f7f4] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4a7c59] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4a7c59] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24 relative">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#4a7c59] transition-colors">דף הבית</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">אודותינו</span>
          </nav>
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block bg-[#e8f0e6] text-[#4a7c59] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              הסיפור שלנו
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              מעצבים את הבית שלכם
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              ב<strong className="text-gray-800">נלה</strong> אנחנו מאמינים שכל בית ראוי לרהיטים יפים ואיכותיים. 
              אנחנו כאן כדי לעזור לכם ליצור את הבית שתמיד חלמתם עליו.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'עיצוב מושלם',
                desc: 'קולקציות מעוצבות בקפידה שמשלבות סגנון ופונקציונליות',
              },
              {
                icon: Shield,
                title: 'איכות מובטחת',
                desc: 'חומרי גלם איכותיים ותהליך ייצור קפדני לכל מוצר',
              },
              {
                icon: Truck,
                title: 'משלוח חינם',
                desc: 'משלוח והרכבה חינם עד הבית לכל רחבי הארץ',
              },
              {
                icon: Users,
                title: 'שירות אישי',
                desc: 'צוות מקצועי שזמין לענות על כל שאלה ולסייע בבחירה',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-[#f8f7f4] transition-colors">
                <div className="w-14 h-14 bg-[#e8f0e6] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-[#4a7c59]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20 bg-[#f8f7f4]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white text-[#4a7c59] text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                מי אנחנו
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                נלה - יותר מחנות רהיטים
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  נלה נולדה מתוך תשוקה לעיצוב ורצון עז להנגיש רהיטים יפים ואיכותיים לכל בית בישראל. 
                  אנחנו מבינים שהבית הוא המקום הכי חשוב בעולם - המקום שבו אתם חיים, יוצרים זכרונות ומבלים עם האנשים שאתם אוהבים.
                </p>
                <p>
                  הקולקציות שלנו מעוצבות בקפידה רבה, עם דגש על שילוב מושלם בין אסתטיקה מודרנית לפונקציונליות יומיומית. 
                  כל מוצר נבחר בזהירות כדי להבטיח שהוא יעניק לכם שנים של הנאה ושימוש.
                </p>
                <p>
                  אנחנו גאים בשירות האישי שאנחנו מעניקים - מהייעוץ הראשוני, דרך הבחירה המושלמת, ועד הרגע שבו הרהיט מגיע לביתכם ומשתלב בחלל.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#e8f0e6] to-[#d4e4d0] flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <span className="font-english text-6xl md:text-7xl font-light tracking-[0.15em] text-[#4a7c59]">
                    NALLA
                  </span>
                  <p className="text-[#4a7c59] mt-2 text-lg">מעצבים את הבית</p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#4a7c59]/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <span className="inline-block bg-[#e8f0e6] text-[#4a7c59] text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            המוצרים שלנו
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            כל מה שצריך לבית
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            מזנונים מעוצבים, שולחנות סלון, קומודות, קונסולות, שידות לילה, ספריות ועוד - 
            הכל במקום אחד ובמחירים הוגנים.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {['מזנונים', 'שולחנות סלון', 'קומודות', 'קונסולות', 'שידות לילה', 'מיטות', 'ספריות', 'פינות אוכל'].map((cat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl py-4 px-3 text-gray-700 font-medium hover:bg-[#e8f0e6] hover:text-[#4a7c59] transition-colors cursor-pointer">
                {cat}
              </div>
            ))}
          </div>
          
          <Link 
            href="/categories"
            className="inline-flex items-center gap-2 bg-[#4a7c59] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#3d6a4a] transition-colors"
          >
            לכל המוצרים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">בואו לבקר אותנו</h2>
            <p className="text-gray-400">נשמח לראות אתכם באולם התצוגה שלנו</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-[#4a7c59] rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">כתובת</h3>
              <p className="text-gray-400">אברהם בומא שביט 1, אולם F-101<br />ראשון לציון</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#4a7c59] rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">טלפון</h3>
              <p className="text-gray-400">
                <a href="tel:033732350" className="hover:text-white transition-colors">03-3732350</a>
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#4a7c59] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">שעות פעילות</h3>
              <p className="text-gray-400">א׳-ה׳: 10:00-20:00<br />ו׳: 10:00-14:00</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-full font-medium hover:bg-gray-100 transition-colors"
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
