import multer from 'multer';
import path from 'path';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// Set up memory storage
const storage = multer.memoryStorage();

// File filter to only allow certain types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Erreur: Seules les images (JPEG, PNG, GIF), les vidéos (MP4, WEBM) et les PDF sont autorisés !'));
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

    const uploadToCloudinary = (fileBuffer, mimetype) => {
      return new Promise((resolve, reject) => {
        let resourceType = 'auto';
        if (mimetype === 'application/pdf') {
          resourceType = 'raw'; // Prevent cloudinary from converting PDFs to images
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
    res.status(500).json({ error: 'Erreur lors de l\'upload du fichier vers le cloud.' });
  }
};
