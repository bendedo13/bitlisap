import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getNotifications(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = 30;

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

  await prisma.notification.update({
    where: { id: req.params.id },
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

  const { token } = req.body;
  if (!token) {
    res.status(400).json({
      error: 'FCM token gerekli',
    });
    return;
  }

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { fcmToken: token },
  });

  res.json({ message: 'Token kaydedildi' });
}
