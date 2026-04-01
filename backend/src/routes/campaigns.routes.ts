import { Router } from 'express';
import { getCampaigns, createCampaign, deleteCampaign } from '../controllers/campaigns.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getCampaigns);
router.post('/', authenticate, createCampaign);
router.delete('/:id', authenticate, deleteCampaign);

export default router;
