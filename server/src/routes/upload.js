import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { upload, handleFileUpload } from '../controllers/uploadController.js';

const router = Router();

// Endpoint for uploading files (Images, Videos, PDFs)
// Uses multer middleware before hitting the controller
router.post('/', authMiddleware, upload.single('file'), handleFileUpload);

export default router;
