import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { searchQuerySchema } from '../validation/schemas';

const prisma = new PrismaClient();

type SearchQuery = z.infer<typeof searchQuerySchema>;

export async function globalSearch(
  req: Request,
  res: Response
): Promise<void> {
  const { q, limit } = req.validatedQuery as SearchQuery;
  const term = q.trim();
  const mode = 'insensitive' as const;

  const [news, listings, businesses] = await Promise.all([
    prisma.news.findMany({
      where: {
        OR: [
          { title: { contains: term, mode } },
          { summary: { contains: term, mode } },
          { content: { contains: term, mode } },
        ],
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        thumbnailUrl: true,
        category: true,
        publishedAt: true,
      },
    }),
    prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { title: { contains: term, mode } },
          { description: { contains: term, mode } },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        price: true,
        district: true,
        category: true,
        photos: true,
        createdAt: true,
      },
    }),
    prisma.business.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: term, mode } },
          { description: { contains: term, mode } },
          { category: { contains: term, mode } },
        ],
      },
      take: limit,
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        name: true,
        category: true,
        district: true,
        photos: true,
        rating: true,
      },
    }),
  ]);

  res.json({
    query: term,
    news,
    listings,
    businesses,
  });
}
