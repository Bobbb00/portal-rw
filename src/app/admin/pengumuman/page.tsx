import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { getAnnouncements } from '@/actions/announcement';
import { getStatusLabel, getStatusColor, formatShortDate } from '@/lib/utils';
import DeleteButton from './DeleteButton';

export const metadata: Metadata = {
  title: 'Kelola Pengumuman | Admin RW 05',
};

export default async function AdminPengumumanPage() {
  const announcements = await getAnnouncements();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pengumuman</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data pengumuman yang tampil di website publik.</p>
        </div>
        <Link href="/admin/pengumuman/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Baru
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari pengumuman..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Judul</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tgl Publish</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                      {item.isImportant && (
                        <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-medium bg-red-100 text-red-700">
                          Penting
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.publishedAt ? formatShortDate(item.publishedAt.toISOString()) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/pengumuman/${item.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton id={item.id} title={item.title} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data pengumuman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <div>Menampilkan 1 hingga {announcements.length} dari {announcements.length} entri</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Sebelumnnya</button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded font-medium">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
