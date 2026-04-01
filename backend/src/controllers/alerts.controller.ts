import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createAlertSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(5),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
  expiresAt: z.string().datetime().optional(),
});

// GET /api/alerts/active - get active emergency alert
export async function getActiveAlert(_req: Request, res: Response) {
  try {
    const now = new Date();
    const alert = await prisma.emergencyAlert.findFirst({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ alert });
  } catch (error) {
    console.error('getActiveAlert error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// POST /api/alerts - admin creates alert
export async function createAlert(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Sadece adminler uyarı oluşturabilir' });
    }

    const data = createAlertSchema.parse(req.body);
    const alert = await prisma.emergencyAlert.create({
      data: {
        title: data.title,
        message: data.message,
        severity: data.severity as any,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        createdById: userId,
      },
    });
    res.status(201).json({ alert });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// PATCH /api/alerts/:id/deactivate - admin deactivates
export async function deactivateAlert(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Yetki yok' });
    }

    const alert = await prisma.emergencyAlert.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ alert });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
