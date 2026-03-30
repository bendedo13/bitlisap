import { Router } from 'express';
import {
  createPartnership,
  getPartnerships,
  recordPartnerOrder,
  getPartnershipStats,
} from '../controllers/partnerships.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getPartnerships);
router.post('/', authenticate, requireRole('ADMIN'), createPartnership);
router.post('/:id/order', authenticate, recordPartnerOrder);
router.get('/stats', authenticate, requireRole('ADMIN'), getPartnershipStats);

export default router;
