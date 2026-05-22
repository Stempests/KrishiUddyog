import { Router } from 'express';
import authRoutes from './auth.routes';
import cropRoutes from './crop.routes';
import mandiRoutes from './mandi.routes';
import diseaseRoutes from './disease.routes';
import assistantRoutes from './assistant.routes';
import marketplaceRoutes from './marketplace.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/crop', cropRoutes);
router.use('/mandi', mandiRoutes);
router.use('/disease', diseaseRoutes);
router.use('/assistant', assistantRoutes);
router.use('/marketplace', marketplaceRoutes);

export default router;
