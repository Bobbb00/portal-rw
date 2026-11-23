'use client';

import { useState, useMemo } from 'react';
import CategoryFilter from '@/components/filters/CategoryFilter';
import ActivityCard from '@/components/cards/ActivityCard';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Activity } from '@/types';

const statusFilters = [
  { value: 'all', label: 'Semua Agenda' },
  { value: 'upcoming', label: 'Akan Datang' },
  { value: 'ongoing', label: 'Sedang Berlangsung' },
  { value: 'completed', label: 'Selesai' },
];

export default function AgendaClient({ initialActivities }: { initialActivities: Activity[] }) {
  const [statusFilter, setStatusFilter] = useState('upcoming');

  const filtered = useMemo(() => {
    let result = [...initialActivities];

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Sort: upcoming & ongoing diurutkan dari yang terdekat, completed dari yang terbaru
    result.sort((a, b) => {
      if (statusFilter === 'completed') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return result;
  }, [statusFilter, initialActivities]);

  return (
    <>
      <ScrollReveal direction="up" delay={100}>
        <div className="card-padded mb-8 bg-white/60 backdrop-blur-sm border-(--color-rw-border)">
          <label className="block text-sm font-semibold text-(--color-rw-text) mb-3">Filter Status Kegiatan</label>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                  statusFilter === filter.value
                    ? 'bg-(--color-rw-primary) text-white border-(--color-rw-primary) shadow-md'
                    : 'bg-(--color-rw-surface) text-(--color-rw-muted) border-(--color-rw-border) hover:border-(--color-rw-primary-light) hover:text-(--color-rw-primary)'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {filtered.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {filtered.map((activity, index) => (
            <ScrollReveal key={activity.id} delay={(index % 4) * 100}>
              <ActivityCard activity={activity} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <EmptyState 
            title="Tidak Ada Agenda"
            message="Belum ada kegiatan yang dijadwalkan pada kategori status ini."
          />
        </ScrollReveal>
      )}
    </>
  );
}
