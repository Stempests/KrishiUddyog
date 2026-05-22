import { Router } from 'express';
import { mandiController } from '../controllers/mandi.controller';

const router = Router();

// Public routes — no auth needed for price viewing
router.get('/prices', mandiController.getPrices);
router.get('/trending', mandiController.getTrending);
router.get('/commodities', mandiController.getCommodities);

export default router;
