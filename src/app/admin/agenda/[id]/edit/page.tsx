import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AgendaForm from '../../AgendaForm';
import { getActivityById } from '@/actions/activity';

export const metadata: Metadata = {
  title: 'Edit Agenda | Admin RW 05',
};

export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = await getActivityById(id);

  if (!activity) {
    notFound();
  }

  return <AgendaForm initialData={activity} isEdit={true} />;
}
