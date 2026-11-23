'use client';

import Link from 'next/link';
import { TreePine, X } from 'lucide-react';
import { useEffect } from 'react';

import { NavItem } from './Navbar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavItem[];
  pathname: string;
}

// Extra links are now included in the main navLinks, so we don't need them separately.

export default function MobileMenu({ isOpen, onClose, links, pathname }: MobileMenuProps) {
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="absolute top-0 right-0 w-80 max-w-[85vw] h-full shadow-2xl overflow-y-auto mobile-menu-enter"
           style={{ background: 'var(--color-rw-bg)' }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--color-rw-primary)' }}>
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-rw-primary)' }}>
                Portal RW 05
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'var(--color-rw-muted)' }}
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Links */}
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <div key={link.label}>
                {link.href ? (
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive(link.href)
                        ? 'text-white'
                        : 'hover:bg-white/60'
                    }`}
                    style={
                      isActive(link.href)
                        ? { background: 'var(--color-rw-primary)', color: 'white' }
                        : { color: 'var(--color-rw-text)' }
                    }
                  >
                    {link.label}
                  </Link>
                ) : (
                  <div className="py-2">
                    <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-rw-muted)' }}>
                      {link.label}
                    </p>
                    <div className="flex flex-col gap-1 pl-2">
                      {link.subLinks?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onClose}
                          className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            isActive(sub.href)
                              ? 'text-white'
                              : 'hover:bg-white/60'
                          }`}
                          style={
                            isActive(sub.href)
                              ? { background: 'var(--color-rw-primary)', color: 'white' }
                              : { color: 'var(--color-rw-text)' }
                          }
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer tag */}
          <div className="mt-10 text-center">
            <p className="text-xs" style={{ color: 'var(--color-rw-muted)' }}>
              🏘️ Untuk warga RW 05 Sukamaju
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
