'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, TreePine, ChevronDown } from 'lucide-react';
import MobileMenu from './MobileMenu';

export type NavItem = {
  label: string;
  href?: string;
  subLinks?: { label: string; href: string }[];
};

const navLinks: NavItem[] = [
  { href: '/', label: 'Beranda' },
  {
    label: 'Profil & Info',
    subLinks: [
      { href: '/profil', label: 'Profil RW' },
      { href: '/transparansi-kas', label: 'Transparansi Kas' },
      { href: '/informasi-rt', label: 'Informasi RT' },
      { href: '/pengumuman', label: 'Pengumuman' },
      { href: '/agenda', label: 'Agenda' },
      { href: '/dokumen', label: 'Dokumen' },
    ],
  },
  {
    label: 'Layanan & Fasilitas',
    subLinks: [
      { href: '/layanan', label: 'Layanan' },
      { href: '/fasilitas', label: 'Fasilitas' },
      { href: '/keamanan', label: 'Keamanan' },
      { href: '/kebersihan', label: 'Kebersihan' },
    ],
  },
  {
    label: 'Komunitas',
    subLinks: [
      { href: '/umkm', label: 'UMKM' },
      { href: '/galeri', label: 'Galeri' },
      { href: '/permainan', label: 'Permainan' },
    ],
  },
  { href: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-(--color-rw-border)'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                   style={{ background: 'var(--color-rw-primary)' }}>
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-rw-primary)' }}>
                  Portal RW 05
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isParentActive = link.subLinks?.some(sub => isActive(sub.href));
                return (
                  <div key={link.label} className="relative group">
                    {link.href ? (
                      <Link
                        href={link.href}
                        className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                          isActive(link.href)
                            ? 'text-white'
                            : 'text-(--color-rw-text) hover:text-(--color-rw-primary)'
                        }`}
                        style={isActive(link.href) ? { background: 'var(--color-rw-primary)' } : {}}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <div className="relative">
                        <button
                          className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                            isParentActive ? 'text-(--color-rw-primary)' : 'text-(--color-rw-text) group-hover:text-(--color-rw-primary)'
                          }`}
                        >
                          {link.label}
                          <ChevronDown className="w-4 h-4 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 pt-2 opacity-0 invisible translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50">
                          <div className="w-52 bg-white rounded-xl shadow-lg border border-(--color-rw-border) p-2 flex flex-col gap-1 relative">
                            {link.subLinks?.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  isActive(sub.href)
                                    ? 'text-white bg-(--color-rw-primary)'
                                    : 'text-(--color-rw-text) hover:bg-(--color-rw-bg)'
                                }`}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2"
              style={{ color: 'var(--color-rw-primary)' }}
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
        pathname={pathname}
      />
    </>
  );
}
