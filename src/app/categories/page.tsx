import { CategoryGrid } from '@/components/products';
import type { Category } from '@/lib/types';

const categories: Category[] = [
  { id: '1', databaseId: 1, name: 'שולחנות סלון', slug: 'living-room-tables', count: 20 },
  { id: '2', databaseId: 2, name: 'מזנונים לסלון', slug: 'living-room-sideboards', count: 15 },
  { id: '3', databaseId: 3, name: 'קומודות', slug: 'dresser', count: 12 },
  { id: '4', databaseId: 4, name: 'קונסולות', slug: 'consoles', count: 10 },
  { id: '5', databaseId: 5, name: 'שידות לילה', slug: 'bedside-tables', count: 8 },
  { id: '6', databaseId: 6, name: 'כורסאות', slug: 'designed-armchairs', count: 6 },
  { id: '7', databaseId: 7, name: 'פינות אוכל', slug: 'dining', count: 5 },
  { id: '8', databaseId: 8, name: 'מראות', slug: 'mirrors', count: 10 },
  { id: '9', databaseId: 9, name: 'ספריות', slug: 'libraries', count: 7 },
  { id: '10', databaseId: 10, name: 'מיטות', slug: 'beds', count: 9 },
  { id: '11', databaseId: 11, name: 'שולחנות בר', slug: 'bar-tables', count: 4 },
];

export const metadata = {
  title: 'כל הקטגוריות | בלאנו - רהיטי מעצבים',
  description: 'צפו בכל הקטגוריות של רהיטי בלאנו - מזנונים, שולחנות, קומודות, כורסאות ועוד',
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-primary">דף הבית</a>
        <span className="mx-2">/</span>
        <span>כל הקטגוריות</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">כל הקטגוריות</h1>

      <CategoryGrid categories={categories} />
    </div>
  );
}
