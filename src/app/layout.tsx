import type { Metadata } from "next";
import { Rubik, Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer, FloatingButtons } from "@/components/layout";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "בלאנו - רהיטי מעצבים | משלוח חינם עד הבית",
  description:
    "בלאנו - רהיטי מעצבים. מבחר רחב של רהיטים איכותיים: מזנונים, שולחנות סלון, קומודות, כורסאות, מיטות ועוד. משלוח חינם עד הבית!",
  keywords: [
    "רהיטים",
    "מזנונים",
    "שולחנות סלון",
    "קומודות",
    "כורסאות",
    "מיטות",
    "רהיטי מעצבים",
    "בלאנו",
  ],
  openGraph: {
    title: "בלאנו - רהיטי מעצבים",
    description: "מבחר רחב של רהיטים איכותיים. משלוח חינם עד הבית!",
    url: "https://bellano.co.il",
    siteName: "בלאנו",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${rubik.variable} ${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}