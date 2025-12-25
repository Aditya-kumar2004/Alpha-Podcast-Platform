import express from 'express';
import Subscriber from '../models/Subscriber.js';
import { sendSubscriptionEmail } from '../utils/email.js';

const router = express.Router();

// @desc    Subscribe to newsletter
// @route   POST /api/subscribe
// @access  Public
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            return res.status(409).json({ message: 'You have already subscribed before' });
        }

        const newSubscriber = await Subscriber.create({ email });

        // Send welcome email asynchronously
        sendSubscriptionEmail(email);

        res.status(201).json({ message: 'Subscribed successfully', data: newSubscriber });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages[0] });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
