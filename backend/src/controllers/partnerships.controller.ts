import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createPartnershipSchema = z.object({
  businessName: z.string().min(2),
  type: z.enum(['TAXI', 'MARKET', 'RESTAURANT', 'HOTEL', 'CARGO', 'PHARMACY', 'SERVICE']),
  description: z.string().optional(),
  commissionRate: z.number().min(0).max(50),
  fixedMonthlyFee: z.number().min(0).optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contractStart: z.string(),
  contractEnd: z.string().optional(),
});

// ─── Create Partnership ───
export async function createPartnership(req: Request, res: Response) {
  try {
    const userId = (req as any).auth.userId;
    const data = createPartnershipSchema.parse(req.body);

    const partnership = await prisma.partnership.create({
      data: {
        businessName: data.businessName,
        type: data.type,
        description: data.description,
        commissionRate: data.commissionRate,
        fixedMonthlyFee: data.fixedMonthlyFee,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contractStart: new Date(data.contractStart),
        contractEnd: data.contractEnd ? new Date(data.contractEnd) : undefined,
        partnerId: userId,
      },
    });

    res.status(201).json({ partnership });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Get Partnerships ───
export async function getPartnerships(req: Request, res: Response) {
  try {
    const partnerships = await prisma.partnership.findMany({
      where: { isActive: true },
      include: { partner: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ partnerships });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Record Order (Commission Tracking) ───
export async function recordPartnerOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { orderAmount } = req.body;

    const partnership = await prisma.partnership.findUnique({ where: { id } });
    if (!partnership) return res.status(404).json({ message: 'Anlaşma bulunamadı' });

    const commission = (orderAmount * partnership.commissionRate) / 100;

    await prisma.partnership.update({
      where: { id },
      data: {
        totalOrders: { increment: 1 },
        totalRevenue: { increment: orderAmount },
        totalCommission: { increment: commission },
      },
    });

    res.json({ commission, message: `${commission.toFixed(2)} ₺ komisyon kaydedildi` });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Get Partnership Stats ───
export async function getPartnershipStats(req: Request, res: Response) {
  try {
    const stats = await prisma.partnership.groupBy({
      by: ['type'],
      _sum: { totalCommission: true, totalRevenue: true },
      _count: true,
      where: { isActive: true },
    });
    res.json({ stats });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
