'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGalleryItem, updateGalleryItem } from '@/actions/gallery';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type GaleriProps = {
  initialData?: {
    id: string;
    title: string;
    description?: string;
    date?: string | Date;
    category: string;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    imageUrl?: string;
  } | null;
  isEdit?: boolean;
};

export default function GaleriForm({ initialData, isEdit = false }: GaleriProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Format date to YYYY-MM-DD for input type="date"
  let defaultDate = '';
  if (initialData?.date) {
    const d = new Date(initialData.date);
    defaultDate = d.toISOString().split('T')[0];
  } else {
    defaultDate = new Date().toISOString().split('T')[0];
  }

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: defaultDate,
    category: initialData?.category || 'Umum',
    status: (initialData?.status || 'PUBLISHED') as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
  });

  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [imageBase64, setImageBase64] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Ukuran gambar maksimal 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageBase64(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!isEdit && !imageBase64) {
      setError('Foto galeri wajib diunggah.');
      return;
    }

    try {
      const res = isEdit && initialData?.id
        ? await updateGalleryItem(initialData.id, formData, imageBase64)
        : await createGalleryItem(formData, imageBase64);
        
      if (res.success) {
        router.push('/admin/galeri');
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
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
        <Link href="/admin/galeri" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Ubah informasi foto dokumentasi.' : 'Unggah foto dokumentasi kegiatan RW baru.'}
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">Foto Dokumentasi *</label>
            <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-10 relative overflow-hidden group">
              {imagePreview ? (
                <div className="absolute inset-0 w-full h-full">
                  <Image src={imagePreview} alt="Preview" fill className="object-contain bg-gray-900" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Hapus Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none hover:text-primary-500"
                    >
                      <span>Pilih foto</span>
                      <input id="image-upload" name="image-upload" type="file" accept="image/*" required={!isEdit} className="sr-only" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">PNG, JPG, WEBP maksimal 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">Judul / Keterangan Singkat *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Kegiatan Kerja Bakti RT 01"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-900">Tanggal Kegiatan</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-900">Kategori / Album</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                >
                  <option value="Umum">Umum</option>
                  <option value="Kerja Bakti">Kerja Bakti</option>
                  <option value="Posyandu">Posyandu</option>
                  <option value="Rapat Warga">Rapat Warga</option>
                  <option value="Perlombaan">Perlombaan</option>
                  <option value="Kegiatan Sosial">Kegiatan Sosial</option>
                  <option value="Hari Kemerdekaan">Hari Kemerdekaan</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">Deskripsi Panjang (Opsional)</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Ceritakan detail kegiatan ini..."
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
              <option value="PUBLISHED">Publikasi (Published)</option>
              <option value="DRAFT">Draft (Sembunyikan)</option>
              <option value="ARCHIVED">Arsip (Archived)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/galeri" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Foto'}
          </button>
        </div>
      </form>
    </div>
  );
}
