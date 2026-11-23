'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Megaphone, 
  CalendarDays, 
  Users, 
  FileText, 
  Building2, 
  Store,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  TreePine,
  Settings,
  Wallet,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/kas', label: 'Kas RW', icon: Wallet },
  { href: '/admin/pengumuman', label: 'Pengumuman', icon: Megaphone },
  { href: '/admin/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/admin/rt', label: 'Data RT', icon: Users },
  { href: '/admin/layanan', label: 'Layanan', icon: FileText },
  { href: '/admin/fasilitas', label: 'Fasilitas', icon: Building2 },
  { href: '/admin/umkm', label: 'UMKM', icon: Store },
  { href: '/admin/galeri', label: 'Galeri', icon: ImageIcon },
  { href: '/admin/dokumen', label: 'Dokumen', icon: FileText },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // If we are on the login page, don't show the dashboard layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:shrink-0 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
          <Link href="/admin" className="flex items-center gap-2 text-primary-700 font-bold">
            <TreePine className="w-6 h-6" />
            <span>Admin Portal RW</span>
          </Link>
          <button 
            className="ml-auto lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-700' : 'text-gray-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex justify-end">
            <Link 
              href="/" 
              target="_blank"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              Lihat Website ↗
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
