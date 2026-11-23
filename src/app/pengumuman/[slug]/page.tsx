import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getPublishedAnnouncements, getAnnouncementBySlug } from '@/lib/data';
import { formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const announcements = await getPublishedAnnouncements();
  return announcements.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);
  if (!announcement) return { title: 'Pengumuman Tidak Ditemukan' };
  return {
    title: announcement.title,
    description: announcement.content.substring(0, 160),
  };
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { slug } = await params;
  const announcement = await getAnnouncementBySlug(slug);

  if (!announcement) notFound();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Penting': return 'bg-red-100 text-red-700 border-red-200';
      case 'Kegiatan': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Keamanan': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Kebersihan': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-(--color-rw-primary-pale) text-(--color-rw-text) border-(--color-rw-border)';
    }
  };

  return (
    <>
      <PageHeader 
        title="Detail Pengumuman"
        breadcrumbs={[
          { label: 'Pengumuman', href: '/pengumuman' },
          { label: 'Detail' }
        ]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <ScrollReveal>
            <article className="max-w-3xl mx-auto card-padded bg-white">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${getCategoryColor(announcement.category)}`}>
                  {announcement.category}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-(--color-rw-text) font-medium">
                  <Calendar className="w-4 h-4" />
                  <time>{formatDate(announcement.publishedAt)}</time>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-(--color-rw-text) mb-8 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                {announcement.title}
              </h1>

              <div className="prose prose-lg prose-green max-w-none text-(--color-rw-text) leading-relaxed">
                {announcement.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-(--color-rw-border)">
                <Link href="/pengumuman" className="btn-secondary inline-flex">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Daftar Pengumuman
                </Link>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
