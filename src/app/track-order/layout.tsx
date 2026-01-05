import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'מעקב הזמנה',
  description: 'עקבו אחרי ההזמנה שלכם בנלה. הזינו את מספר ההזמנה והאימייל כדי לראות את סטטוס המשלוח.',
  robots: {
    index: false, // Don't index - personal data page
    follow: true,
  },
  alternates: {
    canonical: `${siteConfig.url}/track-order`,
  },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
