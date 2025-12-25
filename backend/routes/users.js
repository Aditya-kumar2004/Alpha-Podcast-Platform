import express from 'express';
import User from '../models/User.js';
import Podcast from '../models/Podcast.js';
import jwt from 'jsonwebtoken';
import { sendDeleteOTPEmail, sendAccountDeletedNotification } from '../utils/email.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Get User Profile with populated data
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('likedPodcasts')
            .populate('library')
            .populate({
                path: 'history.podcast',
                model: 'Podcast'
            })
            .select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Public User Profile and Podcasts
router.get('/:id/public-profile', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('username profilePicture email isVerified subscribers');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const podcasts = await Podcast.find({ user: req.params.id });

        res.json({
            user,
            podcasts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle Like Podcast
router.post('/like/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const podcastStringId = req.params.id; // "1", "2"

        // Find the actual podcast document to get its ObjectId
        const podcast = await Podcast.findOne({ id: podcastStringId });
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }

        // Use ObjectId for comparison and storage
        const podcastObjectId = podcast._id;

        if (user.likedPodcasts.some(oid => oid.toString() === podcastObjectId.toString())) {
            user.likedPodcasts = user.likedPodcasts.filter(oid => oid.toString() !== podcastObjectId.toString());
        } else {
            user.likedPodcasts.push(podcastObjectId);
        }

        await user.save();
        res.json(user.likedPodcasts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle Library Podcast
router.post('/library/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const podcastStringId = req.params.id;

        const podcast = await Podcast.findOne({ id: podcastStringId });
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        const podcastObjectId = podcast._id;

        if (user.library.some(oid => oid.toString() === podcastObjectId.toString())) {
            user.library = user.library.filter(oid => oid.toString() !== podcastObjectId.toString());
        } else {
            user.library.push(podcastObjectId);
        }

        await user.save();
        res.json(user.library);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add to History
router.post('/history', protect, async (req, res) => {
    const { podcastId: podcastStringId, progress } = req.body;
    try {
        const user = await User.findById(req.user._id);

        const podcast = await Podcast.findOne({ id: podcastStringId });
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        const podcastObjectId = podcast._id;

        // Remove existing entry if exists to push to top
        user.history = user.history.filter(h => h.podcast.toString() !== podcastObjectId.toString());

        user.history.unshift({
            podcast: podcastObjectId,
            progress: progress || 0,
            playedAt: Date.now()
        });

        // Keep history limited to last 50 items
        if (user.history.length > 50) {
            user.history = user.history.slice(0, 50);
        }

        await user.save();
        res.json(user.history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Generate OTP for Account Deletion
router.post('/delete-otp', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to user (valid for 10 minutes)
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send OTP email
        await sendDeleteOTPEmail(user.email, otp);

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// @desc    Verify OTP and Delete Account
router.delete('/delete', protect, async (req, res) => {
    const { otp, reason } = req.body;

    if (!otp || !reason) {
        return res.status(400).json({ message: 'Please provide OTP and reason' });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // --- FILE CLEANUP LOGIC ---
        const filesToDelete = new Set();

        // 1. Add Profile Picture
        if (user.profilePicture && user.profilePicture.startsWith('/uploads')) {
            filesToDelete.add(user.profilePicture);
        }

        // 2. Add Podcast Files
        const userPodcasts = await Podcast.find({ user: req.user._id });

        userPodcasts.forEach(podcast => {
            // Podcast Thumbnail
            if (podcast.image && podcast.image.startsWith('/uploads')) {
                filesToDelete.add(podcast.image);
            }
            // Podcast Audio
            if (podcast.audioUrl && podcast.audioUrl.startsWith('/uploads')) {
                filesToDelete.add(podcast.audioUrl);
            }
            // Podcast Video
            if (podcast.videoUrl && podcast.videoUrl.startsWith('/uploads')) {
                filesToDelete.add(podcast.videoUrl);
            }
            // Check episodes just in case they have unique files
            if (podcast.episodes && Array.isArray(podcast.episodes)) {
                podcast.episodes.forEach(ep => {
                    if (ep.audioUrl && ep.audioUrl.startsWith('/uploads')) {
                        filesToDelete.add(ep.audioUrl);
                    }
                    if (ep.videoUrl && ep.videoUrl.startsWith('/uploads')) {
                        filesToDelete.add(ep.videoUrl);
                    }
                });
            }
        });

        // 3. Delete Files from FS
        filesToDelete.forEach(filePath => {
            try {
                // Remove leading slash to make it relative to cwd (backend/)
                // e.g., /uploads/image.png -> uploads/image.png
                const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                const absolutePath = path.join(process.cwd(), relativePath);

                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                    console.log(`Deleted file: ${absolutePath}`);
                }
            } catch (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
            }
        });

        // 4. Delete Podcasts from DB
        await Podcast.deleteMany({ user: req.user._id });

        // User Deletion & Notification
        await sendAccountDeletedNotification(user, reason);
        await User.findByIdAndDelete(req.user._id);

        res.json({ message: 'Account, uploaded content, and data deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

export default router;
