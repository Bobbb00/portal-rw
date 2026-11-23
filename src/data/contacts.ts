import { BoardMember, EmergencyContact } from '@/types';

export const boardMembers: BoardMember[] = [
  { name: 'Bapak Surya Pratama', position: 'Ketua RW', phone: '0812-0000-0505' },
  { name: 'Bapak Eko Wibowo', position: 'Wakil Ketua RW', phone: '0812-0000-0507' },
  { name: 'Bapak Ahmad Hidayat', position: 'Sekretaris', phone: '0813-0000-0506' },
  { name: 'Ibu Dewi Lestari', position: 'Bendahara', phone: '0814-0000-0508' },
  { name: 'Bapak Rudi Hartono', position: 'Seksi Keamanan', phone: '0815-0000-0509' },
  { name: 'Bapak Yusuf Ramadhan', position: 'Seksi Kebersihan', phone: '0816-0000-0511' },
  { name: 'Ibu Siti Nurhaliza', position: 'Seksi Sosial', phone: '0815-0000-0510' },
  { name: 'Bapak Rizki Aditya', position: 'Seksi Pemuda', phone: '0817-0000-0512' },
];

export const emergencyContacts: EmergencyContact[] = [
  { name: 'Pos Keamanan RW 05', phone: '021-5550101', icon: 'shield' },
  { name: 'Ketua RW', phone: '0812-0000-0505', icon: 'user' },
  { name: 'Ambulans', phone: '118 / 119', icon: 'ambulance' },
  { name: 'Pemadam Kebakaran', phone: '113', icon: 'flame' },
  { name: 'Kepolisian', phone: '110', icon: 'siren' },
];

export const rwInfo = {
  name: 'RW 05 Kelurahan Sukamaju',
  fullAddress: 'Sekretariat RW 05, Jl. Melati No. 5, RT 01/RW 05, Kelurahan Sukamaju, Kecamatan Harapan Jaya',
  operatingHours: 'Senin - Jumat: 09.00 - 15.00 WIB | Sabtu: 09.00 - 12.00 WIB',
  phone: '021-5550505',
  whatsapp: '6281200000505',
  email: 'rw05sukamaju@gmail.com',
  socialMedia: {
    instagram: '@rw05sukamaju',
    facebook: 'RW 05 Kelurahan Sukamaju',
    youtube: 'RW 05 Sukamaju',
  },
};
