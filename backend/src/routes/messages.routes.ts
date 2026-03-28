import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  validateParams,
  validateQuery,
  uuidParamSchema,
  listingIdParamSchema,
} from '../middleware/validate';
import { messagesPageQuerySchema } from '../validation/schemas';
import {
  getConversations,
  getMessages,
  startConversation,
} from '../controllers/messages.controller';

const router = Router();

router.get('/conversations', authenticate, getConversations);
router.get(
  '/conversations/:id',
  authenticate,
  validateParams(uuidParamSchema),
  validateQuery(messagesPageQuerySchema),
  getMessages
);
router.post(
  '/conversations/:listingId',
  authenticate,
  validateParams(listingIdParamSchema),
  startConversation
);

export default router;
