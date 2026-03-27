import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getEvents,
  getEventById,
  createEvent,
  attendEvent,
} from '../controllers/events.controller';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', authenticate, createEvent);
router.post('/:id/attend', authenticate, attendEvent);

export default router;
