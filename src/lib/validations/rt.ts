import { z } from 'zod';
import { ContentStatus } from '@prisma/client';

export const rtSchema = z.object({
  number: z.string().min(1, { message: 'Nomor RT wajib diisi' }),
  leaderName: z.string().min(3, { message: 'Nama Ketua RT minimal 3 karakter' }),
  area: z.string().optional(),
  officeLocation: z.string().optional(),
  serviceHours: z.string().optional(),
  officialContact: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
});

export type RtFormData = z.infer<typeof rtSchema>;
