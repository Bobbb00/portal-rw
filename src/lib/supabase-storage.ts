import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_DOC_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};
const MAX_DOC_SIZE = 15 * 1024 * 1024; // 15 MB

/**
 * Uploads a base64 image or a file path to Supabase Storage.
 * @param base64Data - base64 string
 * @param folder - destination folder in Supabase Bucket
 * @returns object containing public_id and secure_url
 */
export async function uploadImage(base64Data: string, folder: string = 'portal-rw') {
  try {
    // Determine mime type and clean base64 data
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'image/jpeg';
    let base64String = base64Data;
    
    if (matches && matches.length === 3) {
      mimeType = matches[1].toLowerCase();
      base64String = matches[2];
    }

    const extension = ALLOWED_IMAGE_TYPES[mimeType];
    if (!extension) {
      throw new Error(`Format gambar '${mimeType}' tidak didukung. Harap gunakan format JPG, PNG, WEBP, atau GIF.`);
    }

    const buffer = Buffer.from(base64String, 'base64');

    if (buffer.length > MAX_IMAGE_SIZE) {
      throw new Error(`Ukuran gambar terlalu besar (${(buffer.length / (1024 * 1024)).toFixed(2)} MB). Maksimal ukuran yang diizinkan adalah 5 MB.`);
    }
    
    // Generate a unique filename
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    
    const { data, error } = await supabase.storage
      .from('portal-rw')
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('portal-rw')
      .getPublicUrl(data.path);

    return {
      publicId: data.path, // This maps to publicId from cloudinary
      url: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Gagal mengupload gambar.');
  }
}

/**
 * Deletes an image from Supabase Storage by its publicId (path).
 * @param path - The path of the image in the bucket
 */
export async function deleteImage(path: string, resourceType: 'image' | 'raw' | 'video' = 'image') {
  try {
    if (!path) return;
    
    const { error } = await supabase.storage
      .from('portal-rw')
      .remove([path]);
      
    if (error) {
      console.error('Supabase delete error:', error);
    }
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    // Kita tidak membuang error agar jika gagal menghapus di storage, 
    // operasi database tetap bisa berjalan atau setidaknya tidak merusak UX.
  }
}

/**
 * Uploads a base64 raw file (e.g. PDF, Word) to Supabase Storage.
 * @param base64Data - base64 string
 * @param folder - destination folder
 * @returns object containing public_id and secure_url
 */
export async function uploadDocumentFile(base64Data: string, folder: string = 'portal-rw/dokumen') {
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'application/pdf';
    let base64String = base64Data;
    let extension = 'pdf';
    
    if (matches && matches.length === 3) {
      mimeType = matches[1].toLowerCase();
      base64String = matches[2];
      
      // Determine extension from allowed document mime types
      if (ALLOWED_DOC_TYPES[mimeType]) {
        extension = ALLOWED_DOC_TYPES[mimeType];
      } else if (mimeType.includes('pdf')) {
        extension = 'pdf';
      } else if (mimeType.includes('word')) {
        extension = 'docx';
      } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
        extension = 'xlsx';
      } else {
        throw new Error(`Format dokumen '${mimeType}' tidak didukung. Harap gunakan PDF, Word, atau Excel.`);
      }
    }

    const buffer = Buffer.from(base64String, 'base64');

    if (buffer.length > MAX_DOC_SIZE) {
      throw new Error(`Ukuran dokumen terlalu besar (${(buffer.length / (1024 * 1024)).toFixed(2)} MB). Maksimal ukuran yang diizinkan adalah 15 MB.`);
    }

    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    
    const { data, error } = await supabase.storage
      .from('portal-rw')
      .upload(filename, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error('Supabase document upload error:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('portal-rw')
      .getPublicUrl(data.path);

    return {
      publicId: data.path,
      url: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error('Error uploading document to Supabase:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Gagal mengupload dokumen.');
  }
}
