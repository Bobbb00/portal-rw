import Link from 'next/link';
import { TreePine, Mail, Phone, MapPin, Clock, Camera, Globe, Video } from 'lucide-react';
import { rwInfo } from '@/data/contacts';
import WaveDivider from '@/components/ui/WaveDivider';

const quickLinks = [
  { href: '/pengumuman', label: 'Pengumuman' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/fasilitas', label: 'Fasilitas' },
  { href: '/umkm', label: 'UMKM' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/dokumen', label: 'Dokumen' },
  { href: '/kontak', label: 'Kontak' },
];

const infoLinks = [
  { href: '/profil', label: 'Profil RW' },
  { href: '/informasi-rt', label: 'Informasi RT' },
  { href: '/keamanan', label: 'Keamanan' },
  { href: '/kebersihan', label: 'Kebersihan' },
  { href: '/permainan', label: 'Permainan' },
];

export default function Footer() {
  return (
    <footer>
      <WaveDivider color="var(--color-rw-primary)" className="bg-transparent" />
      <div style={{ background: 'var(--color-rw-primary)' }} className="text-white">
        <div className="container-custom py-14 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-5 group">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-colors">
                  <TreePine className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>Portal RW 05</span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Portal informasi resmi RW 05 Kelurahan Sukamaju. Pusat informasi kegiatan, pelayanan, dan fasilitas lingkungan.
              </p>
              <div className="flex items-start gap-2 text-sm text-white/50">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{rwInfo.fullAddress}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white mb-5" style={{ fontFamily: 'var(--font-display)' }}>Navigasi</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Links */}
            <div>
              <h3 className="font-bold text-white mb-5" style={{ fontFamily: 'var(--font-display)' }}>Informasi</h3>
              <ul className="space-y-3">
                {infoLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-white mb-5" style={{ fontFamily: 'var(--font-display)' }}>Kontak</h3>
              <ul className="space-y-3.5">
                <li className="flex items-center gap-2.5 text-sm text-white/60">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span>Sen-Jum: 09.00-15.00</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-white/60">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span>{rwInfo.phone}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-white/60">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span>{rwInfo.email}</span>
                </li>
              </ul>

              {/* Social Media */}
              <div className="mt-6">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Media Sosial</p>
                <div className="flex gap-2.5">
                  <a
                    href="#"
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                    aria-label="Instagram"
                  >
                    <Camera className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                    aria-label="Facebook"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                    aria-label="YouTube"
                  >
                    <Video className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10">
          <div className="container-custom py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-center text-sm text-white/40">
                &copy; {new Date().getFullYear()} Portal RW 05 Kelurahan Sukamaju
              </p>
              <p className="text-xs text-white/30">
                Dibuat untuk warga, oleh warga 🏘️
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
