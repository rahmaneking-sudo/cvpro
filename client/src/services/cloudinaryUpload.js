/**
 * Direct upload to Cloudinary from the browser.
 * Uses UNSIGNED upload preset — no server interaction needed.
 * This bypasses Vercel serverless function body size limits entirely.
 */

const CLOUD_NAME = 'ds9zdiebv';
const UPLOAD_PRESET = 'cvpro_unsigned';

/**
 * Upload a file directly to Cloudinary from the browser
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @param {Function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<{url: string, publicId: string, type: string, size: number}>}
 */
export async function uploadFile(file, options = {}) {
  if (!file) {
    throw new Error('Aucun fichier sélectionné.');
  }

  // Validate file size (max 20MB)
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('Le fichier est trop volumineux (max 20 Mo).');
  }

  // Determine resource type for Cloudinary
  // Use 'auto' for PDFs and unknown types (raw type causes 401 access denied)
  let resourceType = 'auto';
  if (file.type.startsWith('video/')) {
    resourceType = 'video';
  } else if (file.type.startsWith('image/')) {
    resourceType = 'image';
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    // Track upload progress
    if (options.onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          options.onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          type: file.type,
          size: file.size,
        });
      } else {
        let errorMsg = 'Erreur lors de l\'upload';
        try {
          const errData = JSON.parse(xhr.responseText);
          errorMsg = errData.error?.message || errorMsg;
        } catch {}
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => reject(new Error('Erreur réseau lors de l\'upload. Vérifiez votre connexion.'));
    xhr.send(formData);
  });
}
