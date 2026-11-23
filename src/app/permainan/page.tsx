import { Metadata } from 'next';
import GameCard from '@/components/cards/GameCard';
import PageHeader from '@/components/layout/PageHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Permainan',
  description: 'Permainan edukatif tentang lingkungan untuk warga.',
};

export default function PermainanPage() {
  const games = [
    {
      title: 'Kuis Lingkungan Kita',
      description: 'Uji seberapa jauh Anda mengenal prosedur administrasi, fasilitas, dan tata tertib di lingkungan RW 05 melalui kuis pilihan ganda ini.',
      href: '/permainan/kuis',
      isActive: true,
    },
    {
      title: 'Tebak Lokasi (Segera Hadir)',
      description: 'Permainan mencocokkan foto fasilitas lingkungan dengan nama lokasi di peta RW.',
      href: '#',
      isActive: false,
    },
    {
      title: 'Simulasi Pilah Sampah (Segera Hadir)',
      description: 'Belajar memilah sampah organik, anorganik, dan B3 dengan permainan interaktif drop & drop.',
      href: '#',
      isActive: false,
    },
  ];

  return (
    <>
      <PageHeader 
        title="Permainan Edukatif"
        subtitle="Belajar tentang lingkungan RW 05 dengan cara yang menyenangkan"
        breadcrumbs={[{ label: 'Permainan' }]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <ScrollReveal key={index} delay={(index % 3) * 100}>
                <GameCard
                  title={game.title}
                  description={game.description}
                  href={game.href}
                  isActive={game.isActive}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
