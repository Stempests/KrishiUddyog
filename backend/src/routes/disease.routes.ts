import { Router } from 'express';
import { diseaseController } from '../controllers/disease.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { aiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/detect', protect, aiRateLimiter, uploadSingle, diseaseController.detect);
router.get('/reports', protect, diseaseController.getReports);
router.get('/reports/:id', protect, diseaseController.getReportById);

export default router;
