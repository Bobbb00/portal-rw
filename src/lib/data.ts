import { prisma } from './prisma';
import { ContentStatus } from '@prisma/client';
import { 
  Announcement, 
  Activity, 
  NeighborhoodUnit, 
  Service, 
  Facility, 
  Business, 
  GalleryItem, 
  DocumentItem, 
  AnnouncementCategory,
  ActivityStatus,
  FacilityCategory,
  BusinessCategory,
  GalleryAlbum,
  DocumentCategory
} from '@/types';

// Helper to format date
const formatDate = (date: Date | null) => date ? date.toISOString().split('T')[0] : '';

// Announcements
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  const data = await prisma.announcement.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { publishedAt: 'desc' },
  });
  return data.map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || '',
    content: item.content,
    category: item.category as AnnouncementCategory,
    publishedAt: formatDate(item.publishedAt),
    isImportant: item.isImportant,
    attachmentUrl: item.attachmentUrl || undefined,
  }));
}

export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  const item = await prisma.announcement.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
  });
  if (!item) return null;
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || '',
    content: item.content,
    category: item.category as AnnouncementCategory,
    publishedAt: formatDate(item.publishedAt),
    isImportant: item.isImportant,
    attachmentUrl: item.attachmentUrl || undefined,
  };
}

// Helper to determine Activity status
const determineActivityStatus = (startDate: Date, endDate: Date, startTime: string, endTime: string): ActivityStatus => {
  const now = new Date();
  
  // Combine date and time string to get actual Date objects (assuming format "HH.mm")
  const startStr = `${formatDate(startDate)}T${startTime.replace('.', ':')}:00`;
  const endStr = `${formatDate(endDate)}T${endTime.replace('.', ':')}:00`;
  
  const actualStart = new Date(startStr);
  const actualEnd = new Date(endStr);
  
  // If parsing fails for some reason, fallback to basic date check
  if (isNaN(actualStart.getTime()) || isNaN(actualEnd.getTime())) {
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'ongoing';
  }

  if (now < actualStart) return 'upcoming';
  if (now > actualEnd) return 'completed';
  return 'ongoing';
};

// Activities
export async function getPublishedActivities(): Promise<Activity[]> {
  const data = await prisma.activity.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { startDate: 'asc' },
  });
  return data.map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: formatDate(item.startDate),
    startTime: item.startTime,
    endTime: item.endTime,
    location: item.location,
    organizer: item.organizer,
    participants: item.participants,
    requirements: item.requirements ? item.requirements.split('\n') : [],
    status: determineActivityStatus(item.startDate, item.endDate, item.startTime, item.endTime),
  }));
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const item = await prisma.activity.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
  });
  if (!item) return null;
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    date: formatDate(item.startDate),
    startTime: item.startTime,
    endTime: item.endTime,
    location: item.location,
    organizer: item.organizer,
    participants: item.participants,
    requirements: item.requirements ? item.requirements.split('\n') : [],
    status: determineActivityStatus(item.startDate, item.endDate, item.startTime, item.endTime),
  };
}

// Neighborhood Units (RT)
export async function getPublishedNeighborhoodUnits(): Promise<NeighborhoodUnit[]> {
  const data = await prisma.neighborhoodUnit.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { number: 'asc' },
  });
  return data.map(item => ({
    id: item.id,
    number: item.number,
    leader: item.leaderName,
    area: item.area || '',
    posLocation: item.officeLocation || '',
    operatingHours: item.serviceHours || '',
    contact: item.officialContact || '',
  }));
}

// Services
export async function getPublishedServices(): Promise<Service[]> {
  const data = await prisma.service.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { name: 'asc' },
  });
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    requirements: item.requirements ? item.requirements.split('\n') : [],
    procedure: item.procedure ? item.procedure.split('\n') : [],
    estimatedTime: item.estimatedTime || '',
    operatingHours: item.serviceHours || '',
    downloadUrl: item.documentUrl || undefined,
    contactPerson: item.contact ? item.contact.split(' (')[0] : '',
    contactPhone: item.contact ? item.contact.split(' (')[1]?.replace(')', '') || '' : '',
  }));
}

// Facilities
export async function getPublishedFacilities(): Promise<Facility[]> {
  const data = await prisma.facility.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { name: 'asc' },
  });
  return data.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category as FacilityCategory,
    description: item.description,
    image: item.imageUrl || '',
    location: item.location,
    operatingHours: item.operatingHours || '',
    rules: item.rules ? item.rules.split('\n') : [],
    mapUrl: item.mapUrl || '',
  }));
}

// Businesses (UMKM)
export async function getPublishedBusinesses(): Promise<Business[]> {
  const data = await prisma.business.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { name: 'asc' },
  });
  return data.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category as BusinessCategory,
    description: item.description,
    image: item.imageUrl || '',
    address: item.address,
    operatingHours: item.operatingHours || '',
    whatsapp: item.whatsapp || '',
    socialMedia: item.socialMedia ? JSON.parse(item.socialMedia) : {},
  }));
}

// Gallery
export async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  const data = await prisma.galleryItem.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { eventDate: 'desc' },
  });
  return data.map(item => ({
    id: item.id,
    title: item.title,
    caption: item.caption || '',
    category: item.category,
    album: item.category as GalleryAlbum, // map category back to album
    image: item.imageUrl,
    date: formatDate(item.eventDate),
  }));
}

// Documents
export async function getPublishedDocuments(): Promise<DocumentItem[]> {
  const data = await prisma.document.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { publishedAt: 'desc' },
  });
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    format: item.fileType || '',
    fileSize: item.fileSize || '',
    fileUrl: item.fileUrl,
    publishedAt: formatDate(item.publishedAt),
    category: item.category as DocumentCategory,
  }));
}

// Site Settings
export async function getSiteSettings() {
  return await prisma.siteSetting.findFirst();
}
