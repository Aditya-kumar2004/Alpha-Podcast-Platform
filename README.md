
# 🎙️ ALPHA Podcast Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-success?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-green?style=for-the-badge)

> **A next-generation podcast streaming platform where creators and listeners connect.**  
> Seamlessly upload, share, and discover audio and video content in a modern, immersive interface.

---

## 🌟 Overview

**ALPHA Podcast Platform** is a comprehensive full-stack application designed to modernize the podcast listening experience. Built with performance and aesthetics in mind, it features a sleek, dark-mode-first UI, real-time interactions, and a robust content management system for creators.

Whether you're a listener looking for the next big show or a creator building an audience, ALPHA provides the tools you need.

---

## ✨ Key Features

- **🔐 Secure Authentication**: Robust JWT-based signup and login system with encrypted passwords.
- **🎧 Immersive Audio Player**: Global persistent player that continues playback while you browse.
- **📹 Video Podcast Support**: Full support for video episodes with a custom theater mode.
- **🎨 Modern UI/UX**: Built with **Tailwind CSS** and **Shadcn Principles** for a premium, responsive glassmorphism aesthetic.
- **📂 Content Management**: Creators can easily upload, edit, and delete their podcast episodes.
- **❤️ Interactive Community**: Like episodes, subscribe to channels, and view real-time engagement stats.
- **🔍 Smart Discovery**: Filter content by categories, trending shows, and search functionality.
- **📱 Fully Responsive**: Optimized experience across desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

| Architecture | Technologies |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **Backend** | ![Node](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) |
| **State Mgmt** | React Context API |
| **Authentication** | JWT (JSON Web Tokens) & Bcrypt |

---

## 📂 Project Structure

```bash
ALPHA/
├── 📂 backend/              # Node.js & Express Server
│   ├── 📂 models/           # Mongoose Schemas (User, Podcast, etc.)
│   ├── 📂 routes/           # API Endpoints
│   ├── 📂 middleware/       # Auth & Error Handling
│   ├── 📂 utils/            # Helper functions (Email, etc.)
│   ├── server.js            # Entry Point
│   └── package.json         # Backend Dependencies
│
└── 📂 frontend/             # React Client
    ├── 📂 src/
    │   ├── 📂 components/   # Reusable UI Components
    │   ├── 📂 pages/        # Application Routes/Views
    │   ├── 📂 context/      # Global State (Auth, Audio, Theme)
    │   ├── 📂 hooks/        # Custom React Hooks
    │   ├── 📂 lib/          # Utilities & API Config
    │   ├── App.jsx          # Main App Component
    │   └── main.jsx         # DOM Entry Point
    └── package.json         # Frontend Dependencies
```

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### 1. Repository Setup
```bash
git clone <your-repo-url>
cd ALPHA
```

### 2. Backend Configuration
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following credentials:
```env
MONGO_URI=mongodb://127.0.0.1:27017/podcast-hub
PORT=5000
JWT_SECRET=your_super_secret_key_123
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Configuration
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
# Client will run on http://localhost:5173
```

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or want to improve the codebase:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with Aditya Kumar by the ALPHA Team</p>
</div>
