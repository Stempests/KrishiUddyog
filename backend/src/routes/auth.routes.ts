import { Router } from 'express';
import { authController, registerSchema, loginSchema } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate';
import { protect } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateBody(loginSchema), authController.login);
router.delete('/logout', protect, authController.logout);
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

export default router;
