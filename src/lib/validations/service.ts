import { z } from 'zod';
import { ContentStatus } from '@prisma/client';

export const serviceSchema = z.object({
  name: z.string().min(3, { message: 'Nama layanan minimal 3 karakter' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  requirements: z.string().optional(),
  procedure: z.string().optional(),
  estimatedTime: z.string().optional(),
  serviceHours: z.string().optional(),
  contact: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
  file: z.any().optional(), // For optional document upload
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
