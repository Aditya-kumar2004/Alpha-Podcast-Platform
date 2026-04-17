// ============================================================
// Vercel Serverless Entry Point — Alpha Podcast Backend
// This wraps the Express app for Vercel's serverless runtime.
// ============================================================

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import podcastRoutes from '../routes/podcasts.js';
import authRoutes from '../routes/auth.js';
import userRoutes from '../routes/users.js';
import subscriberRoutes from '../routes/subscribers.js';
import contactRoutes from '../routes/contact.js';
import interactionRoutes from '../routes/interactions.js';

dotenv.config();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allows your deployed frontend + localhost dev servers + Vercel preview URLs
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:8080',
      'http://localhost:3000',
      'http://localhost:5173',
    ].filter(Boolean);

    // Allow any *.vercel.app domain (covers preview deployments)
    const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Alpha Podcast Hub API is running ✅',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Alpha Podcast Hub API is running ✅',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/podcasts',
      '/api/users',
      '/api/interactions',
      '/api/subscribers',
      '/api/contact',
    ],
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/podcasts', podcastRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/interactions', interactionRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[Global Error]', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ─── MongoDB Connection (cached for serverless cold starts) ────────────────────
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

// ─── Vercel Serverless Handler ────────────────────────────────────────────────
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
