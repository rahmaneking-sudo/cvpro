/**
 * Upload files to Cloudinary - supports both direct browser upload
 * and fallback through the server API.
 */
import api from './api';

/**
 * Upload a file to Cloudinary via signed upload (secure, goes through server for signature only)
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @param {Function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<{url: string, publicId: string, type: string}>}
 */
export async function uploadFile(file, options = {}) {
  // Method 1: Try signed direct upload (gets signature from server, uploads direct to Cloudinary)
  try {
    const result = await signedDirectUpload(file, options);
    return result;
  } catch (err) {
    console.warn('Direct upload failed, trying server upload:', err.message);
  }

  // Method 2: Fallback to server-side upload
  try {
    const result = await serverUpload(file, options);
    return result;
  } catch (err) {
    console.error('All upload methods failed:', err);
    throw new Error('L\'upload a échoué. Vérifiez que Cloudinary est bien configuré.');
  }
}

/**
 * Signed direct upload: get signature from server, upload directly to Cloudinary
 */
async function signedDirectUpload(file, options = {}) {
  // Step 1: Get signature from our server
  const sigRes = await api.post('/cloudinary/signature');
  const { timestamp, signature, folder, apiKey, cloudName } = sigRes.data;

  if (!cloudName || !apiKey) {
    throw new Error('Cloudinary non configuré');
  }

  // Step 2: Determine resource type
  let resourceType = 'auto';
  if (file.type.startsWith('video/')) {
    resourceType = 'video';
  } else if (file.type === 'application/pdf') {
    resourceType = 'raw';
  } else {
    resourceType = 'image';
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  // Step 3: Build form data with signature
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  // Step 4: Upload directly to Cloudinary with progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

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
        let msg = 'Upload Cloudinary échoué';
        try { msg = JSON.parse(xhr.responseText).error?.message || msg; } catch {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error('Erreur réseau'));
    xhr.send(formData);
  });
}

/**
 * Server-side upload fallback
 */
async function serverUpload(file, options = {}) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (options.onProgress && e.total) {
        options.onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });

  if (res.data.url) {
    return {
      url: res.data.url,
      publicId: res.data.filename,
      type: file.type,
      size: file.size,
    };
  }
  throw new Error(res.data.error || 'Upload échoué');
}
