import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    duration: String,
    date: String,
    episodeNumber: Number,
    videoId: String,
    audioUrl: String,
    videoUrl: String
});

const podcastSchema = new mongoose.Schema({
    id: { type: String, unique: true, sparse: true }, // made sparse to allow nulls/duplicates if we don't use it for new ones
    title: { type: String, required: true },
    author: { type: String }, // Can be the username
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
    description: String,
    image: String, // Thumbnail URL
    category: String,
    language: { type: String, default: 'Hindi' },
    type: { type: String, enum: ['audio', 'video'], default: 'audio' },
    audioUrl: String,
    videoUrl: String,
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscribers: String, // Keep for legacy/static if needed, but User model has real subscribers
    rating: Number,
    youtubeChannel: String,
    episodes: [episodeSchema]
}, { timestamps: true });

const Podcast = mongoose.model('Podcast', podcastSchema);

export default Podcast;
