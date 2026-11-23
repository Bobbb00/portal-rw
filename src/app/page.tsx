import Link from "next/link";
import { generatePlaceholderImage } from "@/lib/utils";
import { ArrowRight, Shield, Trash2, FileText, MapPin, Wallet } from "lucide-react";
import {
  getPublishedAnnouncements,
  getPublishedActivities,
  getPublishedServices,
  getPublishedFacilities,
  getPublishedBusinesses,
  getSiteSettings,
} from "@/lib/data";
import { getRwCashSummary } from "@/actions/finance";

import AnnouncementCard from "@/components/cards/AnnouncementCard";
import ActivityCard from "@/components/cards/ActivityCard";
import ServiceCard from "@/components/cards/ServiceCard";
import FacilityCard from "@/components/cards/FacilityCard";
import BusinessCard from "@/components/cards/BusinessCard";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import ScrollReveal from "@/components/ui/ScrollReveal";
import WaveDivider from "@/components/ui/WaveDivider";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import StatCounter from "@/components/ui/StatCounter";

export const revalidate = 3600;

export default async function HomePage() {
  const [announcements, activities, services, facilities, umkmItems, settings, cashSummary] =
    await Promise.all([
      getPublishedAnnouncements(),
      getPublishedActivities(),
      getPublishedServices(),
      getPublishedFacilities(),
      getPublishedBusinesses(),
      getSiteSettings(),
      getRwCashSummary(),
    ]);

  const recentAnnouncements = announcements.slice(0, 3);
  const upcomingActivities = activities
    .filter((a) => a.status === "upcoming")
    .slice(0, 4);
  const topServices = services.slice(0, 6);
  const featuredFacilities = facilities.slice(0, 4);
  const featuredUmkm = umkmItems.slice(0, 4);

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative bg-linear-to-br from-(--color-rw-primary) to-(--color-rw-primary-light) overflow-hidden pt-12 lg:pt-20 pb-24 lg:pb-32">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <ScrollReveal direction="up" delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Selamat Datang di Ruang Digital Kita
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={100}>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Lebih Dekat,
                  <br className="hidden lg:block" />
                  <span className="text-(--color-rw-accent-light)">
                    Lebih Hangat
                  </span>{" "}
                  bersama RW 05
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={200}>
                <p className="text-white/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {settings?.description ||
                    "Portal informasi resmi RW 05 Kelurahan Sukamaju. Temukan segala informasi kegiatan, pelayanan, dan fasilitas lingkungan di satu tempat."}
                </p>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={300}>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link href="/pengumuman" className="btn-accent">
                    Lihat Pengumuman
                  </Link>
                  <Link
                    href="/layanan"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Layanan Warga
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Hero Visual / Stats */}
            <div className="lg:pl-10">
              <ScrollReveal direction="scale" delay={200}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 transform translate-y-6">
                    <StatCounter end={6} label="Rukun Tetangga (RT)" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8">
                    <StatCounter end={120} suffix="+" label="Kepala Keluarga" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8">
                    <StatCounter end={3} label="Fasilitas Umum" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 transform -translate-y-6">
                    <StatCounter
                      end={24}
                      suffix="/7"
                      label="Keamanan Lingkungan"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Transition */}
      <div className="relative -mt-10 z-20">
        <WaveDivider color="var(--color-rw-bg)" />
      </div>

      {/* KAS RW TRANSPARENCY BANNER */}
      <section className="relative z-20 -mt-6 mb-8">
        <div className="container-custom">
          <ScrollReveal direction="up">
            <div className="bg-linear-to-r from-emerald-900 to-teal-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-emerald-700/40">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                  <Wallet className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Transparansi Keuangan Terbuka
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
                    Buku Kas Terbuka RW 05
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xl">
                    Setiap rupiah iuran warga dicatat dan dilaporkan secara terbuka untuk kenyamanan & kemajuan lingkungan.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
                <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl text-center sm:text-left w-full sm:w-auto">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold block">
                    Saldo Kas Aktif Saat Ini
                  </span>
                  <span className="text-2xl font-black text-white">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cashSummary.currentBalance)}
                  </span>
                </div>
                <Link
                  href="/transparansi-kas"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 text-center"
                >
                  Buka Buku Kas <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. PENGUMUMAN TERBARU */}
      <section className="section-padding section-bg-cream relative">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <SectionHeader
                title="Kabar Terbaru"
                subtitle="Informasi dan pengumuman penting untuk warga RW 05"
              />
              <Link
                href="/pengumuman"
                className="inline-flex items-center gap-1.5 text-(--color-rw-text) font-semibold hover:text-(--color-rw-primary) mb-4 sm:mb-10"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {recentAnnouncements.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recentAnnouncements.map((announcement, index) => (
                <ScrollReveal key={announcement.id} delay={index * 100}>
                  <AnnouncementCard announcement={announcement} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <EmptyState message="Belum ada pengumuman terbaru saat ini." />
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* 3. AGENDA KEGIATAN */}
      <section className="section-padding section-bg-white relative">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <SectionHeader
                title="Agenda Terdekat"
                subtitle="Jangan lewatkan kegiatan bersama warga"
              />
              <Link
                href="/agenda"
                className="inline-flex items-center gap-1.5 text-(--color-rw-text) font-semibold hover:text-(--color-rw-primary) mb-4 sm:mb-10"
              >
                Kalender Lengkap <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {upcomingActivities.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-6">
              {upcomingActivities.map((activity, index) => (
                <ScrollReveal key={activity.id} delay={index * 100}>
                  <ActivityCard activity={activity} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <EmptyState message="Tidak ada agenda terdekat dalam waktu dekat." />
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* 4. LAYANAN WARGA */}
      <section className="section-padding section-bg-cream">
        <div className="container-custom">
          <ScrollReveal>
            <SectionHeader
              title="Layanan Warga"
              subtitle="Pusat layanan administrasi dan kebutuhan warga RW 05"
              centered
            />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {topServices.map((service, index) => {
              const Icon = FileText;
              return (
                <ScrollReveal key={service.id} delay={index * 100}>
                  <ServiceCard
                    title={service.name}
                    description={service.description}
                    icon={Icon}
                    href={`/layanan#${service.id}`}
                  />
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={300}>
            <div className="text-center mt-10">
              <Link href="/layanan" className="btn-secondary">
                Lihat Semua Layanan
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. QUICK INFO BANNERS (Keamanan & Kebersihan) */}
      <section className="py-12 bg-white border-y border-(--color-rw-border)">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal direction="left">
              <Link href="/keamanan" className="block group">
                <div className="rounded-3xl p-8 bg-(--color-rw-primary-pale) border border-(--color-rw-border) flex items-center justify-between transition-colors group-hover:bg-(--color-rw-primary) group-hover:text-white">
                  <div>
                    <h3
                      className="text-2xl font-bold mb-2 group-hover:text-white text-(--color-rw-text)"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Keamanan Lingkungan
                    </h3>
                    <p className="text-(--color-rw-text) group-hover:text-white/80">
                      Jadwal ronda, nomor darurat, dan pelaporan
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-(--color-rw-text)">
                    <Shield className="w-8 h-8" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <Link href="/kebersihan" className="block group">
                <div className="rounded-3xl p-8 bg-(--color-rw-primary-pale) border border-(--color-rw-border) flex items-center justify-between transition-colors group-hover:bg-(--color-rw-primary) group-hover:text-white">
                  <div>
                    <h3
                      className="text-2xl font-bold mb-2 group-hover:text-white text-(--color-rw-text)"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Info Kebersihan
                    </h3>
                    <p className="text-(--color-rw-text) group-hover:text-white/80">
                      Jadwal angkut sampah & bank sampah
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-(--color-rw-text)">
                    <Trash2 className="w-8 h-8" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 6. FASILITAS (Horizontal Scroll Mobile) */}
      <section className="section-padding section-bg-cream overflow-hidden">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <SectionHeader
                title="Fasilitas Lingkungan"
                subtitle="Ruang publik yang dapat dinikmati bersama"
              />
              <Link
                href="/fasilitas"
                className="inline-flex items-center gap-1.5 text-(--color-rw-text) font-semibold hover:text-(--color-rw-primary) mb-4 sm:mb-10"
              >
                Detail Fasilitas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 scrollbar-hide snap-x">
            {featuredFacilities.map((facility, index) => {
              const Icon = MapPin;
              return (
                <div
                  key={facility.id}
                  className="min-w-70 sm:min-w-0 snap-center"
                >
                  <ScrollReveal delay={index * 100}>
                    <FacilityCard
                      name={facility.name}
                      description={facility.description}
                      location={facility.location}
                      icon={Icon}
                      image={
                        facility.image ||
                        generatePlaceholderImage(
                          600,
                          400,
                          facility.name,
                          "#174b3a",
                        )
                      }
                    />
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. UMKM WARGA */}
      <section className="section-padding section-bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <SectionHeader
              title="UMKM Warga Kita"
              subtitle="Dukung usaha kecil menengah dari tetangga untuk tetangga"
              centered
            />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {featuredUmkm.map((umkm, index) => (
              <ScrollReveal key={umkm.id} delay={index * 100}>
                <BusinessCard item={umkm} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div className="text-center mt-10">
              <Link href="/umkm" className="btn-secondary">
                Lihat Semua Katalog UMKM
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. PERMAINAN EDUKATIF CTA */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-(--color-rw-primary-pale)">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-(--color-rw-primary-pale)/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container-custom relative z-10 text-center">
          <ScrollReveal>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Mari Bermain & Belajar
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
              Uji pengetahuan Anda tentang lingkungan RW 05 melalui permainan
              kuis interaktif yang seru dan edukatif.
            </p>
            <Link href="/permainan" className="btn-accent text-lg px-8 py-4">
              Mulai Bermain Sekarang
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Floating WhatsApp CTA Component */}
      {settings?.whatsapp && <FloatingWhatsApp phone={settings.whatsapp} />}
    </>
  );
}
