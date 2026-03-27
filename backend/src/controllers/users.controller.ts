import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  fullName: z.string().max(100).optional(),
  email: z.string().email().optional(),
  neighborhood: z.string().max(50).optional(),
  district: z.string().max(50).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function getUserById(
  req: Request,
  res: Response
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      district: true,
      neighborhood: true,
      cityPoints: true,
      createdAt: true,
      _count: {
        select: {
          listings: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({ error: 'Kullanici bulunamadi' });
    return;
  }

  res.json(user);
}

export async function updateProfile(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Gecersiz veri',
      details: parsed.error.flatten(),
    });
    return;
  }

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: parsed.data,
    select: {
      id: true,
      phone: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      neighborhood: true,
      district: true,
      userType: true,
      cityPoints: true,
    },
  });

  res.json(user);
}

export async function getMyListings(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;

  const listings = await prisma.listing.findMany({
    where: { sellerId: req.user.userId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.listing.count({
    where: { sellerId: req.user.userId },
  });

  res.json({
    data: listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getLeaderboard(
  _req: Request,
  res: Response
): Promise<void> {
  const users = await prisma.user.findMany({
    orderBy: { cityPoints: 'desc' },
    take: 50,
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      district: true,
      cityPoints: true,
    },
  });

  res.json(users);
}
