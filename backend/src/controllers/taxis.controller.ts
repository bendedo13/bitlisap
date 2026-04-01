import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/taxis - all active taxi stands
export async function getTaxis(_req: Request, res: Response) {
  try {
    const taxis = await prisma.taxi.findMany({
      where: { isActive: true },
      orderBy: { district: 'asc' },
    });
    res.json({ taxis });
  } catch (error) {
    console.error('getTaxis error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// GET /api/taxis/:district
export async function getTaxisByDistrict(req: Request, res: Response) {
  try {
    const { district } = req.params;
    const taxis = await prisma.taxi.findMany({
      where: { isActive: true, district },
      orderBy: { name: 'asc' },
    });
    res.json({ taxis });
  } catch {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
