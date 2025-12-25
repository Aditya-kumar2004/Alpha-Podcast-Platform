import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import podcastRoutes from './routes/podcasts.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


console.log(`[Startup] Initializing Backend Server on Port ${PORT}...`);

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

import userRoutes from './routes/users.js';
import subscriberRoutes from './routes/subscribers.js';
import contactRoutes from './routes/contact.js';
import interactionRoutes from './routes/interactions.js';

// Routes
app.use('/api/podcasts', podcastRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/interactions', interactionRoutes);

// Static uploads
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/', (req, res) => {
  res.send('Podcast Hub API is running...');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/podcast-hub')
  .then(() => {
    console.log('-----------------------------------');
    console.log('✅ Connected to MongoDB Successfully');
    console.log('-----------------------------------');
  })
  .catch((err) => {
    console.log('-----------------------------------');
    console.error(' MongoDB Connection Error:', err.message);
    console.log('-----------------------------------');
  });

// Start Server Immediately
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});


