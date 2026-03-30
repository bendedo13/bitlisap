import { Router } from 'express';
import {
  createAd,
  getMyAds,
  getActiveAds,
  trackAdClick,
  trackAdImpression,
  updateAdStatus,
  getRevenueDashboard,
} from '../controllers/ads.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Public
router.get('/active', getActiveAds);
router.post('/:id/click', trackAdClick);
router.post('/:id/impression', trackAdImpression);

// Authenticated
router.post('/', authenticate, createAd);
router.get('/my', authenticate, getMyAds);

// Admin
router.put('/:id/status', authenticate, requireRole('ADMIN'), updateAdStatus);
router.get('/revenue/dashboard', authenticate, requireRole('ADMIN'), getRevenueDashboard);

export default router;
