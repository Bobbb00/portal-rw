import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Edit, Search, Users } from 'lucide-react';
import { getNeighborhoodUnits } from '@/actions/rt';
import { getStatusColor } from '@/lib/utils';
import DeleteButton from './DeleteButton';

export const metadata: Metadata = {
  title: 'Kelola Data RT | Admin RW 05',
};

export default async function AdminRtPage() {
  const rts = await getNeighborhoodUnits();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Data RT</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola informasi kepengurusan setiap Rukun Tetangga (RT).</p>
        </div>
        <Link href="/admin/rt/create" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah RT
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari RT..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Nomor RT</th>
                <th className="px-6 py-4 font-semibold">Ketua RT</th>
                <th className="px-6 py-4 font-semibold">Kontak & Lokasi</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {rts.length > 0 ? (
                rts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="font-semibold text-gray-900">RT {item.number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.leaderName}</div>
                      <div className="text-gray-500 text-xs mt-1">Ketua RT</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{item.officialContact || '-'}</div>
                      <div className="text-gray-500 text-xs mt-1 line-clamp-1">{item.officeLocation || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/rt/${item.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton id={item.id} number={item.number} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data RT.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
