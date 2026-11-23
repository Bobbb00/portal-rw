'use client';

import { useState, useMemo } from 'react';
import SearchInput from '@/components/filters/SearchInput';
import CategoryFilter from '@/components/filters/CategoryFilter';
import BusinessCard from '@/components/cards/BusinessCard';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Business } from '@/types';

// Ekstrak kategori unik dari data UMKM, ditambah 'Semua'
const getUniqueCategories = (items: Business[]) => {
  const categories = items.map(item => item.category);
  return ['Semua', ...Array.from(new Set(categories))];
};

export default function UMKMClient({ initialUmkm }: { initialUmkm: Business[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  
  const categories = useMemo(() => getUniqueCategories(initialUmkm), [initialUmkm]);

  const filtered = useMemo(() => {
    let result = [...initialUmkm];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || 
               a.description.toLowerCase().includes(q)
      );
    }

    if (category !== 'Semua') {
      result = result.filter((a) => a.category === category);
    }

    return result;
  }, [search, category, initialUmkm]);

  return (
    <>
      <ScrollReveal direction="up" delay={100}>
        <div className="card-padded mb-8 bg-white/60 backdrop-blur-sm border-(--color-rw-border)">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="grow max-w-md">
              <label className="block text-sm font-semibold text-(--color-rw-text) mb-2">Cari Usaha</label>
              <SearchInput value={search} onChange={setSearch} placeholder="Cari nama usaha, pemilik, atau produk..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-(--color-rw-text) mb-2">Kategori Bisnis</label>
              <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, index) => (
            <ScrollReveal key={item.id} delay={(index % 3) * 100}>
              <BusinessCard item={item} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <EmptyState 
            title="Usaha Tidak Ditemukan"
            message="Belum ada data UMKM yang cocok dengan filter pencarian Anda saat ini." 
          />
        </ScrollReveal>
      )}
    </>
  );
}
