import { Metadata } from 'next';
import DokumenClient from './DokumenClient';
import PageHeader from '@/components/layout/PageHeader';
import { getPublishedDocuments } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Dokumen Publik',
  description: 'Unduh dokumen peraturan, form administrasi, dan laporan RW 05.',
};

export default async function DokumenPage() {
  const documents = await getPublishedDocuments();

  return (
    <>
      <PageHeader 
        title="Pusat Unduhan Dokumen"
        subtitle="Akses cepat ke berbagai form administrasi, peraturan lingkungan, dan laporan kegiatan warga"
        breadcrumbs={[{ label: 'Dokumen' }]}
      />
      
      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <DokumenClient initialDocuments={documents} />
        </div>
      </div>
    </>
  );
}
