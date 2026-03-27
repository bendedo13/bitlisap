import { Router } from 'express';
import {
  getPharmacyDuty,
  getEarthquakes,
  getEmergencyNumbers,
} from '../controllers/emergency.controller';

const router = Router();

router.get('/pharmacy', getPharmacyDuty);
router.get('/earthquake', getEarthquakes);
router.get('/numbers', getEmergencyNumbers);

export default router;
