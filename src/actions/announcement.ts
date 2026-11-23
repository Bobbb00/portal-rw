'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { announcementSchema, AnnouncementFormData } from '@/lib/validations/announcement';
import { logAudit } from './audit';
import { uploadImage, deleteImage } from '@/lib/supabase-storage';
export async function getAnnouncements() {
  await requireEditor();
  return prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAnnouncementById(id: string) {
  await requireEditor();
  return prisma.announcement.findUnique({
    where: { id },
  });
}

export async function createAnnouncement(data: AnnouncementFormData, imageBase64?: string) {
  try {
    await requireEditor();

    // Validasi data
    const validatedData = announcementSchema.parse(data);

    // Cek slug
    const existingSlug = await prisma.announcement.findUnique({
      where: { slug: validatedData.slug },
    });
    if (existingSlug) {
      return { success: false, message: 'Slug sudah digunakan, silakan gunakan judul lain.' };
    }

    let imageUrl = undefined;
    let imagePublicId = undefined;

    if (imageBase64) {
      const uploadResult = await uploadImage(imageBase64, 'portal-rw/pengumuman');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        category: validatedData.category,
        isImportant: validatedData.isImportant,
        status: validatedData.status,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
        imageUrl,
        imagePublicId,
      },
    });

    await logAudit('CREATE_ANNOUNCEMENT', 'Announcement', announcement.id, `Created announcement: ${announcement.title}`);
    
    revalidatePath('/pengumuman');
    revalidatePath('/admin/pengumuman');
    revalidatePath('/');
    
    return { success: true, message: 'Pengumuman berhasil ditambahkan.' };
  } catch (error: Error | unknown) {
    console.error('Create announcement error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function updateAnnouncement(id: string, data: AnnouncementFormData, imageBase64?: string) {
  try {
    await requireEditor();

    // Validasi data
    const validatedData = announcementSchema.parse(data);

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Pengumuman tidak ditemukan.' };

    if (existing.slug !== validatedData.slug) {
      const existingSlug = await prisma.announcement.findUnique({
        where: { slug: validatedData.slug },
      });
      if (existingSlug) {
        return { success: false, message: 'Slug sudah digunakan.' };
      }
    }

    let imageUrl = existing.imageUrl;
    let imagePublicId = existing.imagePublicId;

    if (imageBase64) {
      // Hapus gambar lama jika ada
      if (existing.imagePublicId) {
        await deleteImage(existing.imagePublicId);
      }
      const uploadResult = await uploadImage(imageBase64, 'portal-rw/pengumuman');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    // Tentukan publishedAt
    let publishedAt = existing.publishedAt;
    if (existing.status !== 'PUBLISHED' && validatedData.status === 'PUBLISHED') {
      publishedAt = new Date();
    } else if (validatedData.status !== 'PUBLISHED') {
      publishedAt = null;
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        category: validatedData.category,
        isImportant: validatedData.isImportant,
        status: validatedData.status,
        publishedAt,
        imageUrl,
        imagePublicId,
      },
    });

    await logAudit('UPDATE_ANNOUNCEMENT', 'Announcement', announcement.id, `Updated announcement: ${announcement.title}`);
    
    revalidatePath('/pengumuman');
    revalidatePath(`/pengumuman/${announcement.slug}`);
    revalidatePath('/admin/pengumuman');
    revalidatePath('/');
    
    return { success: true, message: 'Pengumuman berhasil diperbarui.' };
  } catch (error: Error | unknown) {
    console.error('Update announcement error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await requireEditor();
    
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Pengumuman tidak ditemukan.' };

    if (existing.imagePublicId) {
      await deleteImage(existing.imagePublicId);
    }

    await prisma.announcement.delete({ where: { id } });

    await logAudit('DELETE_ANNOUNCEMENT', 'Announcement', id, `Deleted announcement: ${existing.title}`);
    
    revalidatePath('/pengumuman');
    revalidatePath('/admin/pengumuman');
    revalidatePath('/');
    
    return { success: true, message: 'Pengumuman berhasil dihapus.' };
  } catch (error: Error | unknown) {
    console.error('Delete announcement error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menghapus.' };
  }
}
