'use client';

import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import CategoryFilter from '@/components/filters/CategoryFilter';
import GalleryCard from '@/components/cards/GalleryCard';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { GalleryItem } from '@/types';
import { generatePlaceholderImage, formatShortDate } from '@/lib/utils';

const getUniqueAlbums = (items: GalleryItem[]) => {
  const albums = items.map(item => item.album);
  return ['Semua', ...Array.from(new Set(albums))];
};

export default function GaleriClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [album, setAlbum] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const albums = useMemo(() => getUniqueAlbums(initialItems), [initialItems]);

  const filtered = useMemo(() => {
    if (album === 'Semua') return initialItems;
    return initialItems.filter(item => item.album === album);
  }, [album, initialItems]);

  // Modal handlers
  const openModal = (index: number) => {
    setSelectedImage(index);
    // eslint-disable-next-line react-hooks/immutability
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
     
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filtered.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filtered.length) % filtered.length);
    }
  };

  return (
    <>
      <ScrollReveal direction="up" delay={100}>
        <div className="card-padded mb-8 bg-white/60 backdrop-blur-sm border-(--color-rw-border)">
          <label className="block text-sm font-semibold text-(--color-rw-text) mb-3">Filter Album Kegiatan</label>
          <CategoryFilter categories={albums} selected={album} onChange={setAlbum} />
        </div>
      </ScrollReveal>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((item, index) => (
            <ScrollReveal key={item.id} delay={(index % 4) * 100}>
              <GalleryCard item={item} onClick={() => openModal(index)} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <EmptyState 
            title="Galeri Kosong"
            message="Belum ada dokumentasi foto untuk album ini." 
          />
        </ScrollReveal>
      )}

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black"
          style={{ zIndex: 9999 }}
          onClick={closeModal}
        >
          {/* Close button */}
          <button 
            onClick={(e) => { e.stopPropagation(); closeModal(); }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ zIndex: 10000 }}
            aria-label="Tutup galeri"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div 
            className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white/80 text-sm font-medium"
            style={{ zIndex: 10000 }}
          >
            {selectedImage + 1} / {filtered.length}
          </div>

          {/* Prev button */}
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ zIndex: 10000 }}
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Next button */}
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ zIndex: 10000 }}
            aria-label="Foto selanjutnya"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Image + Info - clicks here don't close modal */}
          <div 
            className="flex flex-col items-center w-full max-w-5xl max-h-screen px-16 py-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={filtered[selectedImage].image || generatePlaceholderImage(1200, 800, filtered[selectedImage].title, '#174b3a')}
              alt={filtered[selectedImage].title}
              className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl"
            />
            
            <div className="mt-5 text-center max-w-2xl bg-black/50 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 w-full">
              <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {filtered[selectedImage].title}
              </h3>
              <div className="flex items-center justify-center gap-4 text-sm text-white/60 mb-1">
                <span>{filtered[selectedImage].album}</span>
                <span>&bull;</span>
                <span>{formatShortDate(filtered[selectedImage].date)}</span>
              </div>
              {filtered[selectedImage].caption && (
                <p className="text-white/80 text-sm">{filtered[selectedImage].caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
