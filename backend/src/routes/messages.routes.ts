import { Router } from 'express';
import { authenticate } from '../middleware/auth';
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
  getMessages
);
router.post(
  '/conversations/:listingId',
  authenticate,
  startConversation
);

export default router;
