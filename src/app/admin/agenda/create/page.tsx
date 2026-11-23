import { Metadata } from 'next';
import AgendaForm from '../AgendaForm';

export const metadata: Metadata = {
  title: 'Tambah Agenda | Admin RW 05',
};

export default function CreateAgendaPage() {
  return <AgendaForm />;
}
