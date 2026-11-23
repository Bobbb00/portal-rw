import { Metadata } from 'next';
import LayananForm from '../LayananForm';

export const metadata: Metadata = {
  title: 'Tambah Layanan | Admin RW 05',
};

export default function CreateLayananPage() {
  return <LayananForm />;
}
