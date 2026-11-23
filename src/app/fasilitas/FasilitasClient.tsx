'use client';

import { useState, useMemo } from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import CategoryFilter from '@/components/filters/CategoryFilter';
import EmptyState from '@/components/ui/EmptyState';
import { Facility, FacilityCategory } from '@/types';
import { generatePlaceholderImage } from '@/lib/utils';

const categories = ['Semua', 'Pelayanan', 'Kesehatan', 'Olahraga', 'Keamanan', 'Sosial', 'Kebersihan'];

export default function FasilitasClient({ initialFacilities }: { initialFacilities: Facility[] }) {
  const [category, setCategory] = useState('Semua');

  const filtered = useMemo(() => {
    if (category === 'Semua') return initialFacilities;
    return initialFacilities.filter((f) => f.category === (category as FacilityCategory));
  }, [category, initialFacilities]);

  return (
    <>
      <div className="mb-8">
        <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((facility) => {
            const placeholderImage = generatePlaceholderImage(400, 250, facility.name, '#15803d');
            return (
              <div key={facility.id} className="card overflow-hidden">
                <div className="h-44 overflow-hidden">
                  <img
                    src={facility.image || placeholderImage}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span className="badge bg-primary-50 text-primary-700 mb-2">{facility.category}</span>
                  <h2 className="font-semibold text-gray-900 mb-2">{facility.name}</h2>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{facility.description}</p>
                  <div className="space-y-1.5 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{facility.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{facility.operatingHours}</span>
                    </div>
                  </div>
                  <details className="text-sm">
                    <summary className="text-primary-600 cursor-pointer font-medium hover:text-primary-700">
                      Aturan Penggunaan
                    </summary>
                    <ul className="mt-2 space-y-1 text-gray-500">
                      {facility.rules.map((rule, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 shrink-0" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}
