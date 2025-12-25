# Podcast Hub

A full-stack podcast platform where users can upload, share, and listen to podcasts.

## 🚀 Features

- **User Authentication**: Secure signup and login.
- **Podcast Upload**: Support for audio and video podcasts.
- **Profile Management**: customizable user profiles.
- **Video Player**: Custom video player with related content sidebar.
- **Dark/Light Mode**: Toggle between themes.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Axios**: API requests

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM

## 📦 Installation

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd podcast-hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/podcast-hub
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the server:
```bash
npm start
# or for development
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app should now be running at `http://localhost:5173`.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
