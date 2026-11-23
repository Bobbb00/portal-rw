import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FasilitasForm from '../../FasilitasForm';
import { getFacilityById } from '@/actions/facility';

export const metadata: Metadata = {
  title: 'Edit Fasilitas | Admin RW 05',
};

export default async function EditFasilitasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facility = await getFacilityById(id);

  if (!facility) {
    notFound();
  }

  return <FasilitasForm initialData={facility} isEdit={true} />;
}
