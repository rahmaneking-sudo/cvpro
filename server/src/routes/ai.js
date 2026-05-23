import { Router } from 'express';
import multer from 'multer';
import { scanCV, enhanceCVData } from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Configure multer for memory storage (we don't need to save the file to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

router.post('/scan', upload.single('document'), scanCV);
router.post('/enhance-cv', authMiddleware, enhanceCVData);

export default router;
