import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UmkmForm from '../../UmkmForm';
import { getBusinessById } from '@/actions/business';

export const metadata: Metadata = {
  title: 'Edit UMKM | Admin RW 05',
};

export default async function EditUmkmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  return <UmkmForm initialData={business} isEdit={true} />;
}
