import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ClipboardList, CheckCircle, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getPublishedActivities, getActivityBySlug } from '@/lib/data';
import { formatDate, formatTime, getStatusLabel } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const activities = await getPublishedActivities();
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);
  if (!activity) return { title: 'Agenda Tidak Ditemukan' };
  return {
    title: activity.title,
    description: activity.description.substring(0, 160),
  };
}

export default async function AgendaDetailPage({ params }: Props) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) notFound();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ongoing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      <PageHeader 
        title="Detail Agenda"
        breadcrumbs={[
          { label: 'Agenda Kegiatan', href: '/agenda' },
          { label: 'Detail' }
        ]}
      />

      <div className="section-padding -mt-8 relative z-20">
        <div className="container-custom">
          <ScrollReveal>
            <article className="max-w-4xl mx-auto">
              {/* Header Box */}
              <div className="bg-white card-padded mb-8 border-(--color-rw-border) text-center sm:text-left">
                <div className="mb-4 flex justify-center sm:justify-start">
                  <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(activity.status)}`}>
                    {getStatusLabel(activity.status)}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-(--color-rw-text) mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {activity.title}
                </h1>
              </div>

              {/* Info Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card-padded bg-(--color-rw-bg-alt) border-(--color-rw-border) flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-(--color-rw-primary)">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-rw-muted) font-semibold uppercase mb-1">Tanggal</p>
                    <p className="text-sm font-bold text-(--color-rw-text)">{formatDate(activity.date)}</p>
                  </div>
                </div>
                
                <div className="card-padded bg-(--color-rw-bg-alt) border-(--color-rw-border) flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-(--color-rw-primary)">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-rw-muted) font-semibold uppercase mb-1">Waktu</p>
                    <p className="text-sm font-bold text-(--color-rw-text)">{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</p>
                  </div>
                </div>

                <div className="card-padded bg-(--color-rw-bg-alt) border-(--color-rw-border) flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-(--color-rw-primary)">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-rw-muted) font-semibold uppercase mb-1">Lokasi</p>
                    <p className="text-sm font-bold text-(--color-rw-text) line-clamp-2">{activity.location}</p>
                  </div>
                </div>

                <div className="card-padded bg-(--color-rw-bg-alt) border-(--color-rw-border) flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-(--color-rw-primary)">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-(--color-rw-muted) font-semibold uppercase mb-1">Penyelenggara</p>
                    <p className="text-sm font-bold text-(--color-rw-text) line-clamp-2">{activity.organizer}</p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="card-padded bg-white">
                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-(--color-rw-text) mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                    <ClipboardList className="w-6 h-6 text-(--color-rw-accent)" />
                    Deskripsi Kegiatan
                  </h2>
                  <div className="prose prose-lg max-w-none text-(--color-rw-text) leading-relaxed">
                    {activity.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <hr className="border-(--color-rw-border) my-8" />

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Participants */}
                  <div>
                    <h2 className="text-lg font-bold text-(--color-rw-text) mb-3" style={{ fontFamily: 'var(--font-display)' }}>Target Peserta</h2>
                    <p className="text-(--color-rw-muted) font-medium p-4 bg-(--color-rw-bg-alt) rounded-xl border border-(--color-rw-border)">
                      {activity.participants}
                    </p>
                  </div>

                  {/* Requirements */}
                  {activity.requirements.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-(--color-rw-text) mb-3" style={{ fontFamily: 'var(--font-display)' }}>Persyaratan / Bawaan</h2>
                      <ul className="space-y-3">
                        {activity.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3 text-(--color-rw-muted)">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="font-medium">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-6">
                  <Link href="/agenda" className="btn-secondary">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Kalender Agenda
                  </Link>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
