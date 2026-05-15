import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createPortfolio,
  updatePortfolio,
  getPortfolio,
  getUserPortfolios,
  deletePortfolio,
  getPublicPortfolio
} from '../controllers/portfolioController.js';

const router = Router();

// Public
router.get('/public/:id', getPublicPortfolio);

// Protected
router.post('/', authMiddleware, createPortfolio);
router.get('/user', authMiddleware, getUserPortfolios);
router.get('/:id', authMiddleware, getPortfolio);
router.put('/:id', authMiddleware, updatePortfolio);
router.delete('/:id', authMiddleware, deletePortfolio);

export default router;
