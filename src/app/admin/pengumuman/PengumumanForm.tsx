'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnnouncementCategory } from '@/types';
import { ContentStatus } from '@prisma/client';
import { createAnnouncement, updateAnnouncement } from '@/actions/announcement';
import { generateSlug } from '@/lib/utils';
import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';

type AnnouncementProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEdit?: boolean;
};

export default function PengumumanForm({ initialData, isEdit = false }: AnnouncementProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || 'Umum',
    isImportant: initialData?.isImportant || false,
    status: initialData?.status || ContentStatus.PUBLISHED,
  });

  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [imageBase64, setImageBase64] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (type === 'checkbox') {
        newData[name as keyof typeof newData] = (e.target as HTMLInputElement).checked as never;
      } else {
        newData[name as keyof typeof newData] = value as never;
      }
      
      // Auto-generate slug when title changes
      if (name === 'title' && !isEdit) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Ukuran file maksimal 2MB');
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

    try {
      const res = isEdit 
        ? await updateAnnouncement(initialData.id, formData, imageBase64)
        : await createAnnouncement(formData, imageBase64);
        
      if (res.success) {
        router.push('/admin/pengumuman');
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Umum', 'Keamanan', 'Kebersihan', 'Kesehatan', 'Pelayanan', 'Kegiatan', 'Darurat'];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/pengumuman" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Ubah informasi pengumuman yang sudah ada.' : 'Buat pengumuman baru untuk warga.'}
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">Judul Pengumuman *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Masukkan judul pengumuman"
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
                placeholder="judul-pengumuman"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-900">Kategori *</label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-900">Ringkasan (Opsional)</label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder="Ringkasan singkat pengumuman..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-900">Konten Pengumuman *</label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Tuliskan isi pengumuman selengkapnya di sini..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">Gambar/Banner (Opsional)</label>
            <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-10 relative overflow-hidden group">
              {imagePreview ? (
                <div className="relative w-full aspect-video md:aspect-[21/9]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none hover:text-primary-500"
                    >
                      <span>Upload gambar</span>
                      <input id="image-upload" name="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF maksimal 2MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Publikasi</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isImportant"
                name="isImportant"
                checked={formData.isImportant}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-600"
              />
              <label htmlFor="isImportant" className="text-sm text-gray-900 font-medium">
                Tandai sebagai Pengumuman Penting
              </label>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
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
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/pengumuman" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Pengumuman'}
          </button>
        </div>
      </form>
    </div>
  );
}
