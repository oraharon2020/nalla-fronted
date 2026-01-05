'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/product-category/${category.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {category.image?.sourceUrl ? (
            <Image
              src={category.image.sourceUrl}
              alt={category.image.altText || category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-primary/50 text-4xl font-bold">
                {category.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-lg md:text-xl font-bold text-center px-4">
              {category.name}
            </h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface CategoryGridProps {
  categories: Category[];
  title?: string;
}

export function CategoryGrid({ categories, title }: CategoryGridProps) {
  return (
    <section>
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
