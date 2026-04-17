
# 🎙️ ALPHA Podcast Platform

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-success?style=for-the-badge&logo=react)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)

<img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop" alt="Alpha Podcast Platform" width="100%" style="border-radius: 10px;" />

<br/>
<br/>

> **A next-generation podcast streaming platform where creators and listeners connect.**
> Seamlessly upload, share, and discover audio and video content in a modern, immersive interface.

</div>

---

## 🌟 Overview

**ALPHA Podcast Platform** is a comprehensive full-stack application designed to modernize the podcast listening experience. Built with performance and aesthetics in mind, it features a sleek dark-mode UI, real-time interactions, Cloudinary media storage, OTP email verification, and a robust content management system for creators.

Whether you're a listener discovering new shows or a creator building an audience — ALPHA has everything you need.

---

## ✨ Key Features

- **🔐 Secure Auth** — JWT-based login with OTP email verification via Nodemailer
- **☁️ Cloudinary Uploads** — Audio, video & profile images stored on Cloudinary (Vercel-compatible)
- **📊 Real-time Upload Progress** — Live progress bar during video/audio uploads
- **🎧 Global Audio Player** — Persistent player continues playback while browsing
- **📹 Video Podcast Support** — Custom video player with theater mode
- **👤 Profile Management** — Update or remove profile picture with instant preview
- **🔔 Email Notifications** — Creators get professional HTML emails when someone subscribes
- **🔒 Role-Based Access** — Guests see 3 sample podcasts; full library unlocked after login
- **❤️ Interactions** — Like, subscribe, comment on podcasts
- **🔍 Smart Browse** — Filter by category, search, trending shows
- **📱 Fully Responsive** — Optimized for desktop, tablet and mobile

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Sonner Toast |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Media Storage** | Cloudinary (audio, video, thumbnails, profile pics) |
| **Authentication** | JWT + Bcrypt + OTP via Nodemailer |
| **Deployment** | Vercel (frontend + backend serverless) |
| **State Management** | React Context API (Auth, Audio, Toast, Theme) |

---

## 📂 Project Structure

```
ALPHA/
├── 📂 backend/
│   ├── 📂 api/
│   │   └── index.js          ← Vercel serverless entry point
│   ├── 📂 config/
│   │   └── cloudinary.js     ← Cloudinary storage config
│   ├── 📂 middleware/
│   │   └── authMiddleware.js ← JWT protect middleware
│   ├── 📂 models/
│   │   ├── User.js
│   │   ├── Podcast.js
│   │   ├── Comment.js
│   │   ├── Subscription.js
│   │   └── Subscriber.js
│   ├── 📂 routes/
│   │   ├── auth.js           ← Register, Login, OTP, Upload/Remove Profile
│   │   ├── podcasts.js       ← CRUD for podcasts
│   │   ├── users.js          ← Profile, likes, history
│   │   ├── interactions.js   ← Subscribe, comment, like
│   │   ├── subscribers.js    ← Newsletter subscribers
│   │   └── contact.js        ← Contact form
│   ├── 📂 utils/
│   │   └── email.js          ← OTP + Subscriber notification emails
│   ├── server.js             ← Local dev server
│   ├── vercel.json           ← Vercel backend config
│   └── package.json
│
└── 📂 frontend/
    ├── 📂 src/
    │   ├── 📂 components/
    │   │   ├── layout/       ← Navbar, Footer, Layout
    │   │   ├── podcast/      ← PodcastCard, VideoPlayer, EpisodeCard
    │   │   └── ui/           ← Button, Badge, etc.
    │   ├── 📂 context/
    │   │   ├── AuthContext.jsx
    │   │   ├── AudioContext.jsx
    │   │   ├── ToastContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── 📂 pages/
    │   │   ├── Index.jsx     ← Homepage with guest/member views
    │   │   ├── Browse.jsx
    │   │   ├── Upload.jsx    ← Upload with live progress bar
    │   │   ├── Profile.jsx   ← Profile mgmt with photo options
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── ...
    │   ├── 📂 lib/
    │   │   └── api.js        ← API_URL config (dev/prod)
    │   └── main.jsx
    ├── vercel.json           ← Vite SPA routing config
    └── package.json
```

---

## 🚀 Local Development Setup

### 1. Clone the repo
```bash
git clone https://github.com/Aditya-kumar2004/Alpha-Podcast-Platform.git
cd Alpha-Podcast-Platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/podcast-hub
PORT=5000
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:8080
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend:
```bash
nodemon server.js
# Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:8080
```

---

## ☁️ Production Deployment (Vercel)

### Backend
1. New Vercel project → Root Directory: `backend`
2. Add all environment variables from `.env` above
3. Set `FRONTEND_URL` to your deployed frontend URL

### Frontend
1. New Vercel project → Root Directory: `frontend`
2. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register + send OTP |
| `POST` | `/api/auth/verify-otp` | Verify OTP |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/upload-profile` | Upload profile picture |
| `DELETE` | `/api/auth/remove-profile` | Remove profile picture |
| `GET` | `/api/podcasts` | Get all podcasts |
| `POST` | `/api/podcasts` | Create podcast |
| `POST` | `/api/interactions/subscribe/:id` | Subscribe to creator |
| `POST` | `/api/users/like/:id` | Like a podcast |

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">
  <p>Made with ❤️ by <strong>Aditya Kumar</strong></p>
  <p><em>ALPHA Podcast Platform — Where creators meet their audience.</em></p>
</div>
