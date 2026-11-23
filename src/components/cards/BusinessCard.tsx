import { Phone, MapPin, MessageCircle } from "lucide-react";
import { generatePlaceholderImage } from "@/lib/utils";
import { Business } from "@/types";
import Image from "next/image";

export default function BusinessCard({ item }: { item: Business }) {
  const imageUrl =
    item.image || generatePlaceholderImage(600, 400, item.name, "#174b3a");
  const whatsappUrl = item.whatsapp
    ? `https://wa.me/${item.whatsapp.replace(/\D/g, "")}`
    : "#";

  return (
    <div className="">
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-(--color-rw-text) text-xs font-bold rounded-full shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col grow">
        <h3
          className="text-xl font-bold text-(--color-rw-text) mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item.name}
        </h3>
        <p className="text-sm text-(--color-rw-text) mb-6 grow leading-relaxed line-clamp-3">
          {item.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-start gap-2.5 text-sm text-(--color-rw-text)">
            <MapPin className="w-4 h-4 mt-0.5 text-(--color-rw-text) shrink-0" />
            <span className="line-clamp-1">{item.address}</span>
          </div>
          {item.whatsapp && (
            <div className="flex items-start gap-2.5 text-sm text-(--color-rw-text)">
              <Phone className="w-4 h-4 mt-0.5 text-(--color-rw-text) shrink-0" />
              <span>{item.whatsapp}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-(--color-rw-border)">
          {item.whatsapp ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp
            </a>
          ) : (
            <div className="w-full text-center px-4 py-2.5 bg-(--color-rw-primary-pale) text-(--color-rw-text) text-sm font-medium rounded-xl">
              WhatsApp tidak tersedia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
