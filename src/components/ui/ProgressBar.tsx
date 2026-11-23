interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-semibold text-(--color-rw-text)" style={{ fontFamily: 'var(--font-display)' }}>
          Pertanyaan {current} / {total}
        </span>
        <span className="text-xs font-medium text-(--color-rw-text) bg-(--color-rw-primary-pale) px-2.5 py-1 rounded-full border border-(--color-rw-border)">
          {percentage}% Selesai
        </span>
      </div>
      <div className="w-full h-3.5 bg-(--color-rw-primary-pale) rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%`, background: 'var(--color-rw-primary)' }}
        >
          {/* Shine effect */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
