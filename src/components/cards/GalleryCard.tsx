import { Calendar, Search } from 'lucide-react';
import { generatePlaceholderImage, formatShortDate } from '@/lib/utils';
import { GalleryItem } from '@/types';

interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
}

export default function GalleryCard({ item, onClick }: GalleryCardProps) {
  const imageUrl = item.image || generatePlaceholderImage(600, 400, item.title, '#174b3a');

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square sm:aspect-[4/3] bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#174b3a]/90 via-[#174b3a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-1.5 text-xs text-white/80 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatShortDate(item.date)}</span>
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {item.title}
          </h3>
          <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
            {item.album}
          </p>
        </div>
        
        {/* Zoom icon hint */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <Search className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}
