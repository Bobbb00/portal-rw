import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Import existing data
// (User deleted mock data files)

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rw05.id';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  const adminName = process.env.ADMIN_NAME || 'Admin System';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // 10. Seed Site Settings (Initial)
  await prisma.siteSetting.create({
    data: {
      siteName: 'Portal Informasi RW 05',
      rwName: 'RW 05',
      description: 'Portal informasi resmi RW 05 Kelurahan Sukamaju.',
      address: 'Jl. Melati Raya No. 1, Kelurahan Sukamaju',
      phone: '(021) 555-0123',
      email: 'kontak@rw05sukamaju.id',
      serviceHours: 'Senin - Jumat: 09:00 - 15:00',
    },
  });
  console.log(`Seeded Site Settings`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
