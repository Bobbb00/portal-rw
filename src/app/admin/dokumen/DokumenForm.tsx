'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentStatus } from '@prisma/client';
import { createDocument, updateDocument } from '@/actions/document';
import { Save, ArrowLeft, FileText, X } from 'lucide-react';
import Link from 'next/link';

type DokumenProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEdit?: boolean;
};

export default function DokumenForm({ initialData, isEdit = false }: DokumenProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Formulir',
    description: initialData?.description || '',
    status: initialData?.status || ContentStatus.PUBLISHED,
  });

  const [fileName, setFileName] = useState(initialData?.fileUrl ? 'File saat ini sudah diupload' : '');
  const [fileSizeStr, setFileSizeStr] = useState(initialData?.fileSize || '');
  const [fileTypeStr, setFileTypeStr] = useState(initialData?.fileType || '');
  const [fileBase64, setFileBase64] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for documents
        alert('Ukuran file maksimal 10MB');
        return;
      }
      
      setFileName(file.name);
      
      // Calculate human readable file size
      const sizeInKb = Math.round(file.size / 1024);
      const sizeStr = sizeInKb > 1024 
        ? `${(sizeInKb / 1024).toFixed(2)} MB` 
        : `${sizeInKb} KB`;
      setFileSizeStr(sizeStr);
      
      // Get file extension
      const ext = file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
      setFileTypeStr(ext);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setFileName('');
    setFileBase64(undefined);
    setFileSizeStr('');
    setFileTypeStr('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const submissionData = {
      ...formData,
      fileSize: fileSizeStr,
      fileType: fileTypeStr,
    };

    try {
      const res = isEdit 
        ? await updateDocument(initialData.id, submissionData, fileBase64)
        : await createDocument(submissionData, fileBase64);
        
      if (res.success) {
        router.push('/admin/dokumen');
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Formulir', 'Jadwal', 'Tata Tertib', 'Panduan', 'Laporan', 'Program Kerja'];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/dokumen" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Dokumen' : 'Tambah Dokumen'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit ? 'Ubah informasi dokumen.' : 'Unggah dokumen baru untuk warga.'}
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">Nama Dokumen *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Formulir Pendaftaran Warga Baru"
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">Deskripsi Singkat (Opsional)</label>
            <textarea
              id="description"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Deskripsi singkat mengenai kegunaan dokumen ini..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">File Dokumen {isEdit ? '(Biarkan kosong jika tidak diubah)' : '*'}</label>
            <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-10 relative overflow-hidden group">
              {fileName ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-12 w-12 text-primary-500 mb-3" />
                  <p className="text-sm font-medium text-gray-900">{fileName}</p>
                  <p className="text-xs text-gray-500 mt-1">{fileSizeStr} • {fileTypeStr}</p>
                  {!isEdit && (
                    <button
                      type="button"
                      onClick={removeFile}
                      className="mt-4 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Hapus File
                    </button>
                  )}
                  {isEdit && fileBase64 && (
                    <button
                      type="button"
                      onClick={removeFile}
                      className="mt-4 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Batal Ubah File
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none hover:text-primary-500"
                    >
                      <span>Upload file</span>
                      <input id="file-upload" name="file-upload" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">PDF, Word, Excel maksimal 10MB</p>
                </div>
              )}
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
          <Link href="/admin/dokumen" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Dokumen'}
          </button>
        </div>
      </form>
    </div>
  );
}
