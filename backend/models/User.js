import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilePicture: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    likedPodcasts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Podcast' }],
    history: [{
        podcast: { type: mongoose.Schema.Types.ObjectId, ref: 'Podcast' },
        playedAt: { type: Date, default: Date.now },
        progress: { type: Number, default: 0 } // Seconds listened
    }],
    library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Podcast' }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who subscribed to this user
    subscribedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users this user is subscribed to
    createdAt: { type: Date, default: Date.now }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
