import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'עוזר העיצוב',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
