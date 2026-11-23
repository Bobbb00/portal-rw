import { Metadata } from 'next';
import UMKMClient from './UMKMClient';
import PageHeader from '@/components/layout/PageHeader';
import { getPublishedBusinesses } from '@/lib/data';

export const metadata: Metadata = {
  title: 'UMKM Warga',
  description: 'Direktori Usaha Mikro Kecil dan Menengah milik warga RW 05.',
};

export default async function UmkmPage() {
  const umkmItems = await getPublishedBusinesses();

  return (
    <>
      <PageHeader 
        title="Katalog UMKM Warga"
        subtitle="Dari tetangga untuk tetangga. Mari dukung dan majukan usaha lokal di lingkungan RW 05"
        breadcrumbs={[{ label: 'UMKM Warga' }]}
      />
      
      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <UMKMClient initialUmkm={umkmItems} />
        </div>
      </div>
    </>
  );
}
