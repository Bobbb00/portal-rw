'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Trash2, 
  Edit2, 
  Receipt, 
  X, 
  Upload, 
  AlertCircle
} from 'lucide-react';
import { 
  RwCashSummary, 
  RwCashTransactionItem, 
  TransactionType 
} from '@/types';
import { 
  CASH_INCOME_CATEGORIES, 
  CASH_EXPENSE_CATEGORIES 
} from '@/lib/validations/finance';
import KasPieChart from '@/components/ui/KasPieChart';
import { 
  createRwCashTransaction, 
  updateRwCashTransaction, 
  deleteRwCashTransaction 
} from '@/actions/finance';

interface KasManagerProps {
  initialSummary: RwCashSummary;
  initialTransactions: RwCashTransactionItem[];
}

export default function KasManager({ 
  initialSummary, 
  initialTransactions 
}: KasManagerProps) {
  const [summary] = useState<RwCashSummary>(initialSummary);
  const [transactions, setTransactions] = useState<RwCashTransactionItem[]>(initialTransactions);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RwCashTransactionItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('INCOME');
  const [category, setCategory] = useState<string>(CASH_INCOME_CATEGORIES[0]);
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptBase64, setReceiptBase64] = useState<string | undefined>(undefined);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  // Modal zoom bukti kuitansi
  const [zoomReceiptUrl, setZoomReceiptUrl] = useState<string | null>(null);

  // Format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Open modal create
  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setTitle('');
    setDescription('');
    setAmount('');
    setType('INCOME');
    setCategory(CASH_INCOME_CATEGORIES[0]);
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setReceiptBase64(undefined);
    setReceiptPreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal edit
  const handleOpenEdit = (t: RwCashTransactionItem) => {
    setEditingTransaction(t);
    setTitle(t.title);
    setDescription(t.description || '');
    setAmount(t.amount.toString());
    setType(t.type);
    setCategory(t.category);
    setTransactionDate(t.transactionDate);
    setReceiptBase64(undefined);
    setReceiptPreview(t.receiptUrl || null);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setReceiptBase64(base64);
      setReceiptPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // Switch type and auto adjust category
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'INCOME') {
      setCategory(CASH_INCOME_CATEGORIES[0]);
    } else {
      setCategory(CASH_EXPENSE_CATEGORIES[0]);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ''));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Nominal transaksi harus lebih dari 0.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description: description || undefined,
        amount: parsedAmount,
        type,
        category,
        transactionDate,
      };

      if (editingTransaction) {
        const res = await updateRwCashTransaction(editingTransaction.id, payload, receiptBase64);
        if (res.success) {
          setIsModalOpen(false);
          window.location.reload();
        } else {
          setFormError(res.message);
        }
      } else {
        const res = await createRwCashTransaction(payload, receiptBase64);
        if (res.success) {
          setIsModalOpen(false);
          window.location.reload();
        } else {
          setFormError(res.message);
        }
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus transaksi "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    const res = await deleteRwCashTransaction(id);
    if (res.success) {
      setTransactions((prev) => prev.filter((item) => item.id !== id));
      window.location.reload();
    } else {
      alert(res.message);
    }
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-(--color-rw-primary)" />
            Buku Kas RW 05
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pencatatan pemasukan dan pengeluaran dana kas tingkat RW secara transparan dan akuntabel.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Catat Transaksi Baru
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-5 bg-white border border-gray-100 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo Kas RW Saat Ini</p>
              <h3 className={`text-2xl font-bold mt-2 ${summary.currentBalance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                {formatRupiah(summary.currentBalance)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-(--color-rw-primary-pale) flex items-center justify-center text-(--color-rw-primary)">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Total mutasi: {summary.transactionCount} transaksi</p>
        </div>

        <div className="card p-5 bg-white border border-gray-100 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Pemasukan Bulan Ini</p>
              <h3 className="text-2xl font-bold mt-2 text-green-700">
                +{formatRupiah(summary.totalIncomeThisMonth)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Bulan berjalan</p>
        </div>

        <div className="card p-5 bg-white border border-gray-100 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Pengeluaran Bulan Ini</p>
              <h3 className="text-2xl font-bold mt-2 text-red-600">
                -{formatRupiah(summary.totalExpenseThisMonth)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Bulan berjalan</p>
        </div>

        <div className="card p-5 bg-white border border-gray-100 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Kas Masuk (All Time)</p>
              <h3 className="text-2xl font-bold mt-2 text-blue-700">
                {formatRupiah(summary.totalIncomeAllTime)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Total kumulatif kas</p>
        </div>
      </div>

      {/* Visual Pie / Donut Chart */}
      <KasPieChart transactions={transactions} />

      {/* Main Table Card */}
      <div className="card overflow-hidden bg-white border border-gray-100 shadow-xs">
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi, keperluan, kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary) focus:border-transparent transition-shadow"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTypeFilter('ALL')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'ALL' ? 'bg-(--color-rw-primary) text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('INCOME')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'INCOME' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-700'}`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('EXPENSE')}
                className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'EXPENSE' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-red-700'}`}
              >
                Pengeluaran
              </button>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter Kategori"
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary)"
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Jenis & Kategori</th>
                <th className="px-6 py-4 font-semibold">Keperluan / Keterangan</th>
                <th className="px-6 py-4 font-semibold text-right">Nominal</th>
                <th className="px-6 py-4 font-semibold text-center">Bukti Nota</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                      {new Date(item.transactionDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold w-max ${
                            item.type === 'INCOME'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span
                        className={`font-bold ${
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-(--color-rw-primary) bg-(--color-rw-primary-pale) hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Lihat Struk
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Tanpa Foto</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-(--color-rw-primary) hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Transaksi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <p className="font-medium">Belum ada riwayat transaksi kas yang sesuai.</p>
                    <p className="text-xs text-gray-400 mt-1">Gunakan tombol &quot;Catat Transaksi Baru&quot; untuk menambahkan arus kas RW.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {editingTransaction ? 'Edit Transaksi Kas RW' : 'Catat Transaksi Kas RW'}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Pastikan data nominal dan bukti nota diisi dengan akurat.
            </p>

            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipe Transaksi: Income vs Expense */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Jenis Transaksi
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('INCOME')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      type === 'INCOME'
                        ? 'border-green-600 bg-green-50 text-green-700 ring-2 ring-green-600/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('EXPENSE')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      type === 'EXPENSE'
                        ? 'border-red-600 bg-red-50 text-red-700 ring-2 ring-red-600/20'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4" />
                    Pengeluaran
                  </button>
                </div>
              </div>

              {/* Judul Keperluan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Keperluan / Judul Transaksi *
                </label>
                <input
                  type="text"
                  required
                  placeholder={type === 'INCOME' ? 'Contoh: Iuran Warga RW 05 Bulan Oktober' : 'Contoh: Honorarium Satpam RW 05'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary) focus:bg-white"
                />
              </div>

              {/* Kategori & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Kategori *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Kategori Transaksi"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary) focus:bg-white"
                  >
                    {(type === 'INCOME' ? CASH_INCOME_CATEGORIES : CASH_EXPENSE_CATEGORIES).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Tanggal Transaksi *
                  </label>
                  <input
                    type="date"
                    required
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary) focus:bg-white"
                  />
                </div>
              </div>

              {/* Nominal (Rp) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nominal (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary) focus:bg-white"
                  />
                </div>
              </div>

              {/* Deskripsi Tambahan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Catatan / Keterangan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan rincian nota atau nomor kontak terkait..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-(--color-rw-primary) focus:bg-white resize-none"
                />
              </div>

              {/* Upload Bukti Struk/Nota */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Foto Bukti Struk / Kuitansi (Opsional)
                </label>
                <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100/70 transition-colors relative">
                  {receiptPreview ? (
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 border shrink-0">
                        <Image
                          src={receiptPreview}
                          alt="Struk"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="grow text-xs">
                        <p className="font-semibold text-gray-900">Bukti Struk Terlampir</p>
                        <p className="text-gray-500 mt-0.5">Klik ganti jika ingin mengunggah foto lain.</p>
                      </div>
                      <label className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs">
                        Ganti
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-1.5 cursor-pointer py-2">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-xs font-medium text-gray-600">Klik untuk upload foto nota/kuitansi</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WEBP (Maksimal 5MB)</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-(--color-rw-primary) hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : editingTransaction ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                alt="Bukti Kuitansi Penuh"
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
