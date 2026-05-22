import { Router } from 'express';
import { cropController } from '../controllers/crop.controller';
import { protect } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';

const router = Router();

const recommendSchema = z.object({
  soilType: z.string().min(1),
  state: z.string().min(1),
  district: z.string().min(1),
  season: z.enum(['kharif', 'rabi', 'zaid']),
  rainfall: z.number().min(0).max(5000),
  temperature: z.number().min(-10).max(60),
  budget: z.number().min(0),
  irrigationType: z.string().min(1),
  previousCrop: z.string().optional(),
  landSize: z.number().min(0).optional(),
});

router.post('/recommend', protect, aiRateLimiter, validateBody(recommendSchema), cropController.recommend);
router.get('/history', protect, cropController.getHistory);
router.get('/calendar', protect, cropController.getSeasonalCalendar);

export default router;
