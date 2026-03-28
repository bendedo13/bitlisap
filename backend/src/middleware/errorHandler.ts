import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { config } from '../config';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundHandler(
  _req: Request,
  res: Response
): void {
  res.status(404).json({ error: 'Endpoint bulunamadi' });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(`${err.statusCode} ${err.message}`);
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    logger.warn('Zod validation', { issues: err.issues });
    res.status(400).json({
      error: 'Dogrulama hatasi',
      details: err.flatten(),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error('Prisma error', { code: err.code, meta: err.meta });
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'Bu kayit zaten mevcut',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Kayit bulunamadi' });
      return;
    }
    res.status(400).json({ error: 'Veritabani islemi basarisiz' });
    return;
  }

  logger.error('Unhandled error', { stack: err.stack, message: err.message });

  res.status(500).json({
    error: 'Sunucu hatasi',
    ...(config.NODE_ENV === 'development' && {
      message: err.message,
    }),
  });
}
