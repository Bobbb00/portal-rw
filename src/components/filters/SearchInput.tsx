import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Cari...' }: SearchInputProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-(--color-rw-text) group-focus-within:text-(--color-rw-primary) transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-11 pr-10 py-3.5 bg-(--color-rw-primary-pale) border-2 border-(--color-rw-border) rounded-2xl text-(--color-rw-text) placeholder-(--color-rw-muted) focus:outline-none focus:border-(--color-rw-border) focus:ring-4 focus:ring-(--color-rw-primary-light) transition-all duration-200"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-(--color-rw-text) hover:text-(--color-rw-primary) transition-colors"
          aria-label="Hapus pencarian"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
