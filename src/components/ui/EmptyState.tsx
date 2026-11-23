import { Leaf } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({
  title = 'Tidak Ada Data',
  message = 'Belum ada data yang dapat ditampilkan saat ini.'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-(--color-rw-border) rounded-2xl bg-(--color-rw-primary-pale)">
      <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 animate-float">
        <Leaf className="w-8 h-8 text-(--color-rw-text)" />
      </div>
      <h3 className="text-xl font-bold text-(--color-rw-text) mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      <p className="text-(--color-rw-text) max-w-sm">
        {message}
      </p>
    </div>
  );
}
