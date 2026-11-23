import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Edit, Calendar } from 'lucide-react';
import { getGalleryItems } from '@/actions/gallery';
import { getStatusColor, formatShortDate } from '@/lib/utils';
import DeleteButton from './DeleteButton';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Kelola Galeri | Admin RW 05',
};

export default async function AdminGaleriPage() {
  const galleryItems = await getGalleryItems();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Galeri Kegiatan</h1>
          <p className="text-gray-500 text-sm mt-1">Unggah dokumentasi foto kegiatan dan aktivitas warga.</p>
        </div>
        <Link href="/admin/galeri/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Foto
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems.length > 0 ? (
          galleryItems.map((item) => (
            <div key={item.id} className="card overflow-hidden group">
              <div className="relative aspect-square w-full bg-gray-100">
                <Image 
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="flex justify-end gap-2 mb-2">
                    <Link 
                      href={`/admin/galeri/${item.id}/edit`}
                      className="p-1.5 bg-white text-gray-700 hover:text-primary-600 rounded-lg transition-colors shadow-sm"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteButton id={item.id} title={item.title} />
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{item.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.eventDate ? formatShortDate(item.eventDate.toISOString()) : '-'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            Belum ada foto galeri.
          </div>
        )}
      </div>
    </div>
  );
}
