import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getNotifications,
  markAsRead,
  saveFcmToken,
} from '../controllers/notifications.controller';

const router = Router();

router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markAsRead);
router.post('/token', authenticate, saveFcmToken);

export default router;
