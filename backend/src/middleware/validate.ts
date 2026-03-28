import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}

export function validateBody<T extends ZodType>(schema: T) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Gecersiz veri',
        details: result.error.flatten(),
      });
      return;
    }
    req.body = result.data as Request['body'];
    next();
  };
}

export function validateQuery<T extends ZodType>(schema: T) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        error: 'Gecersiz sorgu parametreleri',
        details: result.error.flatten(),
      });
      return;
    }
    req.validatedQuery = result.data;
    next();
  };
}

export function validateParams<T extends ZodType>(schema: T) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        error: 'Gecersiz URL parametreleri',
        details: result.error.flatten(),
      });
      return;
    }
    req.validatedParams = result.data;
    next();
  };
}

export const uuidParamSchema = z.object({
  id: z.string().uuid(),
});

export const listingIdParamSchema = z.object({
  listingId: z.string().uuid(),
});
