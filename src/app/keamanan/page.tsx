import { Metadata } from 'next';
import { Shield, Phone, AlertTriangle, Clock } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Keamanan',
  description: 'Informasi sistem keamanan, jadwal ronda, dan kontak darurat RW 05.',
};

export default function KeamananPage() {
  const emergencyContacts = [
    { name: 'Polsek Terdekat', number: '110 / (021) 1234567', icon: AlertTriangle },
    { name: 'Pemadam Kebakaran', number: '113 / (021) 7654321', icon: AlertTriangle },
    { name: 'Puskesmas / Ambulans', number: '119 / (021) 888999', icon: AlertTriangle },
    { name: 'Posko Keamanan RW', number: '0812-3456-7890', icon: Shield },
  ];

  return (
    <>
      <PageHeader 
        title="Keamanan Lingkungan"
        subtitle="Sistem Keamanan Keliling (Siskamling) dan nomor darurat lingkungan RW 05"
        breadcrumbs={[{ label: 'Keamanan' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Nomor Darurat */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="left">
                <div className="card-padded bg-rw-danger text-white border-none shadow-xl sticky top-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Kontak Darurat</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {emergencyContacts.map((contact, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                        <p className="text-sm text-white/80 font-medium mb-1">{contact.name}</p>
                        <p className="text-xl font-bold tracking-wide">{contact.number}</p>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-white/60 mt-6 text-center italic">
                    Hanya gunakan nomor ini untuk keperluan darurat yang mengancam jiwa atau keamanan lingkungan.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Tata Tertib & Siskamling */}
            <div className="lg:col-span-2 space-y-12">
              <ScrollReveal direction="up">
                <SectionHeader title="Tata Tertib Keamanan" />
                <div className="card-padded bg-white">
                  <ul className="space-y-4 text-(--color-rw-muted)">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-(--color-rw-bg) text-(--color-rw-primary) flex items-center justify-center shrink-0 font-bold mt-0.5">1</div>
                      <p className="pt-1">Tamu yang menginap lebih dari 1x24 jam wajib melapor kepada Ketua RT setempat dengan membawa fotokopi KTP.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-(--color-rw-bg) text-(--color-rw-primary) flex items-center justify-center shrink-0 font-bold mt-0.5">2</div>
                      <p className="pt-1">Portal utama (Gerbang Depan) akan ditutup pada pukul 23.00 WIB. Akses keluar masuk setelah jam tersebut harus melapor pada petugas jaga.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-(--color-rw-bg) text-(--color-rw-primary) flex items-center justify-center shrink-0 font-bold mt-0.5">3</div>
                      <p className="pt-1">Warga yang akan meninggalkan rumah dalam waktu lama (mudik/liburan) diimbau untuk melapor ke petugas keamanan dan menitipkan kunci ke keluarga atau tetangga terdekat.</p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-(--color-rw-bg) text-(--color-rw-primary) flex items-center justify-center shrink-0 font-bold mt-0.5">4</div>
                      <p className="pt-1">Pedagang keliling dan pemulung tidak diizinkan masuk ke lingkungan perumahan tanpa izin dari pihak keamanan.</p>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={200}>
                <SectionHeader title="Sistem Ronda Malam" />
                <div className="card-padded bg-(--color-rw-bg-alt) border-(--color-rw-border)">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md text-(--color-rw-primary) shrink-0">
                      <Clock className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-(--color-rw-text) mb-3" style={{ fontFamily: 'var(--font-display)' }}>Pelaksanaan Siskamling</h3>
                      <p className="text-(--color-rw-muted) mb-4">
                        Kegiatan ronda malam dilaksanakan setiap hari mulai pukul 22.00 hingga 04.00 WIB. 
                        Jadwal giliran ronda diatur oleh masing-masing RT (RT 01 - RT 06).
                      </p>
                      <div className="inline-flex px-4 py-2 bg-(--color-rw-primary-pale) text-(--color-rw-primary) rounded-lg text-sm font-semibold border border-(--color-rw-primary-lighter)">
                        Silakan cek jadwal ronda Anda melalui Ketua RT.
                      </div>
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
