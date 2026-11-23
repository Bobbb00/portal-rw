import { z } from 'zod';
import { ContentStatus } from '@prisma/client';

const ANNOUNCEMENT_CATEGORIES = ['Umum', 'Keamanan', 'Kebersihan', 'Kesehatan', 'Pelayanan', 'Kegiatan', 'Darurat'] as const;

export const announcementSchema = z.object({
  title: z.string().min(3, { message: 'Judul minimal 3 karakter' }),
  slug: z.string().min(3, { message: 'Slug minimal 3 karakter' }),
  excerpt: z.string().optional(),
  content: z.string().min(10, { message: 'Konten minimal 10 karakter' }),
  category: z.enum(ANNOUNCEMENT_CATEGORIES, {
    message: 'Kategori wajib dipilih',
  }),
  isImportant: z.boolean().default(false),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
  image: z.any().optional(), // For file upload in form data
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;
