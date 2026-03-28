import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  validateBody,
  validateParams,
  validateQuery,
  uuidParamSchema,
} from '../middleware/validate';
import {
  createNewsBodySchema,
  newsListQuerySchema,
} from '../validation/schemas';
import {
  getNewsList,
  getNewsById,
  createNews,
  likeNews,
  getBreakingNews,
} from '../controllers/news.controller';

const router = Router();

router.get('/', validateQuery(newsListQuerySchema), getNewsList);
router.get('/breaking', getBreakingNews);
router.get('/:id', validateParams(uuidParamSchema), getNewsById);
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'MODERATOR'),
  validateBody(createNewsBodySchema),
  createNews
);
router.post(
  '/:id/like',
  authenticate,
  validateParams(uuidParamSchema),
  likeNews
);

export default router;
