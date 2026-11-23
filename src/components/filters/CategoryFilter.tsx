interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
            selected === category
              ? 'bg-(--color-rw-primary) text-white border-(--color-rw-primary) shadow-md'
              : 'bg-white text-(--color-rw-text) border-(--color-rw-border) hover:border-(--color-rw-primary) hover:text-(--color-rw-primary)'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
