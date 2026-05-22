import { Router } from 'express';
import { assistantController } from '../controllers/assistant.controller';
import { protect } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  language: z.enum(['hi', 'en', 'mr', 'pa', 'bn', 'te', 'ta']).optional(),
  conversationId: z.string().optional(),
});

router.post('/chat', protect, aiRateLimiter, validateBody(chatSchema), assistantController.chat);
router.get('/conversations', protect, assistantController.getConversations);
router.get('/conversations/:id', protect, assistantController.getConversation);
router.delete('/conversations/:id', protect, assistantController.deleteConversation);

export default router;
