import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createCampaignSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalı'),
  description: z.string().optional(),
  discount: z.string().optional(),
  imageUrl: z.string().url().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  businessId: z.string().uuid(),
});

// GET /api/campaigns - active campaigns
export async function getCampaigns(_req: Request, res: Response) {
  try {
    const now = new Date();
    const campaigns = await prisma.campaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            category: true,
            district: true,
            logoUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ campaigns });
  } catch (error) {
    console.error('getCampaigns error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// POST /api/campaigns - create campaign (business only)
export async function createCampaign(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const data = createCampaignSchema.parse(req.body);

    // Verify business belongs to user
    const business = await prisma.business.findFirst({
      where: { id: data.businessId, ownerId: userId },
    });
    if (!business) {
      return res.status(403).json({ message: 'Bu işletmeye erişim yetkiniz yok' });
    }

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description,
        discount: data.discount,
        imageUrl: data.imageUrl,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        businessId: data.businessId,
      },
    });
    res.status(201).json({ campaign });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('createCampaign error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// DELETE /api/campaigns/:id
export async function deleteCampaign(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { business: true },
    });
    if (!campaign) return res.status(404).json({ message: 'Kampanya bulunamadı' });
    if (campaign.business.ownerId !== userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.userType !== 'ADMIN') {
        return res.status(403).json({ message: 'Yetki yok' });
      }
    }

    await prisma.campaign.delete({ where: { id } });
    res.json({ message: 'Kampanya silindi' });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
