import { Metadata } from 'next';
import GaleriForm from '../GaleriForm';

export const metadata: Metadata = {
  title: 'Tambah Galeri | Admin RW 05',
};

export default function CreateGaleriPage() {
  return <GaleriForm />;
}
