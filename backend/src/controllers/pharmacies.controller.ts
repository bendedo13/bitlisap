import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/pharmacies - all pharmacies
export async function getPharmacies(_req: Request, res: Response) {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      where: { isActive: true },
      orderBy: { district: 'asc' },
    });
    res.json({ pharmacies });
  } catch (error) {
    console.error('getPharmacies error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}

// GET /api/pharmacies/duty - today's duty pharmacies
export async function getDutyPharmacies(_req: Request, res: Response) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const duties = await prisma.pharmacy.findMany({
      where: {
        isActive: true,
        isDutyToday: true,
      },
      orderBy: { district: 'asc' },
    });
    res.json({ pharmacies: duties });
  } catch (error) {
    console.error('getDutyPharmacies error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
