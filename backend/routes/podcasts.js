import express from 'express';
import Podcast from '../models/Podcast.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { podcastStorage } from '../config/cloudinary.js';

const router = express.Router();

// ─── Multer with Cloudinary Storage ───────────────────────────────────────────
const upload = multer({
  storage: podcastStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit (Cloudinary free tier: 10GB storage)
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|gif|webp|mp3|wav|m4a|aac|flac|ogg|webm|mp4|mkv|avi|mpeg|mov/;
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (allowed.test(ext)) {
      return cb(null, true);
    }
    cb(new Error('File type not supported'));
  },
});

// ─── GET all podcasts ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const podcasts = await Podcast.find({}).populate('user', 'username profilePicture');
    res.json(podcasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET my podcasts (protected) ──────────────────────────────────────────────
router.get('/my-podcasts', protect, async (req, res) => {
  try {
    const podcasts = await Podcast.find({ user: req.user._id });
    res.json(podcasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET podcast by ID ────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    let podcast = await Podcast.findOne({ id: req.params.id });
    if (!podcast && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      podcast = await Podcast.findById(req.params.id);
    }
    if (podcast) {
      res.json(podcast);
    } else {
      res.status(404).json({ message: 'Podcast not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST Create Podcast ──────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category, language } = req.body;

      // Cloudinary returns a `path` (secure_url) and `filename` (public_id)
      const audioUrl = req.files?.audio ? req.files.audio[0].path : '';
      const videoUrl = req.files?.video ? req.files.video[0].path : '';
      const imageUrl = req.files?.image ? req.files.image[0].path : '';

      const type = videoUrl ? 'video' : 'audio';

      const podcast = new Podcast({
        id: Date.now().toString(),
        title,
        description,
        category,
        language: language || 'Hindi',
        type,
        user: req.user._id,
        author: req.user.username,
        image: imageUrl,
        audioUrl,
        videoUrl,
        rating: 0,
        episodes: [],
      });

      podcast.episodes.push({
        id: Date.now().toString() + '-ep1',
        title: title,
        description: description,
        duration: '00:00',
        date: new Date().toISOString(),
        episodeNumber: 1,
        audioUrl: audioUrl,
        videoUrl: videoUrl,
      });

      const createdPodcast = await podcast.save();
      res.status(201).json(createdPodcast);
    } catch (error) {
      console.error('[Podcast Upload Error]', error);
      res.status(500).json({ message: error.message });
    }
  }
);

// ─── DELETE Podcast ────────────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    let podcast = await Podcast.findOne({ id: req.params.id });
    if (!podcast && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      podcast = await Podcast.findById(req.params.id);
    }

    if (!podcast) return res.status(404).json({ message: 'Podcast not found' });
    if (podcast.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await podcast.deleteOne();
    res.json({ message: 'Podcast removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT Update Podcast ────────────────────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, category, language } = req.body;
    let podcast = await Podcast.findOne({ id: req.params.id });
    if (!podcast && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      podcast = await Podcast.findById(req.params.id);
    }

    if (!podcast) return res.status(404).json({ message: 'Podcast not found' });
    if (podcast.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    podcast.title = title || podcast.title;
    podcast.description = description || podcast.description;
    podcast.category = category || podcast.category;
    podcast.language = language || podcast.language;

    const updatedPodcast = await podcast.save();
    res.json(updatedPodcast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
