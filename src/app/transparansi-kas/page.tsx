import { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import { getRwCashSummary, getRwCashTransactions } from '@/actions/finance';
import KasClient from './KasClient';

export const metadata: Metadata = {
  title: 'Transparansi Kas RW 05',
  description: 'Laporan keuangan dan buku kas terbuka RW 05 yang akuntabel, transparan, dan dapat diakses seluruh warga.',
};

export const revalidate = 60; // Refresh data setiap 60 detik

export default async function TransparansiKasPage() {
  const [summary, transactions] = await Promise.all([
    getRwCashSummary(),
    getRwCashTransactions(),
  ]);

  return (
    <>
      <PageHeader
        title="Transparansi Kas RW 05"
        subtitle="Laporan keuangan dan arus kas lingkungan secara terbuka, akuntabel, dan dapat dipantau oleh seluruh warga"
        breadcrumbs={[{ label: 'Transparansi Kas' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <KasClient summary={summary} transactions={transactions} />
        </div>
      </div>
    </>
  );
}
