import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  premiumListing,
} from '../controllers/listings.controller';

const router = Router();

router.get('/', getListings);
router.get('/:id', getListingById);
router.post('/', authenticate, createListing);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);
router.post('/:id/premium', authenticate, premiumListing);

export default router;
