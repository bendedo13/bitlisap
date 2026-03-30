import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

// ─── Validation Schemas ───
const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalı'),
  phone: z.string().optional(),
  age: z.number().int().min(13).max(120).optional(),
  occupation: z.string().max(100).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  district: z.string().optional(),
  bio: z.string().max(500).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(1, 'Şifre gerekli'),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  age: z.number().int().min(13).max(120).optional(),
  occupation: z.string().max(100).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  district: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

function generateTokens(userId: string, userType: string) {
  const token = jwt.sign(
    { userId, userType },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
  return { token, refreshToken };
}

function sanitizeUser(user: any) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// ─── Register ───
export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ message: 'Bu e-posta adresi zaten kayıtlı' });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        phone: data.phone,
        age: data.age,
        occupation: data.occupation,
        gender: data.gender,
        district: data.district,
        bio: data.bio,
      },
    });

    // Welcome points
    await prisma.pointTransaction.create({
      data: {
        userId: user.id,
        points: 50,
        reason: 'WELCOME',
        description: 'Hoş geldin bonusu! Bitlis Şehrim\'e katıldın.',
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { cityPoints: { increment: 50 } },
    });

    const tokens = generateTokens(user.id, user.userType);

    res.status(201).json({
      message: 'Hesap başarıyla oluşturuldu',
      user: sanitizeUser(user),
      ...tokens,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message, errors: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Login ───
export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Hesabınız devre dışı bırakılmış' });
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı' });
    }

    // Update online status
    await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true, lastSeen: new Date() },
    });

    const tokens = generateTokens(user.id, user.userType);

    res.json({
      message: 'Giriş başarılı',
      user: sanitizeUser(user),
      ...tokens,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Update Profile ───
export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).auth.userId;
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json({ user: sanitizeUser(user) });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Refresh Token ───
export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return res.status(400).json({ message: 'Refresh token gerekli' });

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Geçersiz token' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    const tokens = generateTokens(user.id, user.userType);
    res.json(tokens);
  } catch {
    res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
  }
}

// ─── Get Me ───
export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as any).auth.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { listings: true, reviews: true, sentMessages: true },
        },
      },
    });
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    res.json({ user: sanitizeUser(user) });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// ─── Logout (set offline) ───
export async function logout(req: Request, res: Response) {
  try {
    const userId = (req as any).auth.userId;
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: false, lastSeen: new Date() },
    });
    res.json({ message: 'Çıkış yapıldı' });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
