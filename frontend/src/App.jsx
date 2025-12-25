// src/App.jsx - SIMPLE WORKING VERSION
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PodcastDetail from "./pages/PodcastDetail";
import EpisodeDetail from "./pages/EpisodeDetail";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import Upload from "./pages/Upload";
import PublicProfile from "./pages/PublicProfile";
import { AudioProvider } from "./context/AudioContext";
import AudioPlayer from "./components/podcast/AudioPlayer";
import ScrollToTop from "./components/layout/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <AudioProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/creator/:id" element={<PublicProfile />} />
              <Route
                path="/browse"
                element={
                  <Browse />
                }
              />
              <Route
                path="/podcast/:id"
                element={
                  <ProtectedRoute>
                    <PodcastDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/podcast/:podcastId/episode/:episodeId"
                element={
                  <ProtectedRoute>
                    <EpisodeDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AudioPlayer />
          </AudioProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;