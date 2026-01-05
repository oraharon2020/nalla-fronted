import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'מועדפים',
  description: 'המוצרים האהובים עליכם בנלה. שמרו את הרהיטים שאהבתם לצפייה מאוחרת.',
  robots: {
    index: false, // Don't index - personal/dynamic page
    follow: true,
  },
  alternates: {
    canonical: `${siteConfig.url}/wishlist`,
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
