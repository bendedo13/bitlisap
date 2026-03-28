import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { newsListQuerySchema } from '../validation/schemas';
import { notifyUsersNewNews } from '../services/push.service';

const prisma = new PrismaClient();

type NewsListQuery = z.infer<typeof newsListQuerySchema>;

export async function getNewsList(
  req: Request,
  res: Response
): Promise<void> {
  const { page, limit, category } =
    req.validatedQuery as NewsListQuery;

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
  const { id } = req.validatedParams as { id: string };
  const news = await prisma.news.update({
    where: { id },
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

  const body = req.body as {
    title: string;
    content?: string;
    summary?: string;
    category?: string;
    thumbnailUrl?: string;
    sourceUrl?: string;
    isBreaking?: boolean;
    isOfficial?: boolean;
  };

  const news = await prisma.news.create({
    data: {
      title: body.title,
      content: body.content,
      summary: body.summary,
      category: body.category,
      thumbnailUrl: body.thumbnailUrl,
      sourceUrl: body.sourceUrl,
      isBreaking: body.isBreaking,
      isOfficial: body.isOfficial,
      authorId: req.user.userId,
    },
  });

  void notifyUsersNewNews(news.title, news.id).catch(() => {});

  res.status(201).json(news);
}

export async function likeNews(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.validatedParams as { id: string };
  const news = await prisma.news.update({
    where: { id },
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
