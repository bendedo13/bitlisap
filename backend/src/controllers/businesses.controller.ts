import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import {
  businessesQuerySchema,
  nearbyQuerySchema,
} from '../validation/schemas';

const prisma = new PrismaClient();

type BusinessesQuery = z.infer<typeof businessesQuerySchema>;
type NearbyQuery = z.infer<typeof nearbyQuerySchema>;

export async function getBusinesses(
  req: Request,
  res: Response
): Promise<void> {
  const { page, limit, category, district } =
    req.validatedQuery as BusinessesQuery;

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
  const { id } = req.validatedParams as { id: string };
  const business = await prisma.business.findUnique({
    where: { id },
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

  const body = req.body as {
    name: string;
    category?: string;
    subcategory?: string;
    description?: string;
    address?: string;
    district?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    whatsapp?: string;
    website?: string;
    instagram?: string;
    workingHours?: Record<string, string>;
    photos?: string[];
  };

  const business = await prisma.business.create({
    data: {
      name: body.name,
      category: body.category,
      subcategory: body.subcategory,
      description: body.description,
      address: body.address,
      district: body.district,
      latitude: body.latitude,
      longitude: body.longitude,
      phone: body.phone,
      whatsapp: body.whatsapp,
      website: body.website,
      instagram: body.instagram,
      workingHours: body.workingHours,
      photos: body.photos ?? [],
      ownerId: req.user.userId,
    },
  });

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

  const { id } = req.validatedParams as { id: string };
  const business = await prisma.business.findUnique({
    where: { id },
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

  const body = req.body as Partial<{
    name: string;
    category: string;
    subcategory: string;
    description: string;
    address: string;
    district: string;
    latitude: number;
    longitude: number;
    phone: string;
    whatsapp: string;
    website: string;
    instagram: string;
    workingHours: Record<string, string>;
    photos: string[];
  }>;

  const updated = await prisma.business.update({
    where: { id },
    data: body,
  });

  res.json(updated);
}

export async function getNearbyBusinesses(
  req: Request,
  res: Response
): Promise<void> {
  const { lat, lng, radius } = req.validatedQuery as NearbyQuery;

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

  const body = req.body as {
    rating: number;
    comment?: string;
    photos?: string[];
  };

  const { id: businessId } = req.validatedParams as {
    id: string;
  };
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
      rating: body.rating,
      comment: body.comment,
      photos: body.photos ?? [],
    },
  });

  const avgResult = await prisma.review.aggregate({
    where: {
      targetId: businessId,
      targetType: 'BUSINESS',
    },
    _avg: { rating: true },
    _count: { _all: true },
  });

  await prisma.business.update({
    where: { id: businessId },
    data: {
      rating: avgResult._avg.rating ?? 0,
      reviewCount: avgResult._count._all,
    },
  });

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
