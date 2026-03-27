import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createBusinessSchema = z.object({
  name: z.string().min(2).max(150),
  category: z.string().max(50).optional(),
  subcategory: z.string().max(50).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  district: z.string().max(50).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  website: z.string().url().max(200).optional(),
  instagram: z.string().max(100).optional(),
  workingHours: z.record(z.string()).optional(),
  photos: z.array(z.string().url()).max(10).optional(),
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  photos: z.array(z.string().url()).max(5).optional(),
});

export async function getBusinesses(
  req: Request,
  res: Response
): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const { category, district } = req.query;

  const where: Record<string, unknown> = {
    isActive: true,
  };
  if (category) where.category = category;
  if (district) where.district = district;

  const [data, total] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy: [
        { isPremium: 'desc' },
        { rating: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        owner: {
          select: { id: true, fullName: true },
        },
      },
    }),
    prisma.business.count({ where }),
  ]);

  res.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getBusinessById(
  req: Request,
  res: Response
): Promise<void> {
  const business = await prisma.business.findUnique({
    where: { id: req.params.id },
    include: {
      owner: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!business) {
    res.status(404).json({
      error: 'Isletme bulunamadi',
    });
    return;
  }

  res.json(business);
}

export async function createBusiness(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const parsed = createBusinessSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Gecersiz veri',
      details: parsed.error.flatten(),
    });
    return;
  }

  const business = await prisma.business.create({
    data: {
      ...parsed.data,
      photos: parsed.data.photos ?? [],
      ownerId: req.user.userId,
    },
  });

  // Kullanici tipini BUSINESS yap
  await prisma.user.update({
    where: { id: req.user.userId },
    data: { userType: 'BUSINESS' },
  });

  res.status(201).json(business);
}

export async function updateBusiness(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const business = await prisma.business.findUnique({
    where: { id: req.params.id },
  });

  if (!business) {
    res.status(404).json({
      error: 'Isletme bulunamadi',
    });
    return;
  }

  if (
    business.ownerId !== req.user.userId &&
    req.user.userType !== 'ADMIN'
  ) {
    res.status(403).json({ error: 'Yetkiniz yok' });
    return;
  }

  const parsed = createBusinessSchema
    .partial()
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Gecersiz veri',
      details: parsed.error.flatten(),
    });
    return;
  }

  const updated = await prisma.business.update({
    where: { id: req.params.id },
    data: parsed.data,
  });

  res.json(updated);
}

export async function getNearbyBusinesses(
  req: Request,
  res: Response
): Promise<void> {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const radius = parseFloat(
    req.query.radius as string
  ) || 5; // km

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({
      error: 'lat ve lng parametreleri gerekli',
    });
    return;
  }

  // Haversine formulu ile yakin isletmeleri bul
  const businesses = await prisma.$queryRaw`
    SELECT *,
      (6371 * acos(
        cos(radians(${lat}))
        * cos(radians(latitude))
        * cos(radians(longitude) - radians(${lng}))
        + sin(radians(${lat}))
        * sin(radians(latitude))
      )) AS distance
    FROM businesses
    WHERE is_active = true
      AND latitude IS NOT NULL
      AND longitude IS NOT NULL
    HAVING distance < ${radius}
    ORDER BY distance
    LIMIT 50
  `;

  res.json(businesses);
}

export async function addReview(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Gecersiz veri',
      details: parsed.error.flatten(),
    });
    return;
  }

  const businessId = req.params.id;
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    res.status(404).json({
      error: 'Isletme bulunamadi',
    });
    return;
  }

  const review = await prisma.review.create({
    data: {
      userId: req.user.userId,
      targetId: businessId,
      targetType: 'BUSINESS',
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      photos: parsed.data.photos ?? [],
    },
  });

  // Ortalama puani guncelle
  const avgResult = await prisma.review.aggregate({
    where: {
      targetId: businessId,
      targetType: 'BUSINESS',
    },
    _avg: { rating: true },
    _count: true,
  });

  await prisma.business.update({
    where: { id: businessId },
    data: {
      rating: avgResult._avg.rating ?? 0,
      reviewCount: avgResult._count,
    },
  });

  // Puan ekle
  await prisma.pointTransaction.create({
    data: {
      userId: req.user.userId,
      points: 5,
      action: 'review',
      description: 'Yorum yapma puani',
    },
  });

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { cityPoints: { increment: 5 } },
  });

  res.status(201).json(review);
}
