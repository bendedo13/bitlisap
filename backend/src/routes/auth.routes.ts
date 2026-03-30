import { Router } from 'express';
import { register, login, refreshToken, getMe, updateProfile, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { createRateLimit } from '../middleware/rateLimit';

const router = Router();

router.post('/register', createRateLimit(10, 15), register);
router.post('/login', createRateLimit(10, 15), login);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

export default router;
