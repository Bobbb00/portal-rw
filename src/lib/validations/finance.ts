import { z } from 'zod';

export const CASH_INCOME_CATEGORIES = [
  'Iuran Warga',
  'Donasi & Sukarela',
  'Sewa Fasilitas RW',
  'Bantuan Pemerintah/Kelurahan',
  'Kas Lainnya',
] as const;

export const CASH_EXPENSE_CATEGORIES = [
  'Keamanan & Satpam',
  'Kebersihan & Sampah',
  'Perawatan Sarana & Prasarana',
  'Listrik Pos RW & PJU',
  'Kegiatan Lingkungan & PHBI',
  'Santunan & Sosial Warga',
  'Operasional & ATK RW',
  'Pengeluaran Lainnya',
] as const;

export const ALL_CASH_CATEGORIES = [
  ...CASH_INCOME_CATEGORIES,
  ...CASH_EXPENSE_CATEGORIES,
] as const;

export const cashTransactionSchema = z.object({
  title: z.string().min(3, { message: 'Judul atau keperluan transaksi minimal 3 karakter' }),
  description: z.string().optional(),
  amount: z.coerce.number().positive({ message: 'Nominal transaksi harus lebih dari 0' }),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Tipe transaksi wajib dipilih (Pemasukan / Pengeluaran)' }),
  category: z.string().min(1, { message: 'Kategori transaksi wajib dipilih' }),
  transactionDate: z.string().min(1, { message: 'Tanggal transaksi wajib diisi' }),
  receipt: z.any().optional(),
});

export type CashTransactionFormData = z.infer<typeof cashTransactionSchema>;
