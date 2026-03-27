import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  category: z.string().max(50).optional(),
  isFree: z.boolean().optional(),
  ticketPrice: z.number().positive().optional(),
  maxAttendees: z.number().int().positive().optional(),
  coverImage: z.string().url().optional(),
});

export async function getEvents(
  req: Request,
  res: Response
): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;

  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where: {
        status: { in: ['UPCOMING', 'ONGOING'] },
      },
      orderBy: { startsAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        organizer: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.event.count({
      where: {
        status: { in: ['UPCOMING', 'ONGOING'] },
      },
    }),
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

export async function getEventById(
  req: Request,
  res: Response
): Promise<void> {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      organizer: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!event) {
    res.status(404).json({
      error: 'Etkinlik bulunamadi',
    });
    return;
  }

  res.json(event);
}

export async function createEvent(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Gecersiz veri',
      details: parsed.error.flatten(),
    });
    return;
  }

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: parsed.data.endsAt
        ? new Date(parsed.data.endsAt)
        : null,
      organizerId: req.user.userId,
    },
  });

  res.status(201).json(event);
}

export async function attendEvent(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
  });

  if (!event) {
    res.status(404).json({
      error: 'Etkinlik bulunamadi',
    });
    return;
  }

  if (
    event.maxAttendees &&
    event.attendeeCount >= event.maxAttendees
  ) {
    res.status(400).json({
      error: 'Etkinlik kapasitesi doldu',
    });
    return;
  }

  const updated = await prisma.event.update({
    where: { id: req.params.id },
    data: { attendeeCount: { increment: 1 } },
  });

  // Puan ekle
  await prisma.pointTransaction.create({
    data: {
      userId: req.user.userId,
      points: 3,
      action: 'event_attend',
      description: 'Etkinlik katilim puani',
    },
  });

  await prisma.user.update({
    where: { id: req.user.userId },
    data: { cityPoints: { increment: 3 } },
  });

  res.json(updated);
}
