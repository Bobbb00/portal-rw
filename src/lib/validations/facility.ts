import { z } from 'zod';
import { ContentStatus } from '@prisma/client';

export const facilitySchema = z.object({
  name: z.string().min(3, { message: 'Nama fasilitas minimal 3 karakter' }),
  category: z.string().min(2, { message: 'Kategori wajib diisi' }).default('Umum'),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  location: z.string().min(3, { message: 'Lokasi wajib diisi' }),
  operationalHours: z.string().optional(),
  rules: z.string().optional(),
  contact: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
  image: z.any().optional(), // For file upload in form data
});

export type FacilityFormData = z.infer<typeof facilitySchema>;
