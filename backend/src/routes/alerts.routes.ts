import { Router } from 'express';
import { getActiveAlert, createAlert, deactivateAlert } from '../controllers/alerts.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/active', getActiveAlert);
router.post('/', authenticate, createAlert);
router.patch('/:id/deactivate', authenticate, deactivateAlert);

export default router;
