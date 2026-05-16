import { v2 as cloudinary } from 'cloudinary';

// On Vercel, env vars are injected directly — no dotenv needed
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
