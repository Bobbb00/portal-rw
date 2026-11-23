'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { gallerySchema, GalleryFormData } from '@/lib/validations/gallery';
import { logAudit } from './audit';
import { uploadImage, deleteImage } from '@/lib/supabase-storage';

export async function getGalleryItems() {
  await requireEditor();
  return prisma.galleryItem.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getGalleryItemById(id: string) {
  await requireEditor();
  return prisma.galleryItem.findUnique({
    where: { id },
  });
}

export async function createGalleryItem(data: GalleryFormData, imageBase64?: string) {
  try {
    await requireEditor();

    const validatedData = gallerySchema.parse(data);

    if (!imageBase64) {
      return { success: false, message: 'Foto galeri wajib diunggah.' };
    }

    const uploadResult = await uploadImage(imageBase64, 'portal-rw/galeri');

    let parsedDate = new Date();
    if (validatedData.date) {
      parsedDate = new Date(validatedData.date);
    }

    const gallery = await prisma.galleryItem.create({
      data: {
        title: validatedData.title,
        caption: validatedData.description,
        eventDate: parsedDate,
        category: validatedData.category,
        status: validatedData.status,
        imageUrl: uploadResult.url,
        imagePublicId: uploadResult.publicId,
      },
    });

    await logAudit('CREATE_GALLERY', 'Gallery', gallery.id, `Uploaded photo: ${gallery.title}`);
    
    revalidatePath('/galeri');
    revalidatePath('/admin/galeri');
    revalidatePath('/');
    
    return { success: true, message: 'Foto berhasil ditambahkan ke galeri.' };
  } catch (error: Error | unknown) {
    console.error('Create gallery error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function updateGalleryItem(id: string, data: GalleryFormData, imageBase64?: string) {
  try {
    await requireEditor();

    const validatedData = gallerySchema.parse(data);

    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Foto tidak ditemukan.' };

    let imageUrl = existing.imageUrl;
    let imagePublicId = existing.imagePublicId;

    if (imageBase64) {
      if (existing.imagePublicId) {
        await deleteImage(existing.imagePublicId);
      }
      const uploadResult = await uploadImage(imageBase64, 'portal-rw/galeri');
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    let parsedDate = existing.eventDate;
    if (validatedData.date) {
      parsedDate = new Date(validatedData.date);
    }

    const gallery = await prisma.galleryItem.update({
      where: { id },
      data: {
        title: validatedData.title,
        caption: validatedData.description,
        eventDate: parsedDate,
        category: validatedData.category,
        status: validatedData.status,
        imageUrl,
        imagePublicId,
      },
    });

    await logAudit('UPDATE_GALLERY', 'Gallery', gallery.id, `Updated photo: ${gallery.title}`);
    
    revalidatePath('/galeri');
    revalidatePath('/admin/galeri');
    revalidatePath('/');
    
    return { success: true, message: 'Foto galeri berhasil diperbarui.' };
  } catch (error: Error | unknown) {
    console.error('Update gallery error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await requireEditor();
    
    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Foto tidak ditemukan.' };

    if (existing.imagePublicId) {
      await deleteImage(existing.imagePublicId);
    }

    await prisma.galleryItem.delete({ where: { id } });

    await logAudit('DELETE_GALLERY', 'Gallery', id, `Deleted photo: ${existing.title}`);
    
    revalidatePath('/galeri');
    revalidatePath('/admin/galeri');
    revalidatePath('/');
    
    return { success: true, message: 'Foto galeri berhasil dihapus.' };
  } catch (error: Error | unknown) {
    console.error('Delete gallery error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menghapus.' };
  }
}
