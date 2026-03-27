import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  getNearbyBusinesses,
  addReview,
} from '../controllers/businesses.controller';

const router = Router();

router.get('/', getBusinesses);
router.get('/nearby', getNearbyBusinesses);
router.get('/:id', getBusinessById);
router.post('/', authenticate, createBusiness);
router.put('/:id', authenticate, updateBusiness);
router.post('/:id/review', authenticate, addReview);

export default router;
