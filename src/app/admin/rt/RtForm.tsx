'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentStatus } from '@prisma/client';
import { createNeighborhoodUnit, updateNeighborhoodUnit } from '@/actions/rt';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type RtProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEdit?: boolean;
};

export default function RtForm({ initialData, isEdit = false }: RtProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    number: initialData?.number || '',
    leaderName: initialData?.leaderName || '',
    area: initialData?.area || '',
    officeLocation: initialData?.officeLocation || '',
    serviceHours: initialData?.serviceHours || '',
    officialContact: initialData?.officialContact || '',
    status: initialData?.status || ContentStatus.PUBLISHED,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = isEdit 
        ? await updateNeighborhoodUnit(initialData.id, formData)
        : await createNeighborhoodUnit(formData);
        
      if (res.success) {
        router.push('/admin/rt');
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/rt" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Data RT' : 'Tambah Data RT'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Ubah informasi kepengurusan RT.' : 'Masukkan data kepengurusan RT baru.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="number" className="block text-sm font-medium text-gray-900">Nomor RT *</label>
              <input
                type="text"
                id="number"
                name="number"
                required
                value={formData.number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: 01"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="leaderName" className="block text-sm font-medium text-gray-900">Nama Ketua RT *</label>
              <input
                type="text"
                id="leaderName"
                name="leaderName"
                required
                value={formData.leaderName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Masukkan nama ketua RT"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="area" className="block text-sm font-medium text-gray-900">Cakupan Wilayah (Opsional)</label>
              <textarea
                id="area"
                name="area"
                rows={2}
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Jl. Mawar Blok A - C"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="officeLocation" className="block text-sm font-medium text-gray-900">Lokasi Pos/Sekretariat (Opsional)</label>
              <input
                type="text"
                id="officeLocation"
                name="officeLocation"
                value={formData.officeLocation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Pos Kamling RT 01"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="serviceHours" className="block text-sm font-medium text-gray-900">Jam Pelayanan (Opsional)</label>
              <input
                type="text"
                id="serviceHours"
                name="serviceHours"
                value={formData.serviceHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: 19:00 - 21:00 WIB"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="officialContact" className="block text-sm font-medium text-gray-900">Kontak Resmi (Opsional)</label>
              <input
                type="text"
                id="officialContact"
                name="officialContact"
                value={formData.officialContact}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Publikasi</h3>
          
          <div className="space-y-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">Status Publikasi</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
            >
              <option value={ContentStatus.PUBLISHED}>Publikasi (Published)</option>
              <option value={ContentStatus.DRAFT}>Draft (Sembunyikan)</option>
              <option value={ContentStatus.ARCHIVED}>Arsip (Archived)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/rt" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Data RT'}
          </button>
        </div>
      </form>
    </div>
  );
}
