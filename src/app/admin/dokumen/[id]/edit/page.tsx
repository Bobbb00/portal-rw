import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DokumenForm from '../../DokumenForm';
import { getDocumentById } from '@/actions/document';

export const metadata: Metadata = {
  title: 'Edit Dokumen | Admin RW 05',
};

export default async function EditDokumenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return <DokumenForm initialData={document} isEdit={true} />;
}
