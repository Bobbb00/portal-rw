import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center section-padding bg-(--color-rw-bg)">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-9xl font-extrabold text-(--color-rw-primary-light)/20 mb-4" style={{ fontFamily: 'var(--font-display)' }}>404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-(--color-rw-text) mb-4" style={{ fontFamily: 'var(--font-display)' }}>Halaman Tidak Ditemukan</h2>
        <p className="text-(--color-rw-muted) mb-8 text-lg">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link href="/" className="btn-primary inline-flex">
          <Home className="w-5 h-5" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
