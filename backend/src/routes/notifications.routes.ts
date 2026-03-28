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
  fcmTokenBodySchema,
} from '../validation/schemas';
import {
  getNotifications,
  markAsRead,
  saveFcmToken,
} from '../controllers/notifications.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  validateQuery(paginationQuerySchema),
  getNotifications
);
router.put(
  '/:id/read',
  authenticate,
  validateParams(uuidParamSchema),
  markAsRead
);
router.post(
  '/token',
  authenticate,
  validateBody(fcmTokenBodySchema),
  saveFcmToken
);

export default router;
