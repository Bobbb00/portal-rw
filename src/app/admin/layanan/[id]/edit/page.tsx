import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LayananForm from '../../LayananForm';
import { getServiceById } from '@/actions/service';

export const metadata: Metadata = {
  title: 'Edit Layanan | Admin RW 05',
};

export default async function EditLayananPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return <LayananForm initialData={service} isEdit={true} />;
}
