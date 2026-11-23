import { Metadata } from 'next';
import { Shield, Home, Target, MapPin, Users, Phone } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getSiteSettings } from '@/lib/data';
import { rwInfo } from '@/data/contacts';

export const metadata: Metadata = {
  title: 'Profil RW',
  description: 'Profil, visi, misi, dan struktur organisasi RW 05 Kelurahan Sukamaju.',
};

export default async function ProfilPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader 
        title="Profil RW 05"
        subtitle="Mengenal lebih dekat lingkungan dan kepengurusan RW 05 Sukamaju"
        breadcrumbs={[{ label: 'Profil RW' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          {/* Sejarah / Deskripsi Umum */}
          <ScrollReveal>
            <div className="card-padded bg-white mb-16 border-(--color-rw-border)">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-(--color-rw-text) mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                    <div className="w-10 h-10 rounded-xl bg-(--color-rw-primary-pale) flex items-center justify-center text-(--color-rw-primary)">
                      <Home className="w-5 h-5" />
                    </div>
                    Tentang RW 05
                  </h2>
                  <div className="prose prose-lg text-(--color-rw-muted) max-w-none leading-relaxed">
                    <p>
                      {settings?.description || 'RW 05 adalah lingkungan yang asri, aman, dan nyaman di Kelurahan Sukamaju. Kami senantiasa mengedepankan nilai gotong royong dan kebersamaan antar warga.'}
                    </p>
                    <p className="mt-4">
                      Terdiri dari 6 Rukun Tetangga (RT), lingkungan kami dilengkapi dengan berbagai fasilitas umum untuk menunjang kegiatan dan kesejahteraan seluruh warga.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="card bg-(--color-rw-bg-alt) p-6 text-center">
                    <MapPin className="w-8 h-8 text-(--color-rw-accent) mx-auto mb-3" />
                    <h3 className="font-bold text-xl mb-1">{rwInfo.name}</h3>
                    <p className="text-xs text-(--color-rw-muted) uppercase tracking-wider font-semibold">Kelurahan</p>
                  </div>
                  <div className="card bg-(--color-rw-bg-alt) p-6 text-center">
                    <Users className="w-8 h-8 text-(--color-rw-accent) mx-auto mb-3" />
                    <h3 className="font-bold text-xl mb-1">6</h3>
                    <p className="text-xs text-(--color-rw-muted) uppercase tracking-wider font-semibold">Rukun Tetangga</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Visi & Misi */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <ScrollReveal direction="left">
              <div className="card-padded bg-(--color-rw-primary-pale) border-(--color-rw-primary-lighter) h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-(--color-rw-primary)">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-(--color-rw-primary)" style={{ fontFamily: 'var(--font-display)' }}>Visi</h2>
                </div>
                <p className="text-lg font-medium text-(--color-rw-text) leading-relaxed italic">
                  &quot;Mewujudkan lingkungan RW 05 yang aman, bersih, asri, religius, dan berlandaskan semangat gotong royong serta persaudaraan.&quot;
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="card-padded bg-(--color-rw-surface) h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-(--color-rw-primary) rounded-xl shadow-md flex items-center justify-center text-white">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-(--color-rw-text)" style={{ fontFamily: 'var(--font-display)' }}>Misi</h2>
                </div>
                <ul className="space-y-4 text-(--color-rw-muted) font-medium">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-(--color-rw-accent-light) text-(--color-rw-text) flex items-center justify-center shrink-0 text-sm font-bold">1</div>
                    Meningkatkan keamanan lingkungan melalui sistem siskamling aktif.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-(--color-rw-primary-pale) text-(--color-rw-text) flex items-center justify-center shrink-0 text-sm font-bold">2</div>
                    Menjaga kebersihan dan keindahan lingkungan secara swadaya.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-(--color-rw-primary-pale) text-(--color-rw-text) flex items-center justify-center shrink-0 text-sm font-bold">3</div>
                    Membina kerukunan antar warga melalui kegiatan sosial dan keagamaan.
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* Struktur Organisasi */}
          <ScrollReveal>
            <SectionHeader 
              title="Struktur Pengurus RW 05" 
              subtitle="Masa Bakti 2023 - 2028"
              centered
            />
            
            <div className="max-w-4xl mx-auto mt-10">
              {/* Ketua RW (Top Level) */}
              <div className="flex justify-center mb-12 relative">
                <div className="w-64 card-padded bg-(--color-rw-primary) text-white text-center border-none shadow-lg relative z-10">
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Ketua RW</h3>
                  <p className="text-white/80 text-sm">Bpk. Achmad Syarif</p>
                </div>
                {/* Connector Line Down */}
                <div className="absolute top-full left-1/2 w-0.5 h-12 bg-(--color-rw-border) -translate-x-1/2"></div>
              </div>

              {/* Horizontal Line Connector */}
              <div className="w-full max-w-2xl mx-auto h-0.5 bg-(--color-rw-border) relative mb-8">
                <div className="absolute top-0 left-0 w-0.5 h-8 bg-(--color-rw-border)"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-(--color-rw-border) -translate-x-1/2"></div>
                <div className="absolute top-0 right-0 w-0.5 h-8 bg-(--color-rw-border)"></div>
              </div>

              {/* Second Level */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="card bg-white p-5 text-center border-(--color-rw-border)">
                  <h3 className="font-bold text-(--color-rw-text) mb-1">Sekretaris</h3>
                  <p className="text-(--color-rw-text) text-sm">Bpk. Budi Santoso</p>
                </div>
                <div className="card bg-white p-5 text-center border-(--color-rw-border)">
                  <h3 className="font-bold text-(--color-rw-text) mb-1">Bendahara</h3>
                  <p className="text-(--color-rw-text) text-sm">Ibu Siti Aminah</p>
                </div>
                <div className="card bg-white p-5 text-center border-(--color-rw-border)">
                  <h3 className="font-bold text-(--color-rw-text) mb-1">Humas</h3>
                  <p className="text-(--color-rw-text) text-sm">Bpk. Dwi Prasetyo</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
