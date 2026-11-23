import { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import LayananClient from './LayananClient';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getPublishedServices } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Layanan Warga',
  description: 'Informasi pengurusan administrasi dan layanan untuk warga RW 05.',
};

export default async function LayananPage() {
  const services = await getPublishedServices();

  return (
    <>
      <PageHeader 
        title="Layanan Warga"
        subtitle="Panduan dan informasi lengkap untuk pengurusan berbagai administrasi kependudukan di RW 05"
        breadcrumbs={[{ label: 'Layanan Warga' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          {/* Alur Pelayanan (Visual Info) */}
          <ScrollReveal>
            <div className="mb-16">
              <SectionHeader 
                title="Alur Pelayanan Administrasi" 
                subtitle="Langkah-langkah umum pengurusan dokumen di tingkat RT dan RW"
                centered
              />
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
                {/* Step 1 */}
                <div className="text-center relative group">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-(--color-rw-primary) flex items-center justify-center mx-auto mb-4 text-xl font-bold text-(--color-rw-primary) shadow-sm group-hover:bg-(--color-rw-primary) group-hover:text-white transition-colors duration-300">
                    1
                  </div>
                  <h3 className="font-bold text-(--color-rw-text) mb-2" style={{ fontFamily: 'var(--font-display)' }}>Siapkan Berkas</h3>
                  <p className="text-sm text-(--color-rw-muted) px-4">Lengkapi fotokopi KTP, KK, dan berkas pendukung lainnya.</p>
                  <div className="hidden md:block absolute top-8 -translate-y-1/2 left-[50%] w-[calc(100%+1.5rem)] border-t-[3px] border-dashed border-gray-300 -z-10"></div>
                </div>
                {/* Step 2 */}
                <div className="text-center relative group">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-(--color-rw-primary) flex items-center justify-center mx-auto mb-4 text-xl font-bold text-(--color-rw-primary) shadow-sm group-hover:bg-(--color-rw-primary) group-hover:text-white transition-colors duration-300">
                    2
                  </div>
                  <h3 className="font-bold text-(--color-rw-text) mb-2" style={{ fontFamily: 'var(--font-display)' }}>Pengantar RT</h3>
                  <p className="text-sm text-(--color-rw-muted) px-4">Minta surat pengantar yang ditandatangani oleh Ketua RT.</p>
                  <div className="hidden md:block absolute top-8 -translate-y-1/2 left-[50%] w-[calc(100%+1.5rem)] border-t-[3px] border-dashed border-gray-300 -z-10"></div>
                </div>
                {/* Step 3 */}
                <div className="text-center relative group">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-(--color-rw-primary) flex items-center justify-center mx-auto mb-4 text-xl font-bold text-(--color-rw-primary) shadow-sm group-hover:bg-(--color-rw-primary) group-hover:text-white transition-colors duration-300">
                    3
                  </div>
                  <h3 className="font-bold text-(--color-rw-text) mb-2" style={{ fontFamily: 'var(--font-display)' }}>Pengesahan RW</h3>
                  <p className="text-sm text-(--color-rw-muted) px-4">Bawa pengantar RT ke Sekretariat RW untuk distempel dan ditandatangani.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <hr className="border-(--color-rw-border) mb-16" />

          {/* Daftar Layanan */}
          <ScrollReveal>
            <SectionHeader 
              title="Daftar Layanan" 
              subtitle="Klik layanan untuk melihat persyaratan dan prosedur lengkap"
            />
          </ScrollReveal>

          <ScrollReveal>
            <LayananClient initialServices={services} />
          </ScrollReveal>

          {/* Call to Action */}
          <ScrollReveal>
            <div className="mt-16 card-padded bg-(--color-rw-accent-light) border-(--color-rw-accent) flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-(--color-rw-accent-dark) mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Butuh Bantuan Lainnya?
                </h3>
                <p className="text-(--color-rw-accent-dark) opacity-80">
                  Hubungi pengurus RT masing-masing atau chat WhatsApp Admin RW 05 jika Anda memiliki kendala teknis.
                </p>
              </div>
              <a href="/kontak" className="btn-accent shrink-0 whitespace-nowrap shadow-sm hover:shadow-md">
                Hubungi Pengurus
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
