import multer from 'multer';
import path from 'path';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// Set up memory storage
const storage = multer.memoryStorage();

// File filter to only allow certain types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm',
    'application/pdf'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(new Error(`Type de fichier non supporté: ${file.mimetype}. Formats acceptés: JPEG, PNG, GIF, WEBP, MP4, WEBM, PDF`));
  }
};

// Initialize multer with max size (20MB)
export const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: fileFilter
});

export const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé.' });
    }

    // Check Cloudinary configuration
    const cloudConfig = cloudinary.config();
    if (!cloudConfig.cloud_name || !cloudConfig.api_key || !cloudConfig.api_secret) {
      console.error('Cloudinary config missing:', {
        cloud_name: !!cloudConfig.cloud_name,
        api_key: !!cloudConfig.api_key,
        api_secret: !!cloudConfig.api_secret
      });
      return res.status(500).json({ error: 'Configuration de stockage cloud manquante.' });
    }

    const uploadToCloudinary = (fileBuffer, mimetype) => {
      return new Promise((resolve, reject) => {
        // IMPORTANT: Never use 'raw' for PDFs — Cloudinary free plan blocks raw file access (401).
        // Use 'image' for PDFs (Cloudinary can handle PDFs as image assets).
        // Use 'video' for videos, 'auto' for everything else.
        let resourceType = 'auto';
        if (mimetype.startsWith('video/')) {
          resourceType = 'video';
        }

        const cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: 'cvpro_uploads',
            resource_type: resourceType,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
      });
    };

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    res.json({
      success: true,
      url: result.secure_url,
      filename: result.public_id,
      type: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'upload du fichier.',
      details: error.message || 'Erreur inconnue'
    });
  }
};
