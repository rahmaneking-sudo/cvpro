import { Router } from 'express';
import { getSession, sendMessage } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Toutes les routes chat nécessitent d'être connecté
router.use(requireAuth);

router.get('/session', getSession);
router.post('/message', sendMessage);

export default router;
