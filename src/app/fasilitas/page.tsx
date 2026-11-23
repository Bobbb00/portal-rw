import { Metadata } from 'next';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import FacilityCard from '@/components/cards/FacilityCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import EmptyState from '@/components/ui/EmptyState';
import { getPublishedFacilities } from '@/lib/data';
import { generatePlaceholderImage } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Fasilitas Lingkungan',
  description: 'Daftar fasilitas umum dan sosial yang tersedia di lingkungan RW 05.',
};

export default async function FasilitasPage() {
  const facilities = await getPublishedFacilities();

  return (
    <>
      <PageHeader 
        title="Fasilitas Lingkungan"
        subtitle="Berbagai sarana prasarana ruang publik yang dibangun dan dikelola untuk kesejahteraan warga"
        breadcrumbs={[{ label: 'Fasilitas Lingkungan' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          {facilities.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {facilities.map((facility, index) => {
                const Icon = Icons.MapPin;
                return (
                  <ScrollReveal key={facility.id} delay={(index % 2) * 150}>
                    <FacilityCard
                      name={facility.name}
                      description={facility.description}
                      location={facility.location}
                      operatingHours={facility.operatingHours}
                      icon={Icon}
                      image={facility.image || generatePlaceholderImage(800, 500, facility.name, '#174b3a')}
                    />
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <ScrollReveal>
              <EmptyState 
                title="Fasilitas Belum Ditambahkan"
                message="Data fasilitas lingkungan sedang dalam proses pembaruan."
              />
            </ScrollReveal>
          )}

          <ScrollReveal delay={200}>
            <div className="mt-16 text-center max-w-2xl mx-auto p-6 bg-(--color-rw-bg-alt) border border-(--color-rw-border) rounded-2xl">
              <p className="text-(--color-rw-muted) font-medium">
                &quot;Fasilitas ini adalah milik kita bersama. Mari jaga kebersihan dan keutuhannya agar dapat terus bermanfaat bagi seluruh warga.&quot;
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
