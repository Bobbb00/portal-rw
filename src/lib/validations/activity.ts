import { z } from 'zod';
import { ContentStatus } from '@prisma/client';

export const activitySchema = z.object({
  title: z.string().min(3, { message: 'Judul kegiatan minimal 3 karakter' }),
  slug: z.string().min(3, { message: 'Slug minimal 3 karakter' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  startDate: z.string().min(1, { message: 'Tanggal mulai wajib diisi' }),
  startTime: z.string().min(1, { message: 'Waktu mulai wajib diisi' }),
  endTime: z.string().min(1, { message: 'Waktu selesai wajib diisi' }),
  location: z.string().min(1, { message: 'Lokasi wajib diisi' }),
  organizer: z.string().min(1, { message: 'Penyelenggara wajib diisi' }),
  participants: z.string().min(1, { message: 'Peserta wajib diisi' }),
  requirements: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
});

export type ActivityFormData = z.infer<typeof activitySchema>;
