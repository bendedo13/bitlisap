import { Request, Response } from 'express';
import { PrismaClient, ListingStatus } from '@prisma/client';
import type { z } from 'zod';
import { listingsQuerySchema } from '../validation/schemas';

const prisma = new PrismaClient();

type ListingsQuery = z.infer<typeof listingsQuerySchema>;

export async function getListings(
  req: Request,
  res: Response
): Promise<void> {
  const { page, limit, category, district, sort } =
    req.validatedQuery as ListingsQuery;

  const where: Record<string, unknown> = {
    status: 'ACTIVE',
  };
  if (category) where.category = category;
  if (district) where.district = district;

  let orderBy: Record<string, string> = {
    createdAt: 'desc',
  };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  const [data, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: [
        { isPremium: 'desc' },
        orderBy,
      ],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            district: true,
          },
        },
      },
    }),
    prisma.listing.count({ where }),
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

export async function getListingById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.validatedParams as { id: string };
  const listing = await prisma.listing.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    include: {
      seller: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          phone: true,
          district: true,
        },
      },
    },
  });

  if (!listing) {
    res.status(404).json({ error: 'Ilan bulunamadi' });
    return;
  }

  res.json(listing);
}

export async function createListing(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const body = req.body as {
    title: string;
    description?: string;
    category?: string;
    subcategory?: string;
    price?: number;
    isNegotiable?: boolean;
    photos?: string[];
    district?: string;
  };

  const listing = await prisma.listing.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory,
      price: body.price ?? null,
      isNegotiable: body.isNegotiable ?? true,
      photos: body.photos ?? [],
      district: body.district,
      sellerId: req.user.userId,
    },
  });

  await prisma.pointTransaction.create({
    data: {
      userId: req.user.userId,
      points: 10,
      action: 'post_listing',
      description: 'Ilan olusturma puani',
    },
  });

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { cityPoints: { increment: 10 } },
  });

  res.status(201).json(listing);
}

export async function updateListing(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const { id } = req.validatedParams as { id: string };
  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    res.status(404).json({ error: 'Ilan bulunamadi' });
    return;
  }

  if (
    listing.sellerId !== req.user.userId &&
    req.user.userType !== 'ADMIN'
  ) {
    res.status(403).json({ error: 'Yetkiniz yok' });
    return;
  }

  const body = req.body as Partial<{
    title: string;
    description: string;
    category: string;
    subcategory: string;
    price: number;
    isNegotiable: boolean;
    photos: string[];
    district: string;
    status: ListingStatus;
  }>;

  const updated = await prisma.listing.update({
    where: { id },
    data: body,
  });

  res.json(updated);
}

export async function deleteListing(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const { id } = req.validatedParams as { id: string };
  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    res.status(404).json({ error: 'Ilan bulunamadi' });
    return;
  }

  if (
    listing.sellerId !== req.user.userId &&
    req.user.userType !== 'ADMIN'
  ) {
    res.status(403).json({ error: 'Yetkiniz yok' });
    return;
  }

  await prisma.listing.update({
    where: { id },
    data: { status: 'DELETED' },
  });

  res.json({ message: 'Ilan silindi' });
}

export async function premiumListing(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const { days } = req.body as { days: 3 | 7 | 30 };
  const { id } = req.validatedParams as { id: string };

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing || listing.sellerId !== req.user.userId) {
    res.status(404).json({ error: 'Ilan bulunamadi' });
    return;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      isPremium: true,
      premiumExpiresAt: expiresAt,
    },
  });

  res.json(updated);
}
