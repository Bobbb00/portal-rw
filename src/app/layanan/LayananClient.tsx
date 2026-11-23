'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Clock, Phone, Download, CheckCircle, ListOrdered } from 'lucide-react';
import SearchInput from '@/components/filters/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import { Service } from '@/types';

export default function LayananClient({ initialServices }: { initialServices: Service[] }) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return initialServices;
    const q = search.toLowerCase();
    return initialServices.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [search, initialServices]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <div className="mb-8 max-w-md">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari layanan..." />
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((service) => {
            const isExpanded = expandedId === service.id;
            return (
              <div key={service.id} className="card overflow-hidden">
                <button
                  onClick={() => toggleExpand(service.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  aria-expanded={isExpanded}
                >
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-1">{service.name}</h2>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-gray-50 pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Persyaratan */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary-500" />
                          Persyaratan
                        </h3>
                        <ul className="space-y-1.5">
                          {service.requirements.map((req, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Prosedur */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                          <ListOrdered className="w-4 h-4 text-primary-500" />
                          Prosedur
                        </h3>
                        <ol className="space-y-1.5">
                          {service.procedure.map((step, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-5 h-5 bg-primary-50 text-primary-700 rounded text-xs flex items-center justify-center font-medium shrink-0">{i + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Footer info */}
                    <div className="mt-5 pt-4 border-t border-gray-50 flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Estimasi: {service.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{service.contactPerson}: {service.contactPhone}</span>
                      </div>
                      {service.downloadUrl && (
                        <a href={service.downloadUrl} className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700">
                          <Download className="w-4 h-4" />
                          Unduh Formulir
                        </a>
                      )}
                    </div>
                  </div>
                )}
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
