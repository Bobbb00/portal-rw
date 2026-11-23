import { Metadata } from 'next';
import DokumenForm from '../DokumenForm';

export const metadata: Metadata = {
  title: 'Tambah Dokumen | Admin RW 05',
};

export default function CreateDokumenPage() {
  return <DokumenForm />;
}
