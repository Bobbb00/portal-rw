import { Metadata } from 'next';
import PengumumanClient from './PengumumanClient';
import PageHeader from '@/components/layout/PageHeader';
import { getPublishedAnnouncements } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Pengumuman',
  description: 'Informasi dan pengumuman terbaru untuk warga RW 05.',
};

export default async function PengumumanPage() {
  const announcements = await getPublishedAnnouncements();

  return (
    <>
      <PageHeader 
        title="Pengumuman"
        subtitle="Kabar, informasi, dan pengumuman resmi terbaru untuk warga RW 05"
        breadcrumbs={[{ label: 'Pengumuman' }]}
      />
      
      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <PengumumanClient initialAnnouncements={announcements} />
        </div>
      </div>
    </>
  );
}
