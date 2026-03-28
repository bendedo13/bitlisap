import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  validateBody,
  validateParams,
  validateQuery,
  uuidParamSchema,
} from '../middleware/validate';
import {
  paginationQuerySchema,
  updateProfileBodySchema,
} from '../validation/schemas';
import {
  getUserById,
  updateProfile,
  getMyListings,
  getLeaderboard,
} from '../controllers/users.controller';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get(
  '/me/listings',
  authenticate,
  validateQuery(paginationQuerySchema),
  getMyListings
);
router.put(
  '/me',
  authenticate,
  validateBody(updateProfileBodySchema),
  updateProfile
);
router.get(
  '/:id',
  validateParams(uuidParamSchema),
  getUserById
);

export default router;
