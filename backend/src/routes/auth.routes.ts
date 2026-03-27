import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';
import {
  sendOtp,
  verifyOtp,
  refreshToken,
  getMe,
} from '../controllers/auth.controller';

const router = Router();

router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);

export default router;
