import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PengumumanForm from '../../PengumumanForm';
import { getAnnouncementById } from '@/actions/announcement';

export const metadata: Metadata = {
  title: 'Edit Pengumuman | Admin RW 05',
};

export default async function EditPengumumanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);

  if (!announcement) {
    notFound();
  }

  return <PengumumanForm initialData={announcement} isEdit={true} />;
}
