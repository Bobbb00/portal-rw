import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminRole } from '@prisma/client';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  
  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.role !== AdminRole.ADMIN) {
    throw new Error('Forbidden: Memerlukan akses Admin');
  }
  
  return user;
}

export async function requireEditor() {
  const user = await requireAuth();
  
  if (user.role !== AdminRole.EDITOR && user.role !== AdminRole.ADMIN) {
    throw new Error('Forbidden: Memerlukan minimal akses Editor');
  }
  
  return user;
}
