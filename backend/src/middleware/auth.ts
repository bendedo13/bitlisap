import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthPayload {
  userId: string;
  userType: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token gerekli' });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(
      token,
      config.JWT_SECRET
    ) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Gecersiz token' });
  }
}

export function requireRole(...roles: string[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !roles.includes(req.user.userType)) {
      res.status(403).json({ error: 'Yetkiniz yok' });
      return;
    }
    next();
  };
}
