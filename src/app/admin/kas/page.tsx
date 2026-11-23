import { Metadata } from 'next';
import { getRwCashSummary, getRwCashTransactions } from '@/actions/finance';
import KasManager from './KasManager';

export const metadata: Metadata = {
  title: 'Kelola Buku Kas RW 05 | Admin Portal RW',
};

export default async function AdminKasPage() {
  const [summary, transactions] = await Promise.all([
    getRwCashSummary(),
    getRwCashTransactions(),
  ]);

  return <KasManager initialSummary={summary} initialTransactions={transactions} />;
}
