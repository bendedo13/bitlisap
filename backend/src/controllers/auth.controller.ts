import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

const otpStore = new Map<string, {
  code: string;
  expiresAt: number;
}>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000)
    .toString();
}

function generateToken(
  userId: string,
  userType: string
): string {
  const signOpts: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(
    { userId, userType },
    config.JWT_SECRET,
    signOpts
  );
}

function generateRefreshToken(userId: string): string {
  const refreshOpts: SignOptions = {
    expiresIn:
      config.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(
    { userId, type: 'refresh' },
    config.JWT_SECRET,
    refreshOpts
  );
}

export async function sendOtp(
  req: Request,
  res: Response
): Promise<void> {
  const { phone } = req.body as { phone: string };
  const code = generateOtp();

  otpStore.set(phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  if (
    config.TWILIO_ACCOUNT_SID &&
    config.TWILIO_AUTH_TOKEN
  ) {
    try {
      const twilio = require('twilio');
      const client = twilio(
        config.TWILIO_ACCOUNT_SID,
        config.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `Bitlis Sehrim dogrulama kodu: ${code}`,
        from: config.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } catch (err) {
      console.error('SMS gonderilemedi:', err);
    }
  }

  if (config.NODE_ENV === 'development') {
    res.json({
      message: 'OTP gonderildi',
      code,
    });
    return;
  }

  res.json({ message: 'OTP gonderildi' });
}

export async function verifyOtp(
  req: Request,
  res: Response
): Promise<void> {
  const { phone, code } = req.body as {
    phone: string;
    code: string;
  };
  const stored = otpStore.get(phone);

  if (!stored) {
    res.status(400).json({ error: 'OTP bulunamadi' });
    return;
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    res.status(400).json({ error: 'OTP suresi doldu' });
    return;
  }

  if (stored.code !== code) {
    res.status(400).json({ error: 'Yanlis OTP kodu' });
    return;
  }

  otpStore.delete(phone);

  let user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        isVerified: true,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeen: new Date() },
    });
  }

  const token = generateToken(user.id, user.userType);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    token,
    refreshToken,
    user: {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      district: user.district,
      userType: user.userType,
      cityPoints: user.cityPoints,
    },
  });
}

export async function refreshToken(
  req: Request,
  res: Response
): Promise<void> {
  const { refreshToken: token } = req.body as {
    refreshToken: string;
  };
  if (!token) {
    res.status(400).json({ error: 'Refresh token gerekli' });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      config.JWT_SECRET
    ) as { userId: string; type: string };

    if (payload.type !== 'refresh') {
      res.status(401).json({ error: 'Gecersiz token tipi' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      res.status(401).json({ error: 'Kullanici bulunamadi' });
      return;
    }

    const newToken = generateToken(user.id, user.userType);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch {
    res.status(401).json({ error: 'Gecersiz refresh token' });
  }
}

export async function getMe(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Yetkisiz' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      phone: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      neighborhood: true,
      district: true,
      userType: true,
      isVerified: true,
      cityPoints: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: 'Kullanici bulunamadi' });
    return;
  }

  res.json(user);
}
