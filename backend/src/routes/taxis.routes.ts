import { Router } from 'express';
import { getTaxis, getTaxisByDistrict } from '../controllers/taxis.controller';

const router = Router();

router.get('/', getTaxis);
router.get('/district/:district', getTaxisByDistrict);

export default router;
