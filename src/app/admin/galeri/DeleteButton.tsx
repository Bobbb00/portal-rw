'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteGalleryItem } from '@/actions/gallery';

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm(`Apakah Anda yakin ingin menghapus foto "${title}"?`)) {
      setIsDeleting(true);
      const res = await deleteGalleryItem(id);
      if (!res.success) {
        alert(res.message);
      }
      setIsDeleting(false);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 bg-white text-gray-400 hover:text-red-600 rounded-lg transition-colors shadow-sm disabled:opacity-50"
      title="Hapus"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
