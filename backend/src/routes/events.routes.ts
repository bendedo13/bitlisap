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
  createEventBodySchema,
} from '../validation/schemas';
import {
  getEvents,
  getEventById,
  createEvent,
  attendEvent,
} from '../controllers/events.controller';

const router = Router();

router.get('/', validateQuery(paginationQuerySchema), getEvents);
router.get('/:id', validateParams(uuidParamSchema), getEventById);
router.post(
  '/',
  authenticate,
  validateBody(createEventBodySchema),
  createEvent
);
router.post(
  '/:id/attend',
  authenticate,
  validateParams(uuidParamSchema),
  attendEvent
);

export default router;
