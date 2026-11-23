import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-guard';

export async function logAudit(action: string, entityType: string, entityId: string, description: string) {
  try {
    const user = await requireAuth();
    if (!user || !user.id) return;

    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action,
        entityType,
        entityId,
        description,
      },
    });
  } catch (error) {
    console.error('Error logging audit:', error);
  }
}
