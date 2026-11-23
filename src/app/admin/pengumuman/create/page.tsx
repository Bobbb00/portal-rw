import { Metadata } from 'next';
import PengumumanForm from '../PengumumanForm';

export const metadata: Metadata = {
  title: 'Tambah Pengumuman | Admin RW 05',
};

export default function CreatePengumumanPage() {
  return <PengumumanForm />;
}
