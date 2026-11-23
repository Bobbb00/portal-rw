'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { activitySchema, ActivityFormData } from '@/lib/validations/activity';
import { logAudit } from './audit';
export async function getActivities() {
  await requireEditor();
  return prisma.activity.findMany({
    orderBy: { startDate: 'desc' },
  });
}

export async function getActivityById(id: string) {
  await requireEditor();
  return prisma.activity.findUnique({
    where: { id },
  });
}

export async function createActivity(data: ActivityFormData) {
  try {
    await requireEditor();

    const validatedData = activitySchema.parse(data);

    const existingSlug = await prisma.activity.findUnique({
      where: { slug: validatedData.slug },
    });
    
    if (existingSlug) {
      return { success: false, message: 'Slug sudah digunakan, silakan gunakan judul lain.' };
    }

    const activity = await prisma.activity.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.startDate), // assuming single day by default
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        location: validatedData.location,
        organizer: validatedData.organizer,
        participants: validatedData.participants,
        requirements: validatedData.requirements,
        status: validatedData.status,
      },
    });

    await logAudit('CREATE_ACTIVITY', 'Activity', activity.id, `Created activity: ${activity.title}`);
    
    revalidatePath('/agenda');
    revalidatePath('/admin/agenda');
    revalidatePath('/');
    
    return { success: true, message: 'Kegiatan berhasil ditambahkan.' };
  } catch (error: Error | unknown) {
    console.error('Create activity error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function updateActivity(id: string, data: ActivityFormData) {
  try {
    await requireEditor();

    const validatedData = activitySchema.parse(data);

    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Kegiatan tidak ditemukan.' };

    if (existing.slug !== validatedData.slug) {
      const existingSlug = await prisma.activity.findUnique({
        where: { slug: validatedData.slug },
      });
      if (existingSlug) {
        return { success: false, message: 'Slug sudah digunakan.' };
      }
    }

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.startDate),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        location: validatedData.location,
        organizer: validatedData.organizer,
        participants: validatedData.participants,
        requirements: validatedData.requirements,
        status: validatedData.status,
      },
    });

    await logAudit('UPDATE_ACTIVITY', 'Activity', activity.id, `Updated activity: ${activity.title}`);
    
    revalidatePath('/agenda');
    revalidatePath(`/agenda/${activity.slug}`);
    revalidatePath('/admin/agenda');
    revalidatePath('/');
    
    return { success: true, message: 'Kegiatan berhasil diperbarui.' };
  } catch (error: Error | unknown) {
    console.error('Update activity error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function deleteActivity(id: string) {
  try {
    await requireEditor();
    
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Kegiatan tidak ditemukan.' };

    await prisma.activity.delete({ where: { id } });

    await logAudit('DELETE_ACTIVITY', 'Activity', id, `Deleted activity: ${existing.title}`);
    
    revalidatePath('/agenda');
    revalidatePath('/admin/agenda');
    revalidatePath('/');
    
    return { success: true, message: 'Kegiatan berhasil dihapus.' };
  } catch (error: Error | unknown) {
    console.error('Delete activity error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menghapus.' };
  }
}
