import { z } from 'zod';
import { ContentStatus } from '@prisma/client';

export const gallerySchema = z.object({
  title: z.string().min(3, { message: 'Judul minimal 3 karakter' }),
  description: z.string().optional(),
  date: z.string().optional(),
  category: z.string().default('Umum'),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
  image: z.any().optional(),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;
