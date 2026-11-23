import { Metadata } from 'next';
import { Trash2, Recycle, Calendar, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Kebersihan',
  description: 'Jadwal pengangkutan sampah dan program bank sampah RW 05.',
};

export default function KebersihanPage() {
  return (
    <>
      <PageHeader 
        title="Kebersihan Lingkungan"
        subtitle="Mewujudkan lingkungan RW 05 yang bersih, sehat, dan asri melalui pengelolaan sampah terpadu"
        breadcrumbs={[{ label: 'Kebersihan' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          
          {/* Highlight Banner */}
          <ScrollReveal>
            <div className="card-padded bg-(--color-rw-primary) text-white text-center mb-16 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
               <div className="relative z-10 max-w-3xl mx-auto">
                 <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>&quot;Lingkungan Bersih, Warga Sehat&quot;</h2>
                 <p className="text-white/80 text-lg">Mari bersama-sama menjaga kebersihan lingkungan dengan membuang sampah pada tempatnya dan mengikuti aturan pemilahan sampah yang berlaku.</p>
               </div>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            
            {/* Pengangkutan Sampah */}
            <ScrollReveal direction="left">
              <div>
                <SectionHeader title="Pengangkutan Sampah" />
                <div className="card-padded bg-white border-(--color-rw-border) h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-(--color-rw-bg) rounded-xl flex items-center justify-center text-(--color-rw-accent)">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-(--color-rw-text)" style={{ fontFamily: 'var(--font-display)' }}>Jadwal Angkut</h3>
                      <p className="text-(--color-rw-muted) text-sm">Oleh petugas kebersihan RW</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-4 bg-(--color-rw-bg-alt) rounded-xl border border-(--color-rw-border)">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-(--color-rw-muted)" />
                        <span className="font-bold text-(--color-rw-text)">Senin & Kamis</span>
                      </div>
                      <span className="text-(--color-rw-muted) font-medium">07.00 - 10.00 WIB</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-(--color-rw-bg-alt) rounded-xl border border-(--color-rw-border)">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-(--color-rw-muted)" />
                        <span className="font-bold text-(--color-rw-text)">Minggu Pagi</span>
                      </div>
                      <span className="text-(--color-rw-muted) font-medium">06.00 - 09.00 WIB</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Mohon Perhatian:</strong> Warga diimbau untuk meletakkan tempat sampah di depan rumah masing-masing <strong>sebelum petugas datang</strong> agar tidak terlewat.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Bank Sampah */}
            <ScrollReveal direction="right">
              <div>
                <SectionHeader title="Program Bank Sampah" />
                <div className="card-padded bg-(--color-rw-primary-pale) border-(--color-rw-primary-lighter) h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-(--color-rw-primary)">
                      <Recycle className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-(--color-rw-primary)" style={{ fontFamily: 'var(--font-display)' }}>Bank Sampah &quot;Asri&quot;</h3>
                      <p className="text-(--color-rw-primary-light) text-sm">Pilah sampah jadi berkah</p>
                    </div>
                  </div>

                  <div className="prose prose-green max-w-none text-(--color-rw-text) mb-8">
                    <p>
                      Program Bank Sampah bertujuan untuk mengurangi volume sampah yang dibuang ke TPA sekaligus memberikan nilai ekonomis bagi warga.
                    </p>
                    <p className="font-semibold mt-4 mb-2">Jenis sampah yang diterima:</p>
                    <ul className="grid grid-cols-2 gap-2 mt-2">
                      <li className="flex items-center gap-2 m-0"><div className="w-2 h-2 rounded-full bg-(--color-rw-primary)"></div> Kardus & Kertas</li>
                      <li className="flex items-center gap-2 m-0"><div className="w-2 h-2 rounded-full bg-(--color-rw-primary)"></div> Botol Plastik</li>
                      <li className="flex items-center gap-2 m-0"><div className="w-2 h-2 rounded-full bg-(--color-rw-primary)"></div> Logam/Besi/Aluminium</li>
                      <li className="flex items-center gap-2 m-0"><div className="w-2 h-2 rounded-full bg-(--color-rw-primary)"></div> Minyak Jelantah</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-white rounded-xl shadow-sm">
                    <h4 className="font-bold text-(--color-rw-text) mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-(--color-rw-accent)" />
                      Jadwal Penimbangan
                    </h4>
                    <p className="text-(--color-rw-muted) text-sm">
                      Setiap hari <span className="font-bold">Minggu ke-2</span> dan <span className="font-bold">Minggu ke-4</span> setiap bulan. Lokasi di Posko Balai Warga RW 05.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
          </div>
        </div>
      </div>
    </>
  );
}
