'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentStatus } from '@prisma/client';
import { createBusiness, updateBusiness } from '@/actions/business';
import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';

type UmkmProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEdit?: boolean;
};

export default function UmkmForm({ initialData, isEdit = false }: UmkmProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  let initialSocialMedia = { instagram: '', facebook: '', tokopedia: '', shopee: '' };
  try {
    if (initialData?.socialMedia) {
      initialSocialMedia = typeof initialData.socialMedia === 'string' 
        ? JSON.parse(initialData.socialMedia) 
        : initialData.socialMedia;
    }
  } catch(e) {}

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Makanan',
    description: initialData?.description || '',
    address: initialData?.address || '',
    operatingHours: initialData?.operatingHours || '',
    whatsapp: initialData?.whatsapp || '',
    instagram: initialSocialMedia?.instagram || '',
    facebook: initialSocialMedia?.facebook || '',
    tokopedia: initialSocialMedia?.tokopedia || '',
    shopee: initialSocialMedia?.shopee || '',
    status: initialData?.status || ContentStatus.PUBLISHED,
  });

  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [imageBase64, setImageBase64] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        ? await updateBusiness(initialData.id, formData, imageBase64)
        : await createBusiness(formData, imageBase64);
        
      if (res.success) {
        router.push('/admin/umkm');
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Makanan', 'Minuman', 'Jasa', 'Kerajinan', 'Fashion', 'Kebutuhan Rumah Tangga'];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/umkm" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit UMKM' : 'Tambah UMKM'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Ubah informasi UMKM warga.' : 'Daftarkan bisnis/UMKM baru milik warga.'}
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">Nama UMKM / Bisnis *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Masukkan nama bisnis"
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

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-900">Alamat Lengkap *</label>
              <textarea
                id="address"
                name="address"
                required
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Jl. Melati No. 10, RT 01"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-900">Jam Operasional *</label>
              <input
                type="text"
                id="operatingHours"
                name="operatingHours"
                required
                value={formData.operatingHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Senin - Sabtu (08:00 - 17:00)"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-900">Nomor WhatsApp *</label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">Deskripsi UMKM *</label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Deskripsi produk atau layanan..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">Foto/Logo UMKM (Opsional)</label>
            <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-10 relative overflow-hidden group">
              {imagePreview ? (
                <div className="relative w-full md:w-1/2 aspect-square">
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
                      <span>Upload foto</span>
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Media Sosial (Opsional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-900">Instagram</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Username atau Link Profil"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-900">Facebook</label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Username atau Link Profil"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tokopedia" className="block text-sm font-medium text-gray-900">Tokopedia</label>
              <input
                type="text"
                id="tokopedia"
                name="tokopedia"
                value={formData.tokopedia}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Link Toko"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="shopee" className="block text-sm font-medium text-gray-900">Shopee</label>
              <input
                type="text"
                id="shopee"
                name="shopee"
                value={formData.shopee}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Link Toko"
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
          <Link href="/admin/umkm" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan UMKM'}
          </button>
        </div>
      </form>
    </div>
  );
}
