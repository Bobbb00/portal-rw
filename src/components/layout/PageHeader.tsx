import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import WaveDivider from '@/components/ui/WaveDivider';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: { label: string; href?: string }[];
}

export default function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="page-header">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-8 left-[10%] w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-12 right-[15%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full" />
      </div>

      <div className="container-custom pt-10 pb-16 sm:pt-12 sm:pb-20 relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-1.5 text-sm text-white/60 flex-wrap">
            <li>
              <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Beranda</span>
              </Link>
            </li>
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 animate-fade-in"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/70 text-base sm:text-lg max-w-2xl animate-slide-up">
            {subtitle}
          </p>
        )}
      </div>

      {/* Wave divider */}
      <WaveDivider color="var(--color-rw-bg)" />
    </div>
  );
}
