'use client';

import { useState, useMemo } from 'react';
import SearchInput from '@/components/filters/SearchInput';
import CategoryFilter from '@/components/filters/CategoryFilter';
import AnnouncementCard from '@/components/cards/AnnouncementCard';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Announcement } from '@/types';

const categories = ['Semua', 'Penting', 'Kegiatan', 'Keamanan', 'Kebersihan', 'Lainnya'];

export default function PengumumanClient({ initialAnnouncements }: { initialAnnouncements: Announcement[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const filtered = useMemo(() => {
    let result = [...initialAnnouncements];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
      );
    }

    if (category !== 'Semua') {
      result = result.filter((a) => a.category === category);
    }

    return result;
  }, [search, category, initialAnnouncements]);

  return (
    <>
      <ScrollReveal direction="up" delay={100}>
        <div className="card-padded mb-8 bg-white border-(--color-rw-border)">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="grow max-w-md">
              <label className="block text-sm font-semibold text-(--color-rw-text) mb-2">Pencarian</label>
              <SearchInput value={search} onChange={setSearch} placeholder="Cari judul atau isi pengumuman..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--color-rw-text) mb-2">Filter Kategori</label>
              <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, index) => (
            <ScrollReveal key={item.id} delay={(index % 6) * 100}>
              <AnnouncementCard announcement={item} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <EmptyState 
            title="Tidak Ditemukan"
            message="Maaf, tidak ada pengumuman yang sesuai dengan kriteria pencarian Anda." 
          />
        </ScrollReveal>
      )}
    </>
  );
}
