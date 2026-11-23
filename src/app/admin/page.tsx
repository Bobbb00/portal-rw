import { requireAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { 
  Megaphone, 
  CalendarDays, 
  Users, 
  Building2 
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard Admin',
};

export default async function AdminDashboard() {
  const user = await requireAuth();

  // Fetch some quick stats
  const [
    announcementsCount,
    activitiesCount,
    rtCount,
    facilitiesCount
  ] = await Promise.all([
    prisma.announcement.count(),
    prisma.activity.count(),
    prisma.neighborhoodUnit.count(),
    prisma.facility.count(),
  ]);

  const stats = [
    { label: 'Total Pengumuman', value: announcementsCount, icon: Megaphone, href: '/admin/pengumuman', color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Agenda', value: activitiesCount, icon: CalendarDays, href: '/admin/agenda', color: 'bg-green-50 text-green-700' },
    { label: 'Total RT', value: rtCount, icon: Users, href: '/admin/rt', color: 'bg-purple-50 text-purple-700' },
    { label: 'Total Fasilitas', value: facilitiesCount, icon: Building2, href: '/admin/fasilitas', color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {user.name}!</h1>
          <p className="mt-1 text-gray-600">
            Anda login sebagai <span className="font-semibold text-primary-700">{user.role}</span>. Ini adalah ringkasan data Portal RW saat ini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={idx} 
              href={stat.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="text-center py-12 text-gray-500">
          <p>Belum ada aktivitas terbaru.</p>
        </div>
      </div>
    </div>
  );
}
