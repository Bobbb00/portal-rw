import { Metadata } from 'next';
import AgendaClient from './AgendaClient';
import PageHeader from '@/components/layout/PageHeader';
import { getPublishedActivities } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Agenda Kegiatan',
  description: 'Jadwal dan agenda kegiatan warga di lingkungan RW 05.',
};

export default async function AgendaPage() {
  const activities = await getPublishedActivities();

  return (
    <>
      <PageHeader 
        title="Agenda Kegiatan"
        subtitle="Jadwal lengkap kegiatan gotong royong, pertemuan, dan acara lingkungan RW 05"
        breadcrumbs={[{ label: 'Agenda Kegiatan' }]}
      />
      
      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <AgendaClient initialActivities={activities} />
        </div>
      </div>
    </>
  );
}
