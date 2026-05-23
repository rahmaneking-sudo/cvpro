import { Router } from 'express';
import { getSession, sendMessage } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Toutes les routes chat nécessitent d'être connecté
router.use(authMiddleware);

router.get('/session', getSession);
router.post('/message', sendMessage);

export default router;
