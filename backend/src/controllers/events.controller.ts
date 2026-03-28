import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { z } from 'zod';
import { paginationQuerySchema } from '../validation/schemas';

const prisma = new PrismaClient();

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export async function getEvents(
  req: Request,
  res: Response
): Promise<void> {
  const { page, limit } = req.validatedQuery as PaginationQuery;

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
  const { id } = req.validatedParams as { id: string };
  const event = await prisma.event.findUnique({
    where: { id },
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

  const body = req.body as {
    title: string;
    description?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    startsAt: string;
    endsAt?: string;
    category?: string;
    isFree?: boolean;
    ticketPrice?: number;
    maxAttendees?: number;
    coverImage?: string;
  };

  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      location: body.location,
      latitude: body.latitude,
      longitude: body.longitude,
      startsAt: new Date(body.startsAt),
      endsAt: body.endsAt ? new Date(body.endsAt) : null,
      category: body.category,
      isFree: body.isFree ?? true,
      ticketPrice: body.ticketPrice,
      maxAttendees: body.maxAttendees,
      coverImage: body.coverImage,
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

  const { id } = req.validatedParams as { id: string };
  const event = await prisma.event.findUnique({
    where: { id },
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
    where: { id },
    data: { attendeeCount: { increment: 1 } },
  });

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
