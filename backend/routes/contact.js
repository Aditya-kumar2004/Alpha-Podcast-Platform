import express from 'express';
import { sendContactEmail } from '../utils/email.js';

const router = express.Router();

// @desc    Send contact inquiry
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await sendContactEmail({ name, email, subject, message });
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send message, please try again later.' });
    }
});

export default router;
