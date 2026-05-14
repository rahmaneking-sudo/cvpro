import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getTemplates,
  createCV,
  updateCV,
  getCV,
  getUserCVs,
  deleteCV,
  enhanceSection,
} from '../controllers/cvController.js';

const router = Router();

// Public
router.get('/templates', getTemplates);

// Protected
router.post('/', authMiddleware, createCV);
router.get('/user', authMiddleware, getUserCVs);
router.get('/:id', authMiddleware, getCV);
router.put('/:id', authMiddleware, updateCV);
router.delete('/:id', authMiddleware, deleteCV);
router.post('/:id/enhance', authMiddleware, enhanceSection);

export default router;
