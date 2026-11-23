import { Metadata } from 'next';
import FasilitasForm from '../FasilitasForm';

export const metadata: Metadata = {
  title: 'Tambah Fasilitas | Admin RW 05',
};

export default function CreateFasilitasPage() {
  return <FasilitasForm />;
}
