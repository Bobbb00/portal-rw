import { z } from 'zod';
import { ContentStatus } from '@prisma/client';
import { BusinessCategory } from '@/types';

const BUSINESS_CATEGORIES = ['Makanan', 'Minuman', 'Jasa', 'Kerajinan', 'Fashion', 'Kebutuhan Rumah Tangga'] as const;

export const businessSchema = z.object({
  name: z.string().min(3, { message: 'Nama UMKM minimal 3 karakter' }),
  category: z.enum(BUSINESS_CATEGORIES, {
    message: 'Kategori wajib dipilih',
  }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  address: z.string().min(5, { message: 'Alamat minimal 5 karakter' }),
  operatingHours: z.string().min(1, { message: 'Jam operasional wajib diisi' }),
  whatsapp: z.string().min(10, { message: 'Nomor WhatsApp tidak valid' }),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tokopedia: z.string().optional(),
  shopee: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
});

export type BusinessFormData = z.infer<typeof businessSchema>;
