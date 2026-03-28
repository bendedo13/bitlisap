import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  otpSendLimiter,
  authVerifyLimiter,
} from '../middleware/rateLimit';
import { validateBody } from '../middleware/validate';
import {
  sendOtpBodySchema,
  verifyOtpBodySchema,
  refreshTokenBodySchema,
} from '../validation/schemas';
import {
  sendOtp,
  verifyOtp,
  refreshToken,
  getMe,
} from '../controllers/auth.controller';

const router = Router();

router.post(
  '/send-otp',
  otpSendLimiter,
  validateBody(sendOtpBodySchema),
  sendOtp
);
router.post(
  '/verify-otp',
  authVerifyLimiter,
  validateBody(verifyOtpBodySchema),
  verifyOtp
);
router.post(
  '/refresh',
  validateBody(refreshTokenBodySchema),
  refreshToken
);
router.get('/me', authenticate, getMe);

export default router;
