import { z } from 'zod';

export const siteSettingsSchema = z.object({
  rwName: z.string().min(2, { message: 'Nama RW minimal 2 karakter' }),
  village: z.string().min(2, { message: 'Kelurahan minimal 2 karakter' }),
  district: z.string().min(2, { message: 'Kecamatan minimal 2 karakter' }),
  city: z.string().min(2, { message: 'Kota/Kabupaten minimal 2 karakter' }),
  province: z.string().min(2, { message: 'Provinsi minimal 2 karakter' }),
  contactEmail: z.string().email({ message: 'Email tidak valid' }).optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialYoutube: z.string().optional(),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
