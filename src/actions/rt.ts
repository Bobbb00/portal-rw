'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { rtSchema, RtFormData } from '@/lib/validations/rt';
import { logAudit } from './audit';

export async function getNeighborhoodUnits() {
  await requireEditor();
  return prisma.neighborhoodUnit.findMany({
    orderBy: { number: 'asc' },
  });
}

export async function getNeighborhoodUnitById(id: string) {
  await requireEditor();
  return prisma.neighborhoodUnit.findUnique({
    where: { id },
  });
}

export async function createNeighborhoodUnit(data: RtFormData) {
  try {
    await requireEditor();

    const validatedData = rtSchema.parse(data);

    // Check if RT number already exists
    const existingNumber = await prisma.neighborhoodUnit.findFirst({
      where: { number: validatedData.number },
    });
    
    if (existingNumber) {
      return { success: false, message: 'Nomor RT sudah terdaftar.' };
    }

    const rt = await prisma.neighborhoodUnit.create({
      data: {
        number: validatedData.number,
        leaderName: validatedData.leaderName,
        area: validatedData.area,
        officeLocation: validatedData.officeLocation,
        serviceHours: validatedData.serviceHours,
        officialContact: validatedData.officialContact,
        status: validatedData.status,
      },
    });

    await logAudit('CREATE_RT', 'NeighborhoodUnit', rt.id, `Created RT: ${rt.number}`);
    
    revalidatePath('/rt');
    revalidatePath('/admin/rt');
    
    return { success: true, message: 'Data RT berhasil ditambahkan.' };
  } catch (error: Error | unknown) {
    console.error('Create RT error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function updateNeighborhoodUnit(id: string, data: RtFormData) {
  try {
    await requireEditor();

    const validatedData = rtSchema.parse(data);

    const existing = await prisma.neighborhoodUnit.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Data RT tidak ditemukan.' };

    if (existing.number !== validatedData.number) {
      const existingNumber = await prisma.neighborhoodUnit.findFirst({
        where: { number: validatedData.number },
      });
      if (existingNumber) {
        return { success: false, message: 'Nomor RT sudah terdaftar.' };
      }
    }

    const rt = await prisma.neighborhoodUnit.update({
      where: { id },
      data: {
        number: validatedData.number,
        leaderName: validatedData.leaderName,
        area: validatedData.area,
        officeLocation: validatedData.officeLocation,
        serviceHours: validatedData.serviceHours,
        officialContact: validatedData.officialContact,
        status: validatedData.status,
      },
    });

    await logAudit('UPDATE_RT', 'NeighborhoodUnit', rt.id, `Updated RT: ${rt.number}`);
    
    revalidatePath('/rt');
    revalidatePath('/admin/rt');
    
    return { success: true, message: 'Data RT berhasil diperbarui.' };
  } catch (error: Error | unknown) {
    console.error('Update RT error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function deleteNeighborhoodUnit(id: string) {
  try {
    await requireEditor();
    
    const existing = await prisma.neighborhoodUnit.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Data RT tidak ditemukan.' };

    await prisma.neighborhoodUnit.delete({ where: { id } });

    await logAudit('DELETE_RT', 'NeighborhoodUnit', id, `Deleted RT: ${existing.number}`);
    
    revalidatePath('/rt');
    revalidatePath('/admin/rt');
    
    return { success: true, message: 'Data RT berhasil dihapus.' };
  } catch (error: Error | unknown) {
    console.error('Delete RT error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menghapus.' };
  }
}
