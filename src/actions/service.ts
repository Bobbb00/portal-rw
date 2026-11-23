'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { serviceSchema, ServiceFormData } from '@/lib/validations/service';
import { logAudit } from './audit';
import { uploadDocumentFile, deleteImage } from '@/lib/supabase-storage';

export async function getServices() {
  await requireEditor();
  return prisma.service.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getServiceById(id: string) {
  await requireEditor();
  return prisma.service.findUnique({
    where: { id },
  });
}

export async function createService(data: ServiceFormData, fileBase64?: string) {
  try {
    await requireEditor();

    const validatedData = serviceSchema.parse(data);

    let documentUrl = undefined;
    let documentPublicId = undefined;

    if (fileBase64) {
      const uploadResult = await uploadDocumentFile(fileBase64, 'portal-rw/layanan');
      documentUrl = uploadResult.url;
      documentPublicId = uploadResult.publicId;
    }

    const service = await prisma.service.create({
      data: {
        slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        name: validatedData.name,
        description: validatedData.description,
        requirements: validatedData.requirements,
        procedure: validatedData.procedure,
        estimatedTime: validatedData.estimatedTime,
        serviceHours: validatedData.serviceHours,
        contact: validatedData.contact,
        status: validatedData.status,
        documentUrl,
      },
    });

    await logAudit('CREATE_SERVICE', 'Service', service.id, `Created service: ${service.name}`);
    
    revalidatePath('/layanan');
    revalidatePath('/admin/layanan');
    revalidatePath('/');
    
    return { success: true, message: 'Layanan berhasil ditambahkan.' };
  } catch (error: Error | unknown) {
    console.error('Create service error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function updateService(id: string, data: ServiceFormData, fileBase64?: string) {
  try {
    await requireEditor();

    const validatedData = serviceSchema.parse(data);

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Layanan tidak ditemukan.' };

    let documentUrl = existing.documentUrl;

    if (fileBase64) {
      const uploadResult = await uploadDocumentFile(fileBase64, 'portal-rw/layanan');
      documentUrl = uploadResult.url;
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        requirements: validatedData.requirements,
        procedure: validatedData.procedure,
        estimatedTime: validatedData.estimatedTime,
        serviceHours: validatedData.serviceHours,
        contact: validatedData.contact,
        status: validatedData.status,
        documentUrl,
      },
    });

    await logAudit('UPDATE_SERVICE', 'Service', service.id, `Updated service: ${service.name}`);
    
    revalidatePath('/layanan');
    revalidatePath('/admin/layanan');
    revalidatePath('/');
    
    return { success: true, message: 'Layanan berhasil diperbarui.' };
  } catch (error: Error | unknown) {
    console.error('Update service error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function deleteService(id: string) {
  try {
    await requireEditor();
    
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Layanan tidak ditemukan.' };

    await prisma.service.delete({ where: { id } });

    await logAudit('DELETE_SERVICE', 'Service', id, `Deleted service: ${existing.name}`);
    
    revalidatePath('/layanan');
    revalidatePath('/admin/layanan');
    revalidatePath('/');
    
    return { success: true, message: 'Layanan berhasil dihapus.' };
  } catch (error: Error | unknown) {
    console.error('Delete service error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menghapus.' };
  }
}
