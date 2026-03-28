import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  validateBody,
  validateParams,
  validateQuery,
  uuidParamSchema,
} from '../middleware/validate';
import {
  businessesQuerySchema,
  nearbyQuerySchema,
  createBusinessBodySchema,
  updateBusinessBodySchema,
  reviewBodySchema,
} from '../validation/schemas';
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  getNearbyBusinesses,
  addReview,
} from '../controllers/businesses.controller';

const router = Router();

router.get(
  '/',
  validateQuery(businessesQuerySchema),
  getBusinesses
);
router.get(
  '/nearby',
  validateQuery(nearbyQuerySchema),
  getNearbyBusinesses
);
router.get('/:id', validateParams(uuidParamSchema), getBusinessById);
router.post(
  '/',
  authenticate,
  validateBody(createBusinessBodySchema),
  createBusiness
);
router.put(
  '/:id',
  authenticate,
  validateParams(uuidParamSchema),
  validateBody(updateBusinessBodySchema),
  updateBusiness
);
router.post(
  '/:id/review',
  authenticate,
  validateParams(uuidParamSchema),
  validateBody(reviewBodySchema),
  addReview
);

export default router;
