'use client';

import { useState, useMemo } from 'react';
import SearchInput from '@/components/filters/SearchInput';
import CategoryFilter from '@/components/filters/CategoryFilter';
import DocumentCard from '@/components/cards/DocumentCard';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { DocumentItem } from '@/types';

const getUniqueCategories = (items: DocumentItem[]) => {
  const categories = items.map(item => item.category);
  return ['Semua', ...Array.from(new Set(categories))];
};

export default function DokumenClient({ initialDocuments }: { initialDocuments: DocumentItem[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  
  const categories = useMemo(() => getUniqueCategories(initialDocuments), [initialDocuments]);

  const filtered = useMemo(() => {
    let result = [...initialDocuments];

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
  }, [search, category, initialDocuments]);

  return (
    <>
      <ScrollReveal direction="up" delay={100}>
        <div className="card-padded mb-8 bg-white/60 backdrop-blur-sm border-(--color-rw-border) flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="w-full md:max-w-xs">
             <SearchInput value={search} onChange={setSearch} placeholder="Cari dokumen..." />
          </div>
          <div className="w-full md:w-auto">
             <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
          </div>
        </div>
      </ScrollReveal>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((doc, index) => (
            <ScrollReveal key={doc.id} delay={(index % 4) * 100}>
              <DocumentCard document={doc} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <EmptyState 
            title="Dokumen Tidak Ditemukan"
            message="Belum ada dokumen yang sesuai dengan pencarian Anda." 
          />
        </ScrollReveal>
      )}
    </>
  );
}
