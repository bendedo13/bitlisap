import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUserById,
  updateProfile,
  getMyListings,
  getLeaderboard,
} from '../controllers/users.controller';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/me/listings', authenticate, getMyListings);
router.put('/me', authenticate, updateProfile);
router.get('/:id', getUserById);

export default router;
