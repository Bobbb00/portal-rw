import { Metadata } from 'next';
import RtForm from '../RtForm';

export const metadata: Metadata = {
  title: 'Tambah Data RT | Admin RW 05',
};

export default function CreateRtPage() {
  return <RtForm />;
}
