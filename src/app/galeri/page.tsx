import { Metadata } from 'next';
import GaleriClient from './GaleriClient';
import PageHeader from '@/components/layout/PageHeader';
import { getPublishedGalleryItems } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Galeri Kegiatan',
  description: 'Dokumentasi foto dan video kegiatan warga RW 05.',
};

export default async function GaleriPage() {
  const galleryItems = await getPublishedGalleryItems();

  return (
    <>
      <PageHeader 
        title="Galeri Kegiatan"
        subtitle="Merekam momen kebersamaan dan berbagai kegiatan menarik warga RW 05"
        breadcrumbs={[{ label: 'Galeri Kegiatan' }]}
      />
      
      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <GaleriClient initialItems={galleryItems} />
        </div>
      </div>
    </>
  );
}
