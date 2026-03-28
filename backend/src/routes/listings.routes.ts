import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  validateBody,
  validateParams,
  validateQuery,
  uuidParamSchema,
} from '../middleware/validate';
import {
  createListingBodySchema,
  listingsQuerySchema,
  premiumListingBodySchema,
  updateListingBodySchema,
} from '../validation/schemas';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  premiumListing,
} from '../controllers/listings.controller';

const router = Router();

router.get('/', validateQuery(listingsQuerySchema), getListings);
router.get('/:id', validateParams(uuidParamSchema), getListingById);
router.post(
  '/',
  authenticate,
  validateBody(createListingBodySchema),
  createListing
);
router.put(
  '/:id',
  authenticate,
  validateParams(uuidParamSchema),
  validateBody(updateListingBodySchema),
  updateListing
);
router.delete(
  '/:id',
  authenticate,
  validateParams(uuidParamSchema),
  deleteListing
);
router.post(
  '/:id/premium',
  authenticate,
  validateParams(uuidParamSchema),
  validateBody(premiumListingBodySchema),
  premiumListing
);

export default router;
