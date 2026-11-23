import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Portal Informasi RW 05 Kelurahan Sukamaju',
    template: '%s | Portal RW 05',
  },
  description: 'Portal informasi resmi RW 05 Kelurahan Sukamaju. Akses informasi kegiatan, pelayanan, keamanan, kebersihan, dan fasilitas lingkungan dalam satu tempat.',
  keywords: ['RW 05', 'Kelurahan Sukamaju', 'portal informasi', 'lingkungan', 'warga'],
  openGraph: {
    title: 'Portal Informasi RW 05 Kelurahan Sukamaju',
    description: 'Pusat informasi kegiatan, pelayanan, keamanan, kebersihan, dan fasilitas lingkungan RW 05.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <LayoutWrapper
          navbar={<Navbar />}
          footer={<Footer />}
        >
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
