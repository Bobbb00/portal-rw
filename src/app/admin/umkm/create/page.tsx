import { Metadata } from 'next';
import UmkmForm from '../UmkmForm';

export const metadata: Metadata = {
  title: 'Tambah UMKM | Admin RW 05',
};

export default function CreateUmkmPage() {
  return <UmkmForm />;
}
