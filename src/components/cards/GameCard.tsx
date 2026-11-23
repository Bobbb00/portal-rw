import Link from 'next/link';
import { PlayCircle, Clock } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  isActive: boolean;
}

export default function GameCard({ title, description, href, isActive }: GameCardProps) {
  if (!isActive) {
    return (
      <div className="">
        {/* Decorative pattern for inactive state */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
        
        <div className="mb-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Segera Hadir
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-500 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
        <p className="text-sm text-gray-400 grow mb-6">
          {description}
        </p>
        <button disabled className="w-full py-3 px-4 bg-gray-200 text-gray-400 text-sm font-semibold rounded-xl cursor-not-allowed">
          Belum Tersedia
        </button>
      </div>
    );
  }

  return (
    <div className="card p-1 bg-gradient-to-br from-(--color-rw-primary) to-(--color-rw-primary-light) relative overflow-hidden group h-full flex flex-col shadow-lg">
      <div className="bg-(--color-rw-primary-pale) rounded-[12px] p-5 sm:p-6 h-full flex flex-col relative z-10">
        <h3 className="text-xl font-bold text-(--color-rw-text) mb-3 group-hover:text-(--color-rw-primary) transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
        <p className="text-(--color-rw-text) text-sm mb-6 grow leading-relaxed">
          {description}
        </p>
        <Link 
          href={href}
          className="btn-primary w-full shadow-md"
        >
          <PlayCircle className="w-5 h-5" />
          Mainkan Sekarang
        </Link>
      </div>
    </div>
  );
}
