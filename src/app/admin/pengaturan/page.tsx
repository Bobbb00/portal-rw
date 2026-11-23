import { Metadata } from 'next';
import SettingsForm from './SettingsForm';
import { getSiteSettings } from '@/actions/settings';

export const metadata: Metadata = {
  title: 'Pengaturan Situs | Admin RW 05',
};

export default async function AdminPengaturanPage() {
  const settings = await getSiteSettings();

  return <SettingsForm initialData={settings} />;
}
