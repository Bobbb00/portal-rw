'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Receipt, 
  Printer, 
  X, 
  CheckCircle2, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { RwCashSummary, RwCashTransactionItem } from '@/types';
import { CASH_INCOME_CATEGORIES, CASH_EXPENSE_CATEGORIES } from '@/lib/validations/finance';
import KasPieChart from '@/components/ui/KasPieChart';

interface KasClientProps {
  summary: RwCashSummary;
  transactions: RwCashTransactionItem[];
}

export default function KasClient({ summary, transactions }: KasClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [zoomReceiptUrl, setZoomReceiptUrl] = useState<string | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12">
      {/* 1. Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-linear-to-br from-white to-emerald-50/50 border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/80 text-(--color-rw-primary) text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saldo Kas Aktif
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                {formatRupiah(summary.currentBalance)}
              </h2>
              <p className="text-xs text-gray-500 mt-2">
                Saldo kas bersih RW 05 per hari ini
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-(--color-rw-primary) flex items-center justify-center text-white shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-linear-to-br from-white to-green-50/50 border border-green-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100/80 text-green-800 text-xs font-bold uppercase tracking-wider mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" /> Pemasukan Bulan Ini
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mt-1">
                +{formatRupiah(summary.totalIncomeThisMonth)}
              </h2>
              <p className="text-xs text-gray-500 mt-2">
                Iuran warga & donasi yang terverifikasi
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-700">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-linear-to-br from-white to-red-50/50 border border-red-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100/80 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
                <TrendingDown className="w-3.5 h-3.5 text-red-600" /> Pengeluaran Bulan Ini
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                -{formatRupiah(summary.totalExpenseThisMonth)}
              </h2>
              <p className="text-xs text-gray-500 mt-2">
                Gaji satpam, kebersihan, & operasional
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Komitmen Akuntabilitas Banner */}
      <div className="rounded-2xl p-5 bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h4 className="font-bold text-base">Prinsip Transparansi & Akuntabilitas Kas RW</h4>
            <p className="text-xs text-emerald-200 mt-0.5">
              Seluruh transaksi kas diinput oleh Bendahara RW dengan menyertakan bukti kuitansi nota fisik.
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Cetak / Simpan Laporan
        </button>
      </div>

      {/* 3. Diagram Alokasi Dana (Pie / Donut Chart) */}
      <KasPieChart transactions={transactions} />

      {/* 4. Tabel Buku Kas Terbuka */}
      <div className="card bg-white border border-gray-100 shadow-sm overflow-hidden">
        {/* Header & Filter Controls */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/60 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi, pos biaya, atau rincian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary) focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Jenis */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTypeFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  typeFilter === 'ALL'
                    ? 'bg-(--color-rw-primary) text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('INCOME')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  typeFilter === 'INCOME'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-700'
                }`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('EXPENSE')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  typeFilter === 'EXPENSE'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-700'
                }`}
              >
                Pengeluaran
              </button>
            </div>

            {/* Filter Kategori */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter Kategori Kas"
              className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary) cursor-pointer"
            >
              <option value="ALL">Semua Kategori</option>
              <optgroup label="Pemasukan">
                {CASH_INCOME_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </optgroup>
              <optgroup label="Pengeluaran">
                {CASH_EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold">Jenis / Kategori</th>
                <th className="px-6 py-4 font-bold">Uraian / Keperluan Transaksi</th>
                <th className="px-6 py-4 font-bold text-right">Nominal (Rp)</th>
                <th className="px-6 py-4 font-bold text-center">Bukti Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium text-xs">
                      {new Date(item.transactionDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            item.type === 'INCOME'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                        <span className="text-xs text-gray-600 font-medium">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span
                        className={`text-base font-extrabold ${
                          item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.type === 'INCOME' ? '+' : '-'} {formatRupiah(item.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item.receiptUrl ? (
                        <button
                          type="button"
                          onClick={() => setZoomReceiptUrl(item.receiptUrl || null)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-(--color-rw-primary) bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Bukti Nota
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Tanpa Lampiran</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                    <Info className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-600">Tidak ada transaksi yang cocok dengan filter pencarian.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50/60 border-t border-gray-100 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Menampilkan {filteredTransactions.length} dari total {transactions.length} mutasi kas RW</span>
          <span>Diperbarui secara berkala oleh Bendahara RW 05</span>
        </div>
      </div>

      {/* Modal Zoom Bukti Struk */}
      {zoomReceiptUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomReceiptUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] w-full h-[70vh] bg-gray-900 rounded-2xl overflow-hidden p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomReceiptUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={zoomReceiptUrl}
                alt="Foto Bukti Kuitansi"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
