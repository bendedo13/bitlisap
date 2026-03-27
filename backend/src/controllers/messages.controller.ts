import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getConversations(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { has: req.user.userId },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          photos: true,
          price: true,
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  res.json(conversations);
}

export async function getMessages(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const conversation = await prisma.conversation.findUnique(
    { where: { id: req.params.id } }
  );

  if (
    !conversation ||
    !conversation.participants.includes(req.user.userId)
  ) {
    res.status(404).json({
      error: 'Konusma bulunamadi',
    });
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;

  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      sender: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  });

  // Mesajlari okundu isaretle
  await prisma.message.updateMany({
    where: {
      conversationId: req.params.id,
      receiverId: req.user.userId,
      isRead: false,
    },
    data: { isRead: true },
  });

  res.json(messages);
}

export async function startConversation(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const listing = await prisma.listing.findUnique({
    where: { id: req.params.listingId },
  });

  if (!listing) {
    res.status(404).json({ error: 'Ilan bulunamadi' });
    return;
  }

  // Mevcut konusma var mi kontrol et
  const existing = await prisma.conversation.findFirst({
    where: {
      listingId: listing.id,
      participants: {
        hasEvery: [req.user.userId, listing.sellerId],
      },
    },
  });

  if (existing) {
    res.json(existing);
    return;
  }

  const conversation = await prisma.conversation.create({
    data: {
      listingId: listing.id,
      participants: [req.user.userId, listing.sellerId],
    },
  });

  res.status(201).json(conversation);
}
