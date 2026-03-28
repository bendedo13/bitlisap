import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { paginationQuerySchema } from '../validation/schemas';

const prisma = new PrismaClient();

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export async function getNotifications(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const { page, limit } = req.validatedQuery as PaginationQuery;

  const [data, total, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({
      where: { userId: req.user.userId },
    }),
    prisma.notification.count({
      where: {
        userId: req.user.userId,
        isRead: false,
      },
    }),
  ]);

  res.json({
    data,
    unreadCount: unread,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function markAsRead(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const { id } = req.validatedParams as { id: string };

  const notif = await prisma.notification.findFirst({
    where: { id, userId: req.user.userId },
  });

  if (!notif) {
    res.status(404).json({ error: 'Bildirim bulunamadi' });
    return;
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  res.json({ message: 'Okundu' });
}

export async function saveFcmToken(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const { token } = req.body as { token: string };

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { fcmToken: token },
  });

  res.json({ message: 'Token kaydedildi' });
}
