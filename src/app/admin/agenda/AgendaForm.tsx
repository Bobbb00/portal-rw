'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentStatus } from '@prisma/client';
import { createActivity, updateActivity } from '@/actions/activity';
import { generateSlug } from '@/lib/utils';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type AgendaProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEdit?: boolean;
};

export default function AgendaForm({ initialData, isEdit = false }: AgendaProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const formatDateForInput = (date: Date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate ? formatDateForInput(initialData.startDate) : '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    location: initialData?.location || '',
    organizer: initialData?.organizer || '',
    participants: initialData?.participants || '',
    requirements: initialData?.requirements || '',
    status: initialData?.status || ContentStatus.PUBLISHED,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev };
      newData[name as keyof typeof newData] = value as never;
      
      if (name === 'title' && !isEdit) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = isEdit 
        ? await updateActivity(initialData.id, formData)
        : await createActivity(formData);
        
      if (res.success) {
        router.push('/admin/agenda');
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Terjadi kesalahan sistem.');
      } else {
        setError('Terjadi kesalahan sistem.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/agenda" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Agenda' : 'Tambah Agenda'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Ubah informasi kegiatan warga.' : 'Buat kegiatan baru untuk warga.'}
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
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">Nama Kegiatan *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Masukkan nama kegiatan"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-900">Slug (URL) *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50"
                placeholder="nama-kegiatan"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-900">Tanggal Kegiatan *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-900">Waktu Mulai *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-900">Waktu Selesai *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-900">Lokasi Kegiatan *</label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Balai Warga RW 05"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-900">Penyelenggara *</label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                required
                value={formData.organizer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Karang Taruna"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="participants" className="block text-sm font-medium text-gray-900">Peserta *</label>
              <input
                type="text"
                id="participants"
                name="participants"
                required
                value={formData.participants}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Seluruh Warga"
              />
            </div>

          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">Deskripsi Kegiatan *</label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Deskripsi kegiatan secara detail..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-900">Persyaratan (Opsional)</label>
            <textarea
              id="requirements"
              name="requirements"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Contoh: Membawa alat tulis, dll. Pisahkan dengan enter (baris baru) jika lebih dari satu."
            />
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
          <Link href="/admin/agenda" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Agenda'}
          </button>
        </div>
      </form>
    </div>
  );
}
