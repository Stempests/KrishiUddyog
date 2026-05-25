import { Router } from 'express';
import { logisticsController, createRouteSchema } from '../controllers/logistics.controller';
import { protect } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate';

const router = Router();

// Get available routes (public or protected, making it protected since it's a dashboard feature)
router.get('/', protect, logisticsController.getRoutes);

// Create a new load request
router.post('/', protect, validateBody(createRouteSchema), logisticsController.createRoute);

export default router;
