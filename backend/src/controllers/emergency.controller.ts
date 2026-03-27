import { Request, Response } from 'express';

// Bitlis nobetci eczane ve acil bilgileri
const EMERGENCY_NUMBERS = [
  { name: 'Acil Yardim', number: '112', icon: 'alert' },
  { name: 'Polis Imdat', number: '155', icon: 'shield' },
  { name: 'Jandarma', number: '156', icon: 'shield' },
  { name: 'Itfaiye', number: '110', icon: 'fire' },
  {
    name: 'Bitlis Devlet Hastanesi',
    number: '0434 226 1965',
    icon: 'hospital',
  },
  {
    name: 'Tatvan Devlet Hastanesi',
    number: '0434 827 1040',
    icon: 'hospital',
  },
  {
    name: 'Bitlis Il Jandarma',
    number: '0434 226 2626',
    icon: 'shield',
  },
  {
    name: 'Bitlis Belediyesi',
    number: '0434 226 1025',
    icon: 'building',
  },
  { name: 'AFAD', number: '122', icon: 'alert' },
  { name: 'ALO 182', number: '182', icon: 'phone' },
  { name: 'Saglik Danisma', number: '184', icon: 'heart' },
];

export async function getPharmacyDuty(
  _req: Request,
  res: Response
): Promise<void> {
  // Gercek entegrasyon icin: nosyapi.com veya
  // eczaneler.gen.tr API kullanilabilir
  res.json({
    message: 'Nobetci eczane servisi yaklasimda',
    emergencyNumbers: EMERGENCY_NUMBERS,
    tip: 'Nobetci eczane icin 182 numarasini arayabilirsiniz',
  });
}

export async function getEarthquakes(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    // AFAD / Kandilli deprem verileri
    const response = await fetch(
      'https://api.orhanaydogdu.com.tr/deprem/' +
      'kandilli/live'
    );
    const data = await response.json();
    res.json(data);
  } catch {
    res.json({
      error: 'Deprem verileri alinamadi',
      tip: 'AFAD uygulamasini kullanabilirsiniz',
      emergencyNumbers: EMERGENCY_NUMBERS,
    });
  }
}

export async function getEmergencyNumbers(
  _req: Request,
  res: Response
): Promise<void> {
  res.json(EMERGENCY_NUMBERS);
}
