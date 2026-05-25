import { Router } from 'express';
import { getPosts, createPost, toggleLike, addComment } from '../controllers/community.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All community routes require authentication
router.use(protect);

router.get('/', getPosts);
router.post('/', createPost);
router.post('/:id/like', toggleLike);
router.post('/:id/comment', addComment);

export default router;
