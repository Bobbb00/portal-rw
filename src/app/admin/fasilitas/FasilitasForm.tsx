"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFacility, updateFacility } from "@/actions/facility";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type FasilitasProps = {
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    location?: string;
    category?: string;
    operationalHours?: string | null;
    rules?: string | null;
    contact?: string | null;
    status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
    imageUrl?: string | null;
  } | null;
  isEdit?: boolean;
};

export default function FasilitasForm({
  initialData,
  isEdit = false,
}: FasilitasProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    category: initialData?.category || "Umum",
    operationalHours: initialData?.operationalHours || "",
    rules: initialData?.rules || "",
    contact: initialData?.contact || "",
    status: initialData?.status || "PUBLISHED",
  });

  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const [imageBase64, setImageBase64] = useState<string | undefined>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Ukuran gambar maksimal 5MB");
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
    setImagePreview("");
    setImageBase64(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = isEdit
        ? await updateFacility(initialData!.id!, formData, imageBase64)
        : await createFacility(formData, imageBase64);

      if (res.success) {
        router.push("/admin/fasilitas");
      } else {
        setError(res.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/fasilitas"
          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Fasilitas" : "Tambah Fasilitas"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEdit
              ? "Ubah informasi fasilitas lingkungan."
              : "Tambahkan fasilitas baru di lingkungan RW."}
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
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Nama Fasilitas *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Balai Warga RW 05"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900"
              >
                Deskripsi Singkat *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Jelaskan fasilitas ini..."
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-900"
              >
                Lokasi / Alamat
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Jl. Mawar No 10"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-900"
              >
                Kategori
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              >
                <option value="Umum">Umum</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Ibadah">Ibadah</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="operationalHours"
                className="block text-sm font-medium text-gray-900"
              >
                Jam Operasional
              </label>
              <input
                type="text"
                id="operationalHours"
                name="operationalHours"
                value={formData.operationalHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Setiap Hari, 08:00 - 22:00"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-900"
              >
                Kontak Pengelola
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Contoh: Pak Budi (08123456789)"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="rules"
                className="block text-sm font-medium text-gray-900"
              >
                Aturan Penggunaan
              </label>
              <textarea
                id="rules"
                name="rules"
                rows={3}
                value={formData.rules}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="1. Dilarang membuang sampah sembarangan... (Gunakan baris baru)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Foto Fasilitas
            </label>
            <div className="mt-2 flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-10 relative overflow-hidden group">
              {imagePreview ? (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
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
                  <ImageIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none hover:text-primary-500"
                    >
                      <span>Upload foto fasilitas</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">
                    PNG, JPG, WEBP maksimal 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Pengaturan Publikasi
          </h3>

          <div className="space-y-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Status Publikasi
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
            >
              <option value="PUBLISHED">
                Publikasi (Published)
              </option>
              <option value="DRAFT">Draft (Sembunyikan)</option>
              <option value="ARCHIVED">Arsip (Archived)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/fasilitas"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan Fasilitas"}
          </button>
        </div>
      </form>
    </div>
  );
}
