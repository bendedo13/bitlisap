import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  getNewsList,
  getNewsById,
  createNews,
  likeNews,
  getBreakingNews,
} from '../controllers/news.controller';

const router = Router();

router.get('/', getNewsList);
router.get('/breaking', getBreakingNews);
router.get('/:id', getNewsById);
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'MODERATOR'),
  createNews
);
router.post('/:id/like', authenticate, likeNews);

export default router;
