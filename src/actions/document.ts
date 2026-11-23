'use server';

import { prisma } from '@/lib/prisma';
import { requireEditor } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { documentSchema, DocumentFormData } from '@/lib/validations/document';
import { logAudit } from './audit';
import { uploadDocumentFile, deleteImage } from '@/lib/supabase-storage';

export async function getDocuments() {
  await requireEditor();
  return prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDocumentById(id: string) {
  await requireEditor();
  return prisma.document.findUnique({
    where: { id },
  });
}

export async function createDocument(data: DocumentFormData, fileBase64?: string) {
  try {
    await requireEditor();

    const validatedData = documentSchema.parse(data);

    let fileUrl = '';
    let filePublicId = undefined;

    if (fileBase64) {
      const uploadResult = await uploadDocumentFile(fileBase64, 'portal-rw/dokumen');
      fileUrl = uploadResult.url;
      filePublicId = uploadResult.publicId;
    } else {
      return { success: false, message: 'File dokumen wajib diupload.' };
    }

    const documentItem = await prisma.document.create({
      data: {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        fileUrl: fileUrl,
        fileType: validatedData.fileType || 'pdf',
        fileSize: validatedData.fileSize || '0 KB',
        filePublicId,
        status: validatedData.status,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
      },
    });

    await logAudit('CREATE_DOCUMENT', 'Document', documentItem.id, `Created document: ${documentItem.name}`);
    
    revalidatePath('/dokumen');
    revalidatePath('/admin/dokumen');
    
    return { success: true, message: 'Dokumen berhasil ditambahkan.' };
  } catch (error: Error | unknown) {
    console.error('Create document error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function updateDocument(id: string, data: DocumentFormData, fileBase64?: string) {
  try {
    await requireEditor();

    const validatedData = documentSchema.parse(data);

    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Dokumen tidak ditemukan.' };

    let fileUrl = existing.fileUrl;
    let filePublicId = existing.filePublicId;

    if (fileBase64) {
      if (existing.filePublicId) {
        await deleteImage(existing.filePublicId, 'raw');
      }
      const uploadResult = await uploadDocumentFile(fileBase64, 'portal-rw/dokumen');
      fileUrl = uploadResult.url;
      filePublicId = uploadResult.publicId;
    }

    let publishedAt = existing.publishedAt;
    if (existing.status !== 'PUBLISHED' && validatedData.status === 'PUBLISHED') {
      publishedAt = new Date();
    } else if (validatedData.status !== 'PUBLISHED') {
      publishedAt = null;
    }

    const documentItem = await prisma.document.update({
      where: { id },
      data: {
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        fileType: validatedData.fileType || existing.fileType,
        fileSize: validatedData.fileSize || existing.fileSize,
        status: validatedData.status,
        publishedAt,
        fileUrl,
        filePublicId,
      },
    });

    await logAudit('UPDATE_DOCUMENT', 'Document', documentItem.id, `Updated document: ${documentItem.name}`);
    
    revalidatePath('/dokumen');
    revalidatePath('/admin/dokumen');
    
    return { success: true, message: 'Dokumen berhasil diperbarui.' };
  } catch (error: Error | unknown) {
    console.error('Update document error:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Terjadi kesalahan.' };
  }
}

export async function deleteDocument(id: string) {
  try {
    await requireEditor();
    
    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Dokumen tidak ditemukan.' };

    if (existing.filePublicId) {
      await deleteImage(existing.filePublicId, 'raw');
    }

    await prisma.document.delete({ where: { id } });

    await logAudit('DELETE_DOCUMENT', 'Document', id, `Deleted document: ${existing.name}`);
    
    revalidatePath('/dokumen');
    revalidatePath('/admin/dokumen');
    
    return { success: true, message: 'Dokumen berhasil dihapus.' };
  } catch (error: Error | unknown) {
    console.error('Delete document error:', error);
    return { success: false, message: 'Terjadi kesalahan saat menghapus.' };
  }
}
