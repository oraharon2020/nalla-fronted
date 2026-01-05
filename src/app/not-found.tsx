import Link from 'next/link';
import { Home, Grid, Phone, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 text-center">
          {/* 404 Number */}
          <h1 className="font-english text-[80px] md:text-[150px] lg:text-[200px] font-[300] text-[#e1eadf] leading-none mb-4">
            404
          </h1>
          
          {/* Title */}
          <h2 className="font-english text-[24px] md:text-[40px] font-[300] text-[#333] tracking-[0.1em] -mt-8 md:-mt-16 mb-6">
            PAGE NOT FOUND
          </h2>
          
          <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg">
            מצטערים, הדף שחיפשת לא קיים או שהמוצר כבר לא זמין.
            <br />
            אבל יש לנו עוד המון דברים יפים לראות!
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              <Home className="w-5 h-5" />
              לדף הבית
            </Link>
            <Link 
              href="/categories"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#333] rounded-full font-medium border-2 border-[#333] hover:bg-gray-100 transition-colors"
            >
              <Grid className="w-5 h-5" />
              לכל הקטגוריות
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-12 bg-[#f8f7f4]">
        <div className="max-w-[1300px] mx-auto px-4">
          <h3 className="text-center text-lg font-medium text-[#333] mb-8">
            הקטגוריות הפופולריות שלנו
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'מזנונים', slug: 'living-room-sideboards' },
              { name: 'שולחנות סלון', slug: 'living-room-tables' },
              { name: 'קונסולות', slug: 'consoles' },
              { name: 'קומודות', slug: 'shirot' },
              { name: 'מיטות', slug: 'beds' },
              { name: 'פינות אוכל', slug: 'dining-tables' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/product-category/${cat.slug}`}
                className="bg-white rounded-[15px] p-4 text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-[#333] font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 bg-white">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <p className="text-gray-600 mb-6">
            מחפשים משהו ספציפי? אנחנו כאן לעזור!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-[#333] hover:text-[#4a7c59] transition-colors"
            >
              <Phone className="w-4 h-4" />
              צרו קשר
            </Link>
            <a
              href="https://wa.me/972559871850"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              וואטסאפ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
