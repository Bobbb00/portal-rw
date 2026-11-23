'use client';

import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phone: string;
  message?: string;
}

export default function FloatingWhatsApp({ phone, message = 'Halo, saya ingin bertanya tentang layanan RW 05.' }: FloatingWhatsAppProps) {
  const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
      aria-label="Hubungi via WhatsApp"
    >
      <MessageCircle className="w-5 h-5 animate-pulse-soft" />
      <span className="text-sm font-semibold hidden sm:inline">Chat Admin</span>
    </a>
  );
}
