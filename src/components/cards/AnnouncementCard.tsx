import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { Announcement } from '@/types';
import { formatShortDate } from '@/lib/utils';

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  // Map category to color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Penting': return 'bg-red-500';
      case 'Kegiatan': return 'bg-blue-500';
      case 'Keamanan': return 'bg-amber-500';
      case 'Kebersihan': return 'bg-green-500';
      default: return 'bg-(--color-rw-primary-pale)';
    }
  };

  return (
    <Link href={`/pengumuman/${announcement.slug}`} className="block group">
      <div className="card bg-white p-5 sm:p-6 h-full flex flex-col relative overflow-hidden">
        {/* Accent border on the left */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getCategoryColor(announcement.category)} transition-transform group-hover:scale-y-110 origin-center`} />

        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="badge text-[10px] sm:text-xs tracking-wider uppercase border border-(--color-rw-border) bg-(--color-rw-primary-pale) text-(--color-rw-text)">
            {announcement.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-(--color-rw-text) bg-(--color-rw-primary-pale) px-2.5 py-1 rounded-full shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            <time>{formatShortDate(announcement.publishedAt)}</time>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-(--color-rw-text) mb-3 group-hover:text-(--color-rw-primary) transition-colors line-clamp-2"
            style={{ fontFamily: 'var(--font-display)' }}>
          {announcement.title}
        </h3>

        <p className="text-sm text-(--color-rw-text) line-clamp-3 mb-6 grow leading-relaxed">
          {announcement.content}
        </p>

        <div className="flex items-center text-sm font-semibold text-(--color-rw-text) mt-auto group-hover:text-(--color-rw-primary) transition-colors">
          Baca selengkapnya
          <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
