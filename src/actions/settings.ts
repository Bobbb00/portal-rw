'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { siteSettingsSchema, SiteSettingsFormData } from '@/lib/validations/settings';
import { logAudit } from './audit';

export async function getSiteSettings() {
  // Always get the first record (id: 1)
  return prisma.siteSetting.findUnique({
    where: { id: '1' },
  });
}

export async function updateSiteSettings(data: SiteSettingsFormData) {
  try {
    await requireAdmin();

    const validatedData = siteSettingsSchema.parse(data);

    // Update or create the first record (id: 1)
    const settings = await prisma.siteSetting.upsert({
      where: { id: '1' },
      update: {
        rwName: validatedData.rwName,
        address: `${validatedData.village}, ${validatedData.district}, ${validatedData.city}, ${validatedData.province}`,
        email: validatedData.contactEmail,
        phone: validatedData.contactPhone,
        whatsapp: validatedData.contactPhone,
        instagram: validatedData.socialInstagram,
        // Facebook and Youtube can be stored in description or ignored if not in schema
      },
      create: {
        id: '1', // Ensure ID is 1
        siteName: 'Portal RW',
        rwName: validatedData.rwName,
        address: `${validatedData.village}, ${validatedData.district}, ${validatedData.city}, ${validatedData.province}`,
        email: validatedData.contactEmail,
        phone: validatedData.contactPhone,
        whatsapp: validatedData.contactPhone,
        instagram: validatedData.socialInstagram,
      }
    });

    await logAudit('UPDATE_SETTINGS', 'SiteSetting', settings.id, 'Updated site settings');
    
    revalidatePath('/', 'layout'); // Revalidate everything
    revalidatePath('/admin/pengaturan');
    
    return { success: true, message: 'Pengaturan situs berhasil disimpan.' };
  } catch (error: Error | unknown) {
    console.error('Update settings error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}
