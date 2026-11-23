import { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getSiteSettings } from '@/lib/data';
import { rwInfo } from '@/data/contacts';

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Informasi kontak dan layanan pengaduan RW 05.',
};

export default async function KontakPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader 
        title="Hubungi Kami"
        subtitle="Kami siap melayani kebutuhan informasi dan administrasi warga RW 05"
        breadcrumbs={[{ label: 'Kontak' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Info Kontak */}
            <div>
              <ScrollReveal>
                <SectionHeader 
                  title="Informasi Kontak Sekretariat" 
                  subtitle="Silakan kunjungi atau hubungi kami melalui saluran resmi di bawah ini."
                />
              </ScrollReveal>

              <div className="space-y-6 mt-8">
                <ScrollReveal delay={100}>
                  <div className="card-padded bg-white flex items-start gap-5 group hover:border-(--color-rw-primary-light)">
                    <div className="w-14 h-14 bg-(--color-rw-primary-pale) rounded-xl flex items-center justify-center shrink-0 text-(--color-rw-primary) group-hover:bg-(--color-rw-primary) group-hover:text-white transition-colors duration-300">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-(--color-rw-text) mb-1" style={{ fontFamily: 'var(--font-display)' }}>Alamat Sekretariat</h3>
                      <p className="text-(--color-rw-muted) leading-relaxed">
                        {rwInfo.fullAddress}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="card-padded bg-white flex items-start gap-5 group hover:border-(--color-rw-primary-light)">
                    <div className="w-14 h-14 bg-(--color-rw-primary-pale) rounded-xl flex items-center justify-center shrink-0 text-(--color-rw-primary) group-hover:bg-(--color-rw-primary) group-hover:text-white transition-colors duration-300">
                      <Phone className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-(--color-rw-text) mb-1" style={{ fontFamily: 'var(--font-display)' }}>Telepon / WhatsApp</h3>
                      <p className="text-(--color-rw-muted) mb-2">
                        {settings?.whatsapp || rwInfo.phone}
                      </p>
                      <a href={`https://wa.me/${(settings?.whatsapp || rwInfo.phone).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-(--color-rw-accent) hover:text-(--color-rw-accent-dark) transition-colors">
                        Chat Admin Sekarang &rarr;
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                  <div className="card-padded bg-white flex items-start gap-5 group hover:border-(--color-rw-primary-light)">
                    <div className="w-14 h-14 bg-(--color-rw-primary-pale) rounded-xl flex items-center justify-center shrink-0 text-(--color-rw-primary) group-hover:bg-(--color-rw-primary) group-hover:text-white transition-colors duration-300">
                      <Mail className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-(--color-rw-text) mb-1" style={{ fontFamily: 'var(--font-display)' }}>Email Resmi</h3>
                      <p className="text-(--color-rw-muted) mb-2">
                        {rwInfo.email}
                      </p>
                      <a href={`mailto:${rwInfo.email}`} className="text-sm font-semibold text-(--color-rw-accent) hover:text-(--color-rw-accent-dark) transition-colors">
                        Kirim Email &rarr;
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Jadwal & Peta */}
            <div>
              <ScrollReveal direction="right">
                <div className="card-padded bg-(--color-rw-primary-pale) border-(--color-rw-primary-lighter) mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-(--color-rw-primary)">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-(--color-rw-primary)" style={{ fontFamily: 'var(--font-display)' }}>Jam Operasional</h2>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center py-2 border-b border-(--color-rw-border)">
                      <span className="font-medium text-(--color-rw-text)">Senin - Kamis</span>
                      <span className="text-(--color-rw-muted)">09.00 - 15.00 WIB</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-(--color-rw-border)">
                      <span className="font-medium text-(--color-rw-text)">Jumat</span>
                      <span className="text-(--color-rw-muted)">09.00 - 11.30 WIB</span>
                    </li>
                    <li className="flex justify-between items-center py-2">
                      <span className="font-medium text-red-500">Sabtu, Minggu, Libur Nasional</span>
                      <span className="text-red-500 font-semibold">Tutup</span>
                    </li>
                  </ul>
                  <p className="text-xs text-(--color-rw-muted) mt-6 italic">
                    *Untuk keadaan darurat di luar jam operasional, silakan hubungi pengurus RT setempat.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={200}>
                {/* Peta Placeholder */}
                <div className="card rounded-3xl overflow-hidden h-64 bg-gray-200 relative group cursor-pointer border-(--color-rw-border)">
                  <img src="https://placehold.co/800x400/e2e8f0/64748b?text=Peta+Lokasi+RW+05" alt="Peta Lokasi" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-6 py-3 bg-white text-(--color-rw-primary) font-bold rounded-full shadow-lg">
                      Buka di Google Maps
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
