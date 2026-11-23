import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GaleriForm from '../../GaleriForm';
import { getGalleryItemById } from '@/actions/gallery';

export const metadata: Metadata = {
  title: 'Edit Galeri | Admin RW 05',
};

export default async function EditGaleriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gallery = await getGalleryItemById(id);

  if (!gallery) {
    notFound();
  }

  return <GaleriForm initialData={gallery} isEdit={true} />;
}
