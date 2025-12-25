import express from 'express';
import User from '../models/User.js';
import Podcast from '../models/Podcast.js';
import Comment from '../models/Comment.js';
import Subscription from '../models/Subscription.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mock Email Function
const sendEmailNotification = (toEmail, subject, text) => {
    console.log(`[EMAIL MOCK] To: ${toEmail} | Subject: ${subject} | Body: ${text}`);
    // In real app, use nodemailer here
};

// @route   POST /api/interactions/subscribe/:creatorId
// @desc    Toggle subscription to a creator
// @access  Private
router.post('/subscribe/:creatorId', protect, async (req, res) => {
    try {
        const creatorId = req.params.creatorId;
        const userId = req.user._id;

        if (creatorId === userId.toString()) {
            return res.status(400).json({ message: "Cannot subscribe to yourself" });
        }

        const creator = await User.findById(creatorId);
        const user = await User.findById(userId);

        if (!creator || !user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isSubscribed = user.subscribedTo.includes(creatorId);

        if (isSubscribed) {
            // Unsubscribe
            user.subscribedTo = user.subscribedTo.filter(id => id.toString() !== creatorId);
            creator.subscribers = creator.subscribers.filter(id => id.toString() !== userId.toString());
            await user.save();
            await creator.save();

            // Remove Subscription Record
            await Subscription.findOneAndDelete({ subscriber: userId, channel: creatorId });

            res.json({ message: "Unsubscribed", isSubscribed: false, subscribersCount: creator.subscribers.length });
        } else {
            // Subscribe
            user.subscribedTo.push(creatorId);
            creator.subscribers.push(userId);
            await user.save();
            await creator.save();

            // Create Subscription Record
            await Subscription.create({
                subscriber: userId,
                subscriberEmail: user.email,
                channel: creatorId,
                channelName: creator.username
            });

            // Send Notification
            sendEmailNotification(
                creator.email,
                "New Subscriber!",
                `User ${user.username} has subscribed to your channel!`
            );

            res.json({ message: "Subscribed", isSubscribed: true, subscribersCount: creator.subscribers.length });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/interactions/like/:podcastId
// @desc    Toggle like on a podcast
// @access  Private
router.post('/like/:podcastId', protect, async (req, res) => {
    try {
        const podcastId = req.params.podcastId;
        const userId = req.user._id;

        let podcast = await Podcast.findOne({ id: podcastId });
        if (!podcast && podcastId.match(/^[0-9a-fA-F]{24}$/)) {
            podcast = await Podcast.findById(podcastId);
        }

        // If podcast doesn't exist but metadata is provided, create it (Upsert for static content)
        if (!podcast && req.body.title) {
            const newPodcastData = {
                id: podcastId,
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                image: req.body.image,
                category: req.body.category,
                rating: req.body.rating,
                subscribers: req.body.subscribers,
                likes: []
            };
            podcast = await new Podcast(newPodcastData).save();
            console.log(`[Interaction] Created new podcast entry for static ID: ${podcastId}`);
        }

        const user = await User.findById(userId);
        if (!podcast) return res.status(404).json({ message: "Podcast not found" });

        const isLiked = podcast.likes.includes(userId);

        if (isLiked) {
            // Unlike
            podcast.likes = podcast.likes.filter(id => id.toString() !== userId.toString());
            // Filter by string comparison of ObjectIds
            user.likedPodcasts = user.likedPodcasts.filter(id => id.toString() !== podcast._id.toString());
        } else {
            // Like
            podcast.likes.push(userId);
            // Check via ObjectId string comparison
            if (!user.likedPodcasts.some(id => id.toString() === podcast._id.toString())) {
                user.likedPodcasts.push(podcast._id);
            }
        }

        await podcast.save();
        await user.save();

        res.json({ isLiked: !isLiked, likesCount: podcast.likes.length });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/interactions/dislike/:podcastId
// @desc    Toggle dislike on a podcast
// @access  Private
router.post('/dislike/:podcastId', protect, async (req, res) => {
    try {
        const podcastId = req.params.podcastId;
        const userId = req.user._id;

        let podcast = await Podcast.findOne({ id: podcastId });
        if (!podcast && podcastId.match(/^[0-9a-fA-F]{24}$/)) {
            podcast = await Podcast.findById(podcastId);
        }

        if (!podcast) return res.status(404).json({ message: "Podcast not found" });

        const isDisliked = podcast.dislikes.includes(userId);

        if (isDisliked) {
            // Remove dislike
            podcast.dislikes = podcast.dislikes.filter(id => id.toString() !== userId.toString());
        } else {
            // Add dislike
            podcast.dislikes.push(userId);
            // Remove like if exists
            podcast.likes = podcast.likes.filter(id => id.toString() !== userId.toString());
            // Also need to update user likedPodcasts if we want to remove it from "Liked Videos" playlist
            // (Assuming we only track LIKED videos in user profile, not dislikes)
            const user = await User.findById(userId);
            user.likedPodcasts = user.likedPodcasts.filter(id => id.toString() !== podcast._id.toString());
            await user.save();
        }

        await podcast.save();
        res.json({ isDisliked: !isDisliked, dislikesCount: podcast.dislikes.length, likesCount: podcast.likes.length });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/interactions/view/:podcastId
// @desc    Increment view count
// @access  Public
router.post('/view/:podcastId', async (req, res) => {
    try {
        const podcastId = req.params.podcastId;
        let podcast = await Podcast.findOne({ id: podcastId });
        if (!podcast && podcastId.match(/^[0-9a-fA-F]{24}$/)) {
            podcast = await Podcast.findById(podcastId);
        }

        if (!podcast) return res.status(404).json({ message: "Podcast not found" });

        podcast.views = (podcast.views || 0) + 1;
        await podcast.save();

        res.json({ views: podcast.views });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/interactions/comment/:podcastId
// @desc    Add a comment
// @access  Private
router.post('/comment/:podcastId', protect, async (req, res) => {
    try {
        const { text } = req.body;
        const podcastId = req.params.podcastId;

        if (!text) return res.status(400).json({ message: "Comment text required" });

        const comment = new Comment({
            user: req.user._id,
            podcastId: podcastId,
            text
        });

        await comment.save();

        // Populate user to return to frontend
        await comment.populate('user', 'username profilePicture');

        res.status(201).json(comment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/interactions/comments/:podcastId
// @desc    Get comments for a podcast
// @access  Public
router.get('/comments/:podcastId', async (req, res) => {
    try {
        const comments = await Comment.find({ podcastId: req.params.podcastId })
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 }); // Newest first

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
