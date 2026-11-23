import { z } from 'zod';
import { ContentStatus } from '@prisma/client';

const DOCUMENT_CATEGORIES = ['Formulir', 'Jadwal', 'Tata Tertib', 'Panduan', 'Laporan', 'Program Kerja'] as const;

export const documentSchema = z.object({
  name: z.string().min(3, { message: 'Nama dokumen minimal 3 karakter' }),
  description: z.string().optional(),
  category: z.enum(DOCUMENT_CATEGORIES, {
    message: 'Kategori wajib dipilih',
  }),
  fileType: z.string().optional(),
  fileSize: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
  file: z.any().optional(), // For file upload in form data
});

export type DocumentFormData = z.infer<typeof documentSchema>;
