# Portal Informasi Lingkungan RW 05

Website portal informasi resmi untuk warga RW 05 Kelurahan Sukamaju. Berisi informasi kegiatan, layanan administrasi, keamanan, kebersihan, fasilitas lingkungan, daftar UMKM, dan galeri kegiatan warga.

## 🌟 Fitur Utama

- **Pengumuman & Agenda**: Informasi kegiatan terbaru dan jadwal kegiatan mendatang.
- **Layanan Administrasi**: Daftar persyaratan dan prosedur untuk berbagai layanan surat pengantar.
- **Keamanan & Kebersihan**: Jadwal ronda, jadwal pengangkutan sampah, kontak darurat, dan informasi fasilitas bank sampah.
- **Fasilitas Lingkungan**: Daftar fasilitas publik seperti balai warga, lapangan olahraga, dan posyandu.
- **Direktori UMKM**: Daftar usaha mikro kecil menengah (UMKM) milik warga yang dilengkapi dengan tombol WhatsApp langsung.
- **Dokumen Publik**: Akses untuk mengunduh dokumen publik dan formulir layanan.
- **Permainan Edukatif**: Kuis interaktif untuk mengenali lingkungan sekitar (Kuis Lingkungan RW).
- **Galeri**: Dokumentasi foto kegiatan dengan fitur *lightbox* interaktif.

## 🛠️ Teknologi yang Digunakan

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/icons/) untuk Ikon
- Data dummy lokal (Tanpa Database backend)

## 🚀 Panduan Menjalankan Project

### Prasyarat

Pastikan komputer Anda sudah terinstal:
- Node.js (v18.17.0 atau lebih baru)
- npm (Node Package Manager)

### Langkah-langkah

1. **Clone repository ini** (jika ada) atau ekstrak file project.
2. **Buka terminal** dan arahkan ke folder project:
   ```bash
   cd portal-rw
   ```
3. **Instal dependensi**:
   ```bash
   npm install
   ```
4. **Jalankan *Development Server***:
   ```bash
   npm run dev
   ```
5. **Akses Website**:
   Buka browser dan akses [http://localhost:3000](http://localhost:3000)

### Struktur Data (Dummy)

Seluruh data konten saat ini tersimpan dalam bentuk array statis di folder `src/data/`:
- `activities.ts` (Agenda)
- `announcements.ts` (Pengumuman)
- `businesses.ts` (UMKM)
- `contacts.ts` (Kontak Penting)
- `documents.ts` (Dokumen Unduhan)
- `facilities.ts` (Fasilitas Umum)
- `gallery.ts` (Galeri Foto)
- `neighborhood-units.ts` (Data RT)
- `profile.ts` (Profil Singkat RW)
- `quiz.ts` (Soal Permainan Edukatif)
- `services.ts` (Layanan Administrasi)

Anda bisa mengedit file-file ini untuk mengubah konten yang ditampilkan di website secara statis.

### Build untuk Produksi

Jika ingin melakukan kompilasi website untuk diletakkan di server produksi:

```bash
npm run build
npm run start
```
