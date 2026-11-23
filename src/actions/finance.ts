'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor, requireAdmin } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { cashTransactionSchema, CashTransactionFormData } from '@/lib/validations/finance';
import { logAudit } from './audit';
import { uploadImage, deleteImage } from '@/lib/supabase-storage';
import { RwCashSummary, RwCashTransactionItem } from '@/types';

// Helper date formatter
const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Safe dynamic accessor for model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRwCashDb = () => (prisma as any).rwCashTransaction;

/**
 * Mengambil ringkasan saldo, pemasukan, dan pengeluaran Kas RW
 */
export async function getRwCashSummary(): Promise<RwCashSummary> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [allTransactions, thisMonthTransactions] = await Promise.all([
    getRwCashDb().findMany({
      select: {
        amount: true,
        type: true,
      },
    }),
    getRwCashDb().findMany({
      where: {
        transactionDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        amount: true,
        type: true,
      },
    }),
  ]);

  let totalIncomeAllTime = 0;
  let totalExpenseAllTime = 0;

  for (const t of allTransactions) {
    if (t.type === 'INCOME') totalIncomeAllTime += t.amount;
    else if (t.type === 'EXPENSE') totalExpenseAllTime += t.amount;
  }

  let totalIncomeThisMonth = 0;
  let totalExpenseThisMonth = 0;

  for (const t of thisMonthTransactions) {
    if (t.type === 'INCOME') totalIncomeThisMonth += t.amount;
    else if (t.type === 'EXPENSE') totalExpenseThisMonth += t.amount;
  }

  return {
    currentBalance: totalIncomeAllTime - totalExpenseAllTime,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    totalIncomeAllTime,
    totalExpenseAllTime,
    transactionCount: allTransactions.length,
  };
}

/**
 * Mengambil daftar transaksi Kas RW (dengan opsi filter)
 */
export async function getRwCashTransactions(options?: {
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  month?: number;
  year?: number;
  limit?: number;
}): Promise<RwCashTransactionItem[]> {
  const where: Record<string, unknown> = {};

  if (options?.type) {
    where.type = options.type;
  }

  if (options?.category && options.category !== 'ALL') {
    where.category = options.category;
  }

  if (options?.year) {
    const year = options.year;
    if (options.month) {
      const month = options.month - 1; // 0-indexed
      where.transactionDate = {
        gte: new Date(year, month, 1),
        lte: new Date(year, month + 1, 0, 23, 59, 59, 999),
      };
    } else {
      where.transactionDate = {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31, 23, 59, 59, 999),
      };
    }
  }

  const transactions = await getRwCashDb().findMany({
    where,
    orderBy: { transactionDate: 'desc' },
    take: options?.limit,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return transactions.map((t: any) => ({
    id: t.id,
    title: t.title,
    description: t.description || undefined,
    amount: t.amount,
    type: t.type as 'INCOME' | 'EXPENSE',
    category: t.category,
    transactionDate: formatDate(t.transactionDate),
    receiptUrl: t.receiptUrl || undefined,
    receiptPublicId: t.receiptPublicId || undefined,
    createdAt: t.createdAt.toISOString(),
  }));
}

/**
 * Mengambil detail transaksi berdasarkan ID
 */
export async function getRwCashTransactionById(id: string) {
  await requireEditor();
  const item = await getRwCashDb().findUnique({
    where: { id },
  });

  if (!item) return null;

  return {
    ...item,
    transactionDate: formatDate(item.transactionDate),
  };
}

/**
 * Membuat transaksi kas baru
 */
export async function createRwCashTransaction(
  data: CashTransactionFormData,
  receiptBase64?: string
) {
  try {
    await requireEditor();

    const validatedData = cashTransactionSchema.parse(data);

    let receiptUrl = undefined;
    let receiptPublicId = undefined;

    if (receiptBase64) {
      const uploadResult = await uploadImage(receiptBase64, 'portal-rw/kas');
      receiptUrl = uploadResult.url;
      receiptPublicId = uploadResult.publicId;
    }

    const transaction = await getRwCashDb().create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        amount: validatedData.amount,
        type: validatedData.type,
        category: validatedData.category,
        transactionDate: new Date(validatedData.transactionDate),
        receiptUrl,
        receiptPublicId,
      },
    });

    await logAudit(
      'CREATE_CASH_TRANSACTION',
      'RwCashTransaction',
      transaction.id,
      `Mencatat transaksi kas RW: ${transaction.title} (${transaction.type} Rp ${transaction.amount.toLocaleString('id-ID')})`
    );

    revalidatePath('/transparansi-kas');
    revalidatePath('/admin/kas');
    revalidatePath('/');

    return { success: true, message: 'Transaksi kas RW berhasil dicatat.' };
  } catch (error) {
    console.error('Create cash transaction error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mencatat transaksi kas.',
    };
  }
}

/**
 * Memperbarui transaksi kas
 */
export async function updateRwCashTransaction(
  id: string,
  data: CashTransactionFormData,
  receiptBase64?: string
) {
  try {
    await requireEditor();

    const validatedData = cashTransactionSchema.parse(data);

    const existing = await getRwCashDb().findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: 'Transaksi tidak ditemukan.' };
    }

    let receiptUrl = existing.receiptUrl;
    let receiptPublicId = existing.receiptPublicId;

    if (receiptBase64) {
      if (existing.receiptPublicId) {
        await deleteImage(existing.receiptPublicId);
      }
      const uploadResult = await uploadImage(receiptBase64, 'portal-rw/kas');
      receiptUrl = uploadResult.url;
      receiptPublicId = uploadResult.publicId;
    }

    const transaction = await getRwCashDb().update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        amount: validatedData.amount,
        type: validatedData.type,
        category: validatedData.category,
        transactionDate: new Date(validatedData.transactionDate),
        receiptUrl,
        receiptPublicId,
      },
    });

    await logAudit(
      'UPDATE_CASH_TRANSACTION',
      'RwCashTransaction',
      transaction.id,
      `Memperbarui transaksi kas RW: ${transaction.title} (${transaction.type} Rp ${transaction.amount.toLocaleString('id-ID')})`
    );

    revalidatePath('/transparansi-kas');
    revalidatePath('/admin/kas');
    revalidatePath('/');

    return { success: true, message: 'Transaksi kas RW berhasil diperbarui.' };
  } catch (error) {
    console.error('Update cash transaction error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal memperbarui transaksi kas.',
    };
  }
}

/**
 * Menghapus transaksi kas (Memerlukan hak akses ADMIN)
 */
export async function deleteRwCashTransaction(id: string) {
  try {
    await requireAdmin();

    const existing = await getRwCashDb().findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: 'Transaksi tidak ditemukan.' };
    }

    if (existing.receiptPublicId) {
      await deleteImage(existing.receiptPublicId);
    }

    await getRwCashDb().delete({
      where: { id },
    });

    await logAudit(
      'DELETE_CASH_TRANSACTION',
      'RwCashTransaction',
      id,
      `Menghapus transaksi kas RW: ${existing.title} (${existing.type} Rp ${existing.amount.toLocaleString('id-ID')})`
    );

    revalidatePath('/transparansi-kas');
    revalidatePath('/admin/kas');
    revalidatePath('/');

    return { success: true, message: 'Transaksi kas RW berhasil dihapus.' };
  } catch (error) {
    console.error('Delete cash transaction error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menghapus transaksi kas.',
    };
  }
}
