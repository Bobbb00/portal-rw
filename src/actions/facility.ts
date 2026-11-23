'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { facilitySchema, FacilityFormData } from '@/lib/validations/facility';
import { logAudit } from './audit';
import { uploadImage, deleteImage } from '@/lib/supabase-storage';

export async function getFacilities() {
  await requireEditor();
  return prisma.facility.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getFacilityById(id: string) {
  await requireEditor();
  return prisma.facility.findUnique({
    where: { id },
  });
}

export async function createFacility(data: FacilityFormData, imageBase64?: string) {
  try {
    await requireEditor();

    const validatedData = facilitySchema.parse(data);

    let imageUrl = undefined;
    let imagePublicId = undefined;

    if (imageBase64) {
      const uploadResult = await uploadImage(imageBase64, 'portal-rw/fasilitas');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const facility = await prisma.facility.create({
      data: {
        slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        location: validatedData.location,
        operatingHours: validatedData.operationalHours,
        rules: validatedData.rules,
        status: validatedData.status,
        imageUrl,
        imagePublicId,
      },
    });

    await logAudit('CREATE_FACILITY', 'Facility', facility.id, `Created facility: ${facility.name}`);
    
    revalidatePath('/fasilitas');
    revalidatePath('/admin/fasilitas');
    revalidatePath('/');
    
    return { success: true, message: 'Fasilitas berhasil ditambahkan.' };
  } catch (error: Error | unknown) {
    console.error('Create facility error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function updateFacility(id: string, data: FacilityFormData, imageBase64?: string) {
  try {
    await requireEditor();

    const validatedData = facilitySchema.parse(data);

    const existing = await prisma.facility.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Fasilitas tidak ditemukan.' };

    let imageUrl = existing.imageUrl;
    let imagePublicId = existing.imagePublicId;

    if (imageBase64) {
      if (existing.imagePublicId) {
        await deleteImage(existing.imagePublicId);
      }
      const uploadResult = await uploadImage(imageBase64, 'portal-rw/fasilitas');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const facility = await prisma.facility.update({
      where: { id },
      data: {
        slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        location: validatedData.location,
        operatingHours: validatedData.operationalHours,
        rules: validatedData.rules,
        status: validatedData.status,
        imageUrl,
        imagePublicId,
      },
    });

    await logAudit('UPDATE_FACILITY', 'Facility', facility.id, `Updated facility: ${facility.name}`);
    
    revalidatePath('/fasilitas');
    revalidatePath('/admin/fasilitas');
    revalidatePath('/');
    
    return { success: true, message: 'Fasilitas berhasil diperbarui.' };
  } catch (error: Error | unknown) {
    console.error('Update facility error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function deleteFacility(id: string) {
  try {
    await requireEditor();
    
    const existing = await prisma.facility.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Fasilitas tidak ditemukan.' };

    if (existing.imagePublicId) {
      await deleteImage(existing.imagePublicId);
    }

    await prisma.facility.delete({ where: { id } });

    await logAudit('DELETE_FACILITY', 'Facility', id, `Deleted facility: ${existing.name}`);
    
    revalidatePath('/fasilitas');
    revalidatePath('/admin/fasilitas');
    revalidatePath('/');
    
    return { success: true, message: 'Fasilitas berhasil dihapus.' };
  } catch (error: Error | unknown) {
    console.error('Delete facility error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menghapus.' };
  }
}
