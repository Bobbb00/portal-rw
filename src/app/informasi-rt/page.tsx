import { Metadata } from 'next';
import { Home, Users, MapPin } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Informasi RT',
  description: 'Daftar Rukun Tetangga (RT) dan pengurus di lingkungan RW 05.',
};

export default function InformasiRtPage() {
  const rtList = [
    { id: '01', head: 'Bpk. Suryono', families: 42, area: 'Jl. Manggis I, II' },
    { id: '02', head: 'Bpk. Rudi Hermawan', families: 38, area: 'Jl. Manggis III, IV' },
    { id: '03', head: 'Bpk. Ahmad Fauzi', families: 45, area: 'Jl. Rambutan I, II' },
    { id: '04', head: 'Bpk. Wahyudi', families: 35, area: 'Jl. Rambutan III, Jl. Delima' },
    { id: '05', head: 'Ibu Ratna Ningsih', families: 40, area: 'Jl. Durian Blok A' },
    { id: '06', head: 'Bpk. Hendra Wijaya', families: 36, area: 'Jl. Durian Blok B' },
  ];

  return (
    <>
      <PageHeader 
        title="Informasi Rukun Tetangga (RT)"
        subtitle="Mengenal wilayah dan para pengurus di setiap wilayah RT lingkungan RW 05"
        breadcrumbs={[{ label: 'Informasi RT' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          
          <ScrollReveal>
            <div className="mb-12">
              <SectionHeader 
                title="Daftar Wilayah RT" 
                subtitle="Terdapat 6 Rukun Tetangga yang berada di bawah naungan RW 05"
                centered
              />
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rtList.map((rt, index) => (
              <ScrollReveal key={rt.id} delay={(index % 3) * 100}>
                <div className="card h-full overflow-hidden group">
                  {/* Card Header (Top Color Bar) */}
                  <div className="h-24 bg-(--color-rw-primary-pale) relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <span className="text-4xl font-extrabold text-white/20 absolute -right-2 -bottom-2 pointer-events-none select-none" style={{ fontFamily: 'var(--font-display)' }}>
                      RT {rt.id}
                    </span>
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md absolute -bottom-8 flex items-center justify-center text-(--color-rw-primary) border-4 border-white group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 z-10">
                      <Home className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="pt-12 pb-6 px-6 bg-white flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-(--color-rw-text) mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                      RT {rt.id}
                    </h3>
                    <p className="text-(--color-rw-primary) font-semibold mb-6">
                      Ketua: {rt.head}
                    </p>

                    <div className="w-full space-y-3 mt-auto border-t border-(--color-rw-border) pt-5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-(--color-rw-muted)">
                          <Users className="w-4 h-4" />
                          <span>Jumlah KK</span>
                        </div>
                        <span className="font-bold text-(--color-rw-text)">{rt.families} KK</span>
                      </div>
                      <div className="flex items-start justify-between text-sm">
                        <div className="flex items-center gap-2 text-(--color-rw-muted) shrink-0">
                          <MapPin className="w-4 h-4" />
                          <span>Cakupan Wilayah</span>
                        </div>
                        <span className="font-medium text-(--color-rw-text) text-right pl-4">{rt.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
