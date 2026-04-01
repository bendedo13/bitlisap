import { Router } from 'express';
import { getPharmacies, getDutyPharmacies } from '../controllers/pharmacies.controller';

const router = Router();

router.get('/', getPharmacies);
router.get('/duty', getDutyPharmacies);

export default router;
