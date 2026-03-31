import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import './globals.css';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800', '900'],
  display: 'swap',
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: {
    default: 'عقارات سوريا | منصة العقارات الأولى',
    template: '%s | عقارات سوريا',
  },
  description:
    'المنصة الرائدة لعرض وبيع وإيجار العقارات في سوريا. تصفح آلاف العقارات في دمشق وحلب واللاذقية وكافة المحافظات.',
  keywords: ['عقارات سوريا', 'شقق للبيع', 'فيلات', 'إيجار', 'دمشق', 'حلب', 'اللاذقية'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
