import { Router } from 'express';
import { globalSearch } from '../controllers/search.controller';
import { validateQuery } from '../middleware/validate';
import { searchQuerySchema } from '../validation/schemas';

const router = Router();

router.get('/', validateQuery(searchQuerySchema), globalSearch);

export default router;
