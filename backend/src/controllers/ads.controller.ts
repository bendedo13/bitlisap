import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createAdSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  targetUrl: z.string().url().optional(),
  placement: z.enum(['HOME_BANNER', 'NEWS_INLINE', 'MARKET_TOP', 'MAP_FEATURED', 'SPLASH_SCREEN', 'CATEGORY_SPONSOR']),
  totalBudget: z.number().min(50),
  dailyBudget: z.number().min(10).optional(),
  startDate: z.string(),
  endDate: z.string(),
});

// ─── Create Ad ───
export async function createAd(req: Request, res: Response) {
  try {
    const userId = (req as any).auth.userId;
    const data = createAdSchema.parse(req.body);

    // Calculate cost per view based on placement
    const cpcRates: Record<string, number> = {
      HOME_BANNER: 0.50,
      NEWS_INLINE: 0.30,
      MARKET_TOP: 0.40,
      MAP_FEATURED: 0.35,
      SPLASH_SCREEN: 0.75,
      CATEGORY_SPONSOR: 0.25,
    };

    const ad = await prisma.advertisement.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl,
        placement: data.placement,
        totalBudget: data.totalBudget,
        dailyBudget: data.dailyBudget,
        costPerClick: cpcRates[data.placement] || 0.30,
        costPerView: (cpcRates[data.placement] || 0.30) / 10,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        advertiserId: userId,
      },
    });

    res.status(201).json({ ad, message: 'Reklam talebi oluşturuldu. Onay bekleniyor.' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Get My Ads ───
export async function getMyAds(req: Request, res: Response) {
  try {
    const userId = (req as any).auth.userId;
    const ads = await prisma.advertisement.findMany({
      where: { advertiserId: userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ ads });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Get Active Ads (Public) ───
export async function getActiveAds(req: Request, res: Response) {
  try {
    const placement = req.query.placement as string;
    const where: any = {
      status: 'ACTIVE',
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    };
    if (placement) where.placement = placement;

    const ads = await prisma.advertisement.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        targetUrl: true,
        placement: true,
      },
      orderBy: { totalBudget: 'desc' },
      take: 5,
    });
    res.json({ ads });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Track Ad Click ───
export async function trackAdClick(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ad = await prisma.advertisement.update({
      where: { id },
      data: {
        clicks: { increment: 1 },
        revenue: { increment: 0 }, // will be calculated from costPerClick
      },
    });
    // Update revenue from CPC
    if (ad.costPerClick) {
      await prisma.advertisement.update({
        where: { id },
        data: { revenue: { increment: ad.costPerClick } },
      });
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Track Ad Impression ───
export async function trackAdImpression(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.advertisement.update({
      where: { id },
      data: {
        impressions: { increment: 1 },
      },
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Admin: Approve/Reject Ad ───
export async function updateAdStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['ACTIVE', 'PAUSED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum' });
    }
    const ad = await prisma.advertisement.update({
      where: { id },
      data: { status },
    });
    res.json({ ad });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Admin: Revenue Dashboard ───
export async function getRevenueDashboard(req: Request, res: Response) {
  try {
    // Ad Revenue
    const adRevenue = await prisma.advertisement.aggregate({
      _sum: { revenue: true, totalBudget: true },
      _count: true,
      where: { status: 'ACTIVE' },
    });

    // Partnership Revenue
    const partnershipRevenue = await prisma.partnership.aggregate({
      _sum: { totalCommission: true, totalRevenue: true, fixedMonthlyFee: true },
      _count: true,
      where: { isActive: true },
    });

    // Premium Users Count
    const premiumUsers = await prisma.user.count({
      where: { subscriptionPlan: { not: 'FREE' } },
    });

    // Total users
    const totalUsers = await prisma.user.count();

    // Active listings
    const activeListings = await prisma.listing.count({ where: { status: 'ACTIVE' } });

    res.json({
      revenue: {
        ads: {
          totalBudget: adRevenue._sum.totalBudget || 0,
          earned: adRevenue._sum.revenue || 0,
          activeCount: adRevenue._count,
        },
        partnerships: {
          totalRevenue: partnershipRevenue._sum.totalRevenue || 0,
          totalCommission: partnershipRevenue._sum.totalCommission || 0,
          monthlyFees: partnershipRevenue._sum.fixedMonthlyFee || 0,
          activeCount: partnershipRevenue._count,
        },
        premium: {
          subscriberCount: premiumUsers,
        },
      },
      stats: {
        totalUsers,
        activeListings,
        premiumUsers,
      },
    });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
