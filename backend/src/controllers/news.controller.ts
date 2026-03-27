import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createNewsSchema = z.object({
  title: z.string().min(3).max(300),
  content: z.string().optional(),
  summary: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  thumbnailUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  isBreaking: z.boolean().optional(),
  isOfficial: z.boolean().optional(),
});

export async function getNewsList(
  req: Request,
  res: Response
): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const category = req.query.category as string;

  const where = category ? { category } : {};

  const [data, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.news.count({ where }),
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

export async function getNewsById(
  req: Request,
  res: Response
): Promise<void> {
  const news = await prisma.news.update({
    where: { id: req.params.id },
    data: { viewCount: { increment: 1 } },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!news) {
    res.status(404).json({ error: 'Haber bulunamadi' });
    return;
  }

  res.json(news);
}

export async function createNews(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const parsed = createNewsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Gecersiz veri',
      details: parsed.error.flatten(),
    });
    return;
  }

  const news = await prisma.news.create({
    data: {
      ...parsed.data,
      authorId: req.user.userId,
    },
  });

  res.status(201).json(news);
}

export async function likeNews(
  req: Request,
  res: Response
): Promise<void> {
  const news = await prisma.news.update({
    where: { id: req.params.id },
    data: { likeCount: { increment: 1 } },
  });

  res.json({ likeCount: news.likeCount });
}

export async function getBreakingNews(
  _req: Request,
  res: Response
): Promise<void> {
  const news = await prisma.news.findMany({
    where: { isBreaking: true },
    orderBy: { publishedAt: 'desc' },
    take: 5,
  });

  res.json(news);
}
