'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteActivity } from '@/actions/activity';

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (confirm(`Apakah Anda yakin ingin menghapus agenda "${title}"?`)) {
      setIsDeleting(true);
      const res = await deleteActivity(id);
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
      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
