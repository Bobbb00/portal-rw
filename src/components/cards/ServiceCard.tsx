import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export default function ServiceCard({ title, description, icon: Icon, href }: ServiceCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="">
        {/* Background Decorative Circle */}
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-(--color-rw-primary-pale) opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out" />
        
        <div className="w-14 h-14 bg-(--color-rw-primary-pale) text-(--color-rw-text) rounded-2xl flex items-center justify-center mb-5 group-hover:bg-(--color-rw-primary) group-hover:text-white transition-colors duration-300 relative z-10">
          <Icon className="w-7 h-7" />
        </div>
        
        <h3 className="text-xl font-bold text-(--color-rw-text) mb-2 relative z-10" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
        
        <p className="text-(--color-rw-text) text-sm leading-relaxed mb-6 grow relative z-10">
          {description}
        </p>

        <div className="mt-auto flex justify-end relative z-10">
          <div className="w-8 h-8 rounded-full bg-(--color-rw-primary-pale) text-(--color-rw-text) flex items-center justify-center group-hover:bg-(--color-rw-primary) group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
