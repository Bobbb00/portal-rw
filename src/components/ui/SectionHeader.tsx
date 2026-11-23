interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = false }: SectionHeaderProps) {
  return (
    <div className={`mb-10 sm:mb-14 ${centered ? 'text-center max-w-2xl mx-auto' : ''}`}>
      <div className={`flex items-center gap-4 mb-4 ${centered ? 'justify-center' : ''}`}>
        {!centered && <div className="w-10 h-1.5 bg-(--color-rw-primary-pale) rounded-full" />}
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-(--color-rw-text)"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
        {centered && <div className="hidden sm:block w-10 h-1.5 bg-(--color-rw-primary-pale) rounded-full" />}
      </div>

      {subtitle && (
        <p className="text-(--color-rw-text) text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
