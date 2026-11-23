import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RtForm from '../../RtForm';
import { getNeighborhoodUnitById } from '@/actions/rt';

export const metadata: Metadata = {
  title: 'Edit Data RT | Admin RW 05',
};

export default async function EditRtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rt = await getNeighborhoodUnitById(id);

  if (!rt) {
    notFound();
  }

  return <RtForm initialData={rt} isEdit={true} />;
}
