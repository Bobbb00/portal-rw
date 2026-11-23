export interface Announcement {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: AnnouncementCategory;
  publishedAt: string;
  isImportant: boolean;
  attachmentUrl?: string;
}

export type AnnouncementCategory =
  | 'Umum'
  | 'Keamanan'
  | 'Kebersihan'
  | 'Kesehatan'
  | 'Pelayanan'
  | 'Kegiatan'
  | 'Darurat';

export interface Activity {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  participants: string;
  requirements: string[];
  status: ActivityStatus;
}

export type ActivityStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Service {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  procedure: string[];
  estimatedTime: string;
  operatingHours: string;
  downloadUrl?: string;
  contactPerson: string;
  contactPhone: string;
}

export interface Facility {
  id: string;
  name: string;
  image: string;
  location: string;
  description: string;
  operatingHours: string;
  rules: string[];
  mapUrl: string;
  category: FacilityCategory;
}

export type FacilityCategory =
  | 'Pelayanan'
  | 'Kesehatan'
  | 'Olahraga'
  | 'Keamanan'
  | 'Sosial'
  | 'Kebersihan';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  image: string;
  address: string;
  operatingHours: string;
  whatsapp: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    tokopedia?: string;
    shopee?: string;
  };
}

export type BusinessCategory =
  | 'Makanan'
  | 'Minuman'
  | 'Jasa'
  | 'Kerajinan'
  | 'Fashion'
  | 'Kebutuhan Rumah Tangga';

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  album: GalleryAlbum;
  date: string;
  caption: string;
}

export type GalleryAlbum =
  | 'Kerja Bakti'
  | 'Posyandu'
  | 'Rapat Warga'
  | 'Perlombaan'
  | 'Kegiatan Sosial'
  | 'Hari Kemerdekaan';

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  format: string;
  fileSize: string;
  publishedAt: string;
  fileUrl: string;
  category: DocumentCategory;
}

export type DocumentCategory =
  | 'Formulir'
  | 'Jadwal'
  | 'Tata Tertib'
  | 'Panduan'
  | 'Laporan'
  | 'Program Kerja';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface NeighborhoodUnit {
  id: string;
  number: string;
  leader: string;
  area: string;
  posLocation: string;
  operatingHours: string;
  contact: string;
}

export interface BoardMember {
  name: string;
  position: string;
  phone: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  icon: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface RwCashTransactionItem {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  category: string;
  transactionDate: string;
  receiptUrl?: string;
  receiptPublicId?: string;
  createdAt: string;
}

export interface RwCashSummary {
  currentBalance: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  totalIncomeAllTime: number;
  totalExpenseAllTime: number;
  transactionCount: number;
}
