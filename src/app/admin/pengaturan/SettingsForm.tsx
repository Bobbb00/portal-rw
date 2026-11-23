"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/actions/settings";
import { Save, Settings } from "lucide-react";

type SettingsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
};

export default function SettingsForm({ initialData }: SettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    rwName: initialData?.rwName || "RW 05",
    village: initialData?.village || "Sukamaju",
    district: initialData?.district || "Cilodong",
    city: initialData?.city || "Depok",
    province: initialData?.province || "Jawa Barat",
    contactEmail: initialData?.contactEmail || "",
    contactPhone: initialData?.contactPhone || "",
    socialInstagram: initialData?.socialInstagram || "",
    socialFacebook: initialData?.socialFacebook || "",
    socialYoutube: initialData?.socialYoutube || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await updateSiteSettings(formData);

      if (res.success) {
        setSuccessMsg(res.message);
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
        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Situs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Konfigurasi informasi umum, wilayah, dan kontak website Portal RW.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            Informasi Wilayah
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="rwName"
                className="block text-sm font-medium text-gray-900"
              >
                Nama RW *
              </label>
              <input
                type="text"
                id="rwName"
                name="rwName"
                required
                value={formData.rwName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="village"
                className="block text-sm font-medium text-gray-900"
              >
                Kelurahan *
              </label>
              <input
                type="text"
                id="village"
                name="village"
                required
                value={formData.village}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-900"
              >
                Kecamatan *
              </label>
              <input
                type="text"
                id="district"
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-900"
              >
                Kota / Kabupaten *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-900"
              >
                Provinsi *
              </label>
              <input
                type="text"
                id="province"
                name="province"
                required
                value={formData.province}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            Kontak & Media Sosial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="contactEmail"
                className="block text-sm font-medium text-gray-900"
              >
                Email Resmi
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="sekretariat@rw05.id"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contactPhone"
                className="block text-sm font-medium text-gray-900"
              >
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="081234567890"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="socialInstagram"
                className="block text-sm font-medium text-gray-900"
              >
                Link Instagram
              </label>
              <input
                type="url"
                id="socialInstagram"
                name="socialInstagram"
                value={formData.socialInstagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="socialFacebook"
                className="block text-sm font-medium text-gray-900"
              >
                Link Facebook
              </label>
              <input
                type="url"
                id="socialFacebook"
                name="socialFacebook"
                value={formData.socialFacebook}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="socialYoutube"
                className="block text-sm font-medium text-gray-900"
              >
                Link YouTube
              </label>
              <input
                type="url"
                id="socialYoutube"
                name="socialYoutube"
                value={formData.socialYoutube}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
