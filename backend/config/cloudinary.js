import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Load env vars HERE because ES module imports are hoisted before server.js dotenv.config() runs
dotenv.config();

// Configure Cloudinary using env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Storage for Podcast Media (audio, video, thumbnail) ──────────────────────
export const podcastStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'alpha-podcast/thumbnails';
    let resource_type = 'image';
    let allowed_formats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (file.fieldname === 'audio') {
      folder = 'alpha-podcast/audio';
      resource_type = 'video'; // Cloudinary uses 'video' resource type for audio too
      allowed_formats = ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'];
    } else if (file.fieldname === 'video') {
      folder = 'alpha-podcast/video';
      resource_type = 'video';
      allowed_formats = ['mp4', 'mkv', 'avi', 'webm', 'mov', 'mpeg'];
    }

    return {
      folder,
      resource_type,
      allowed_formats,
      // Use a unique filename
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// ─── Storage for Profile Pictures ─────────────────────────────────────────────
export const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'alpha-podcast/profiles',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: `profile-${Date.now()}`,
  }),
});

export default cloudinary;
