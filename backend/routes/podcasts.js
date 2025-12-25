import express from 'express';
import fs from 'fs';
import Podcast from '../models/Podcast.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';


const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // Use absolute path relative to project root
        let uploadPath = path.join(process.cwd(), 'uploads');

        if (file.fieldname === 'audio') {
            uploadPath = path.join(uploadPath, 'audio');
        } else if (file.fieldname === 'video') {
            uploadPath = path.join(uploadPath, 'video');
        } else if (file.fieldname === 'image') {
            uploadPath = path.join(uploadPath, 'thumbnail');
        }

        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5GB limit for large video uploads
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|mp3|wav|m4a|aac|flac|ogg|webm|mp4|mkv|avi|mpeg|mov/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    console.log(`[Upload Check] File: ${file.originalname}, Mime: ${file.mimetype}, ExtMatch: ${extname}, MimeMatch: ${mimetype}`);

    if (extname) {
        // We trust the extension if it matches our allowed list. 
        // Mime types are often unreliable (e.g. application/octet-stream).
        return cb(null, true);
    } else {
        cb('Error: File type not supported!');
    }
}

// GET all podcasts
router.get('/', async (req, res) => {
    try {
        const podcasts = await Podcast.find({}).populate('user', 'username profilePicture');
        res.json(podcasts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET podcast by user (My Podcasts)
router.get('/my-podcasts', protect, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ user: req.user._id });
        res.json(podcasts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET podcast by ID
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

// POST Create Podcast
router.post('/', protect, upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    console.log("Upload Request Body:", req.body);
    console.log("Upload Request Files:", req.files);
    try {
        const { title, description, category, language } = req.body;

        let audioUrl = '';
        let videoUrl = '';
        let imageUrl = '';

        if (req.files['audio']) {
            audioUrl = `/uploads/audio/${req.files['audio'][0].filename}`;
        }
        if (req.files['video']) {
            videoUrl = `/uploads/video/${req.files['video'][0].filename}`;
        }
        if (req.files['image']) {
            imageUrl = `/uploads/thumbnail/${req.files['image'][0].filename}`;
        }

        const type = videoUrl ? 'video' : 'audio';

        const podcast = new Podcast({
            id: Date.now().toString(), // Generate a simple ID
            title,
            description,
            category,
            language: language || 'Hindi', // Default to Hindi if not provided
            type,
            user: req.user._id,
            author: req.user.username,
            image: imageUrl,
            audioUrl,
            videoUrl,
            rating: 0,
            episodes: [] // Initialize with empty episodes if single upload
        });

        // If it's a single upload, we can also treat it as an "episode" roughly, 
        // but for now we follow the schema of a "Podcast" entity.
        // Or we can add a single episode to the list.
        // Let's add it as an episode too for compatibility with detail view if it expects episodes.

        podcast.episodes.push({
            id: Date.now().toString() + '-ep1',
            title: title,
            description: description,
            duration: '00:00', // Placeholder or calculation needed
            date: new Date().toISOString(),
            episodeNumber: 1,
            audioUrl: audioUrl,
            videoUrl: videoUrl
        });

        const createdPodcast = await podcast.save();
        res.status(201).json(createdPodcast);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE Podcast
router.delete('/:id', protect, async (req, res) => {
    try {
        let podcast = await Podcast.findOne({ id: req.params.id });
        if (!podcast && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            podcast = await Podcast.findById(req.params.id);
        }

        if (podcast) {
            if (podcast.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            await podcast.deleteOne();
            res.json({ message: 'Podcast removed' });
        } else {
            res.status(404).json({ message: 'Podcast not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT Update Podcast
router.put('/:id', protect, async (req, res) => {
    try {
        const { title, description, category, language } = req.body;
        let podcast = await Podcast.findOne({ id: req.params.id });
        if (!podcast && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            podcast = await Podcast.findById(req.params.id);
        }

        if (podcast) {
            if (podcast.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            podcast.title = title || podcast.title;
            podcast.description = description || podcast.description;
            podcast.category = category || podcast.category;
            podcast.language = language || podcast.language;

            const updatedPodcast = await podcast.save();
            res.json(updatedPodcast);
        } else {
            res.status(404).json({ message: 'Podcast not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
