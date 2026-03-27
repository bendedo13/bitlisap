import { Request, Response } from 'express';
import { PrismaClient, ListingStatus } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createListingSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  category: z.string().max(50).optional(),
  subcategory: z.string().max(50).optional(),
  price: z.number().positive().optional(),
  isNegotiable: z.boolean().optional(),
  photos: z.array(z.string().url()).max(10).optional(),
  district: z.string().max(50).optional(),
});

const updateListingSchema = createListingSchema.partial()
  .extend({
    status: z.nativeEnum(ListingStatus).optional(),
  });

export async function getListings(
  req: Request,
  res: Response
): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const { category, district, sort } = req.query;

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
  const listing = await prisma.listing.update({
    where: { id: req.params.id },
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

  const parsed = createListingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Gecersiz veri',
      details: parsed.error.flatten(),
    });
    return;
  }

  const listing = await prisma.listing.create({
    data: {
      ...parsed.data,
      price: parsed.data.price ?? null,
      photos: parsed.data.photos ?? [],
      sellerId: req.user.userId,
    },
  });

  // Puan ekle
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

  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
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

  const parsed = updateListingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Gecersiz veri',
      details: parsed.error.flatten(),
    });
    return;
  }

  const updated = await prisma.listing.update({
    where: { id: req.params.id },
    data: parsed.data,
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

  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
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
    where: { id: req.params.id },
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

  const { days } = req.body;
  const validDays = [3, 7, 30];
  if (!validDays.includes(days)) {
    res.status(400).json({
      error: 'Gecersiz sure (3, 7 veya 30 gun)',
    });
    return;
  }

  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
  });

  if (!listing || listing.sellerId !== req.user.userId) {
    res.status(404).json({ error: 'Ilan bulunamadi' });
    return;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const updated = await prisma.listing.update({
    where: { id: req.params.id },
    data: {
      isPremium: true,
      premiumExpiresAt: expiresAt,
    },
  });

  res.json(updated);
}
