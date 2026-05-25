import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Route: GET /api/v1/weather
router.get('/', protect, getWeather);

export default router;
