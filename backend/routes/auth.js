import express from 'express';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import User from '../models/User.js';
import { sendOTP } from '../utils/email.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

import { protect } from '../middleware/authMiddleware.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register user & Send OTP
router.post('/register', async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            if (userExists.isVerified) {
                return res.status(400).json({ message: 'User already exists' });
            } else {
                // Resend OTP logic for unverified user
                const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                userExists.username = username;
                userExists.password = password; // Will be hashed by pre-save
                userExists.phone = phone;
                userExists.otp = otp;
                userExists.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
                await userExists.save();

                await sendOTP(email, otp);
                return res.status(200).json({ message: 'OTP sent to email', email });
            }
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        // Create temporary user with OTP
        const user = await User.create({
            username,
            email,
            password,
            phone,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000,
        });

        if (user) {
            console.log("GENERATED OTP:", otp); // For testing
            await sendOTP(email, otp);
            res.status(201).json({ message: 'OTP sent to email', email });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Email not verified. Please register again to verify.' });
            }

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/upload-profile', protect, upload.single('image'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.profilePicture = `/uploads/${req.file.filename}`;
            await user.save();
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                isVerified: user.isVerified,
                token: generateToken(user._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Change Password
router.post('/change-password', protect, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Forgot Password - Send OTP
router.post('/forgot-password-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        // We need to bypass the password hashing pre-save hook when only updating OTP
        // However, since we are just setting properties and calling save(), the pre-save hook runs.
        // The pre-save hook checks `if (!this.isModified('password')) return next();`.
        // Since we are NOT modifying the password here, it should be safe.
        await user.save();

        await sendOTP(email, otp);
        res.json({ message: 'OTP sent to email', email });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reset Password - Verify OTP & Update Password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.password = newPassword; // Pre-save hook will hash this
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Password updated successfully. Please login with your new password.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
