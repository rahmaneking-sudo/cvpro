import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getTemplates,
  createCV,
  updateCV,
  getCV,
  getPublicCV,
  getUserCVs,
  deleteCV,
  enhanceSection,
  checkPurchase,
  simulatePurchase
} from '../controllers/cvController.js';

const router = Router();

// Public
router.get('/templates', getTemplates);
router.get('/public/:id', getPublicCV);

// Protected
router.get('/purchase/:templateId', authMiddleware, checkPurchase);
router.post('/purchase/simulate', authMiddleware, simulatePurchase);

router.post('/', authMiddleware, createCV);
router.get('/user', authMiddleware, getUserCVs);
router.get('/:id', authMiddleware, getCV);
router.put('/:id', authMiddleware, updateCV);
router.delete('/:id', authMiddleware, deleteCV);
router.post('/:id/enhance', authMiddleware, enhanceSection);

export default router;
