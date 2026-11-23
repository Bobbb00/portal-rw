import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-(--color-rw-text) flex-wrap">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-(--color-rw-primary) transition-colors px-2.5 py-1 rounded-md hover:bg-(--color-rw-primary-pale)"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-(--color-rw-primary) transition-colors px-2.5 py-1 rounded-md hover:bg-(--color-rw-primary-pale)"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-(--color-rw-text) px-2.5 py-1">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
