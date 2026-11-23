import { LucideIcon, MapPin, Clock } from 'lucide-react';

interface FacilityCardProps {
  name: string;
  description: string;
  location: string;
  operatingHours?: string;
  icon: LucideIcon;
  image?: string;
}

export default function FacilityCard({ name, description, location, operatingHours, icon: Icon, image }: FacilityCardProps) {
  return (
    <div className="card h-full overflow-hidden flex flex-col group">
      {/* Optional Image Area */}
      {image ? (
        <div className="h-48 relative overflow-hidden bg-gray-100">
          {/* We're using standard img instead of Next Image since these are placeholder URLs */}
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
            <Icon className="w-6 h-6 text-(--color-rw-text)" />
          </div>
        </div>
      ) : (
        <div className="h-32 bg-(--color-rw-primary-pale) relative overflow-hidden flex items-center justify-center border-b border-(--color-rw-border)">
          <Icon className="w-12 h-12 text-(--color-rw-text) opacity-40 group-hover:scale-110 transition-transform duration-500" />
        </div>
      )}

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col grow bg-(--color-rw-primary-pale)">
        {!image && (
          <div className="w-12 h-12 bg-(--color-rw-primary-pale) text-white rounded-xl flex items-center justify-center shadow-md -mt-10 mb-4 relative z-10 border-4 border-(--color-rw-border)">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <h3 className="text-xl font-bold text-(--color-rw-text) mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {name}
        </h3>
        
        <p className="text-sm text-(--color-rw-text) mb-6 grow leading-relaxed">
          {description}
        </p>

        <div className="space-y-2 mt-auto border-t border-(--color-rw-border) pt-4">
          <div className="flex items-start gap-2.5 text-sm text-(--color-rw-text) font-medium">
            <MapPin className="w-4 h-4 mt-0.5 text-(--color-rw-text) shrink-0" />
            <span className="line-clamp-2">{location}</span>
          </div>
          {operatingHours && (
            <div className="flex items-start gap-2.5 text-sm text-(--color-rw-text) font-medium">
              <Clock className="w-4 h-4 mt-0.5 text-(--color-rw-text) shrink-0" />
              <span>{operatingHours}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
