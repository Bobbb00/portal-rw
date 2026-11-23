'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { businessSchema, BusinessFormData } from '@/lib/validations/business';
import { logAudit } from './audit';
import { uploadImage, deleteImage } from '@/lib/supabase-storage';

export async function getBusinesses() {
  await requireEditor();
  return prisma.business.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getBusinessById(id: string) {
  await requireEditor();
  return prisma.business.findUnique({
    where: { id },
  });
}

export async function createBusiness(data: BusinessFormData, imageBase64?: string) {
  try {
    await requireEditor();

    const validatedData = businessSchema.parse(data);

    let imageUrl = undefined;
    let imagePublicId = undefined;

    if (imageBase64) {
      const uploadResult = await uploadImage(imageBase64, 'portal-rw/umkm');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const socialMedia = {
      instagram: validatedData.instagram || '',
      facebook: validatedData.facebook || '',
      tokopedia: validatedData.tokopedia || '',
      shopee: validatedData.shopee || '',
    };

    const business = await prisma.business.create({
      data: {
        name: validatedData.name,
        slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category: validatedData.category,
        description: validatedData.description,
        address: validatedData.address,
        operatingHours: validatedData.operatingHours,
        whatsapp: validatedData.whatsapp,
        socialMedia: JSON.stringify(socialMedia),
        status: validatedData.status,
        imageUrl,
        imagePublicId,
      },
    });

    await logAudit('CREATE_BUSINESS', 'Business', business.id, `Created UMKM: ${business.name}`);
    
    revalidatePath('/umkm');
    revalidatePath('/admin/umkm');
    revalidatePath('/');
    
    return { success: true, message: 'UMKM berhasil ditambahkan.' };
  } catch (error: Error | unknown) {
    console.error('Create business error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function updateBusiness(id: string, data: BusinessFormData, imageBase64?: string) {
  try {
    await requireEditor();

    const validatedData = businessSchema.parse(data);

    const existing = await prisma.business.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'UMKM tidak ditemukan.' };

    let imageUrl = existing.imageUrl;
    let imagePublicId = existing.imagePublicId;

    if (imageBase64) {
      if (existing.imagePublicId) {
        await deleteImage(existing.imagePublicId);
      }
      const uploadResult = await uploadImage(imageBase64, 'portal-rw/umkm');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const socialMedia = {
      instagram: validatedData.instagram || '',
      facebook: validatedData.facebook || '',
      tokopedia: validatedData.tokopedia || '',
      shopee: validatedData.shopee || '',
    };

    const business = await prisma.business.update({
      where: { id },
      data: {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        address: validatedData.address,
        operatingHours: validatedData.operatingHours,
        whatsapp: validatedData.whatsapp,
        socialMedia: JSON.stringify(socialMedia),
        status: validatedData.status,
        imageUrl,
        imagePublicId,
      },
    });

    await logAudit('UPDATE_BUSINESS', 'Business', business.id, `Updated UMKM: ${business.name}`);
    
    revalidatePath('/umkm');
    revalidatePath('/admin/umkm');
    revalidatePath('/');
    
    return { success: true, message: 'UMKM berhasil diperbarui.' };
  } catch (error: Error | unknown) {
    console.error('Update business error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function deleteBusiness(id: string) {
  try {
    await requireEditor();
    
    const existing = await prisma.business.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'UMKM tidak ditemukan.' };

    if (existing.imagePublicId) {
      await deleteImage(existing.imagePublicId);
    }

    await prisma.business.delete({ where: { id } });

    await logAudit('DELETE_BUSINESS', 'Business', id, `Deleted UMKM: ${existing.name}`);
    
    revalidatePath('/umkm');
    revalidatePath('/admin/umkm');
    revalidatePath('/');
    
    return { success: true, message: 'UMKM berhasil dihapus.' };
  } catch (error: Error | unknown) {
    console.error('Delete business error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menghapus.' };
  }
}
