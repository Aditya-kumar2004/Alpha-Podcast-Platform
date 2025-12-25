import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Headphones, TrendingUp, Sparkles, Youtube, LayoutGrid, Briefcase, Zap, DollarSign, Smile, Flower2, Siren, Newspaper, Coffee, Brain, Apple, Dumbbell, HeartHandshake, Shirt, Plane, Utensils, Box, Heart, Ghost, Search, BookOpen, Mic, Clapperboard, Scroll, Hourglass, Baby, Rocket, Scale, BarChart, Globe, Landmark, Wallet, Crown, Lock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PodcastCard from "@/components/podcast/PodcastCard";
import EpisodeCard from "@/components/podcast/EpisodeCard";
import CategoryBadge from "@/components/podcast/CategoryBadge";
import VideoPlayer from "@/components/podcast/VideoPlayer";
import { Button } from "@/components/ui/button";
import { podcasts, categories, featuredPodcast } from "@/data/podcasts";
import { useAuth } from "@/context/AuthContext";
import { useAudio } from "@/context/AudioContext";
import { toast } from "sonner"; // Assuming toast is available or use alert
import { API_URL, BASE_URL } from "@/lib/api";

const featuredVideos = [
  { id: "hcvmq-hcDIE", title: "This Mindset Will Change Your Life", channel: "Raj Shamani" },
  { id: "YY7J1pHfSyY", title: "Bill Gates x Nikhil Kamath", channel: "Nikhil Kamath" },
  { id: "sSOxPJD-VNo", title: "Elon Musk Summary", channel: "Joe Rogan Experience" },
];

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalizedPath = path.replace(/\\/g, '/');
  const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `${BASE_URL}${finalPath}`;
};

const Index = () => {
  const { user: currentUser } = useAuth();
  const { playTrack } = useAudio();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllPodcasters, setShowAllPodcasters] = useState(false);
  const [showAllPopularShows, setShowAllPopularShows] = useState(false);
  const [showAllFeaturedVideos, setShowAllFeaturedVideos] = useState(false); // New State
  const [realPodcasts, setRealPodcasts] = useState([]);

  useEffect(() => {
    console.log("Featured Videos loaded:", featuredVideos);
    const fetchPodcasts = async () => {
      try {
        const res = await fetch(`${API_URL}/podcasts`);
        const data = await res.json();
        if (res.ok) {
          // Sort by createdAt desc if available, or just reverse to show newest first
          setRealPodcasts(data.reverse());
        }
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
      }
    };
    fetchPodcasts();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/subscribers/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Subscribed successfully! Check your email.' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Something went wrong' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const latestEpisodes = podcasts
    .flatMap((p) =>
      p.episodes.slice(0, 1).map((e) => ({
        ...e,
        podcastId: p.id,
        podcastTitle: p.title,
        image: p.image,
      }))
    )
    .slice(0, 4);

  // Extract unique creators from realPodcasts
  // Extract unique creators from realPodcasts and merged static
  const allPodcastsMerged = [...realPodcasts, ...podcasts];

  const uniqueCreators = allPodcastsMerged.reduce((acc, podcast) => {
    // Handle API podcasts (with user object)
    if (podcast.user && typeof podcast.user === 'object') {
      if (!acc.find(c => c._id === podcast.user._id)) {
        acc.push({
          _id: podcast.user._id,
          username: podcast.user.username || podcast.author,
          profilePicture: podcast.user.profilePicture,
          latestPodcastImage: podcast.image,
          isStatic: false
        });
      }
    }
    // Handle Static podcasts
    else if (podcast.author) {
      if (!acc.find(c => c.username === podcast.author)) {
        acc.push({
          _id: podcast.id,
          username: podcast.author,
          profilePicture: null,
          latestPodcastImage: podcast.image,
          isStatic: true
        });
      }
    }
    return acc;
  }, []);

  // Extract videos from realPodcasts
  const userVideos = realPodcasts
    .filter(p => p.type === 'video')
    .map(p => ({
      id: p._id,
      title: p.title,
      channel: p.user ? { name: p.user.username, id: p.user._id } : { name: p.author, id: null },
      videoUrl: p.videoUrl, // Local video URL
      thumbnail: p.image,
      // No videoId for YouTube, so we rely on videoUrl logic in VideoPlayer
    }));

  // Combine user videos with static featured videos
  // User videos first, then static
  const allFeaturedVideos = [...userVideos, ...featuredVideos];
  const displayVideos = showAllFeaturedVideos ? allFeaturedVideos : allFeaturedVideos.slice(0, 3);

  // Logic for Audio Podcasts Section
  const handlePlayAudio = (track) => {
    if (!currentUser) {
      if (confirm("You must be signed in to listen to audio podcasts. Go to login?")) {
        navigate("/login");
      }
      return;
    }
    playTrack(track);
  };

  // Generate 10 Sample Audio Items (using real uploaded files if available, else placeholders)
  // We use the 2 files we saw: audio-1765979900780.mp3, audio-1765994527600.mp3
  // If realPodcasts has audio files, use them.
  const uploadedAudioPodcasts = realPodcasts.filter(p => !p.type || p.type === 'audio');

  // Create a list of 10 items, cycling through available content
  const sampleAudioItems = Array.from({ length: 10 }).map((_, i) => {
    // Use uploaded podcast if available, else cycle key
    const sourcePodcast = uploadedAudioPodcasts[i % uploadedAudioPodcasts.length] || podcasts[i % podcasts.length];

    // Fallback audio URLs if the source doesn't have one that works
    // We point to the ones we know exist in uploads/audio if meaningful, or use the source's url
    let audioUrl = sourcePodcast.audioUrl;

    // For demo purposes, forced mapping to known files if no url
    if (!audioUrl || !audioUrl.includes('mp3')) {
      // Toggle between the 2 known files
      audioUrl = i % 2 === 0 ? "/uploads/audio/audio-1765979900780.mp3" : "/uploads/audio/audio-1765994527600.mp3";
    }

    return {
      id: `sample-audio-${i}`,
      title: `Episode ${i + 1}: ${sourcePodcast.title}`,
      podcast: sourcePodcast.author || sourcePodcast.user?.username || "Unknown",
      image: sourcePodcast.image?.startsWith('/') ? `${BASE_URL}${sourcePodcast.image}` : sourcePodcast.image,
      audioUrl: audioUrl,
      duration: sourcePodcast.episodes?.[0]?.duration || "10:00"
    };
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow animation-delay-300" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  The #1 Choice for Indian Audio
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
                Discover the
                <span className="bg-gradient-to-r from-primary via-orange-500 to-rose-600 text-transparent bg-clip-text block mt-2 mb-4">
                  Future of Audio
                </span>
                Experience
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Unlock a universe of stories, knowledge, and entertainment with ALPHA Podcast Platform.
                Stream the best Indian creators in high-definition audio.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button variant="hero" size="xl" className="h-16 px-8 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300" asChild>
                  <Link to="/browse" className="gap-3">
                    <Play className="w-6 h-6 fill-current" />
                    Start Listening Free
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="h-16 px-8 text-lg border-2 hover:bg-white/5 backdrop-blur-sm" asChild>
                  <Link to="/browse" className="gap-3">
                    <Headphones className="w-6 h-6" />
                    Explore Library
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="font-display text-3xl font-bold">50+</p>
                  <p className="text-sm text-muted-foreground">Podcasters</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="font-display text-3xl font-bold">100M+</p>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="font-display text-3xl font-bold">1000+</p>
                  <p className="text-sm text-muted-foreground">Episodes</p>
                </div>
              </div>
            </div>

            {/* Featured Podcast Card */}
            <div className="relative hidden lg:block animate-fade-up animation-delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative glass-card p-6 rounded-3xl">
                <div className="flex gap-6">
                  <img
                    src={featuredPodcast.image}
                    alt={featuredPodcast.title}
                    className="w-40 h-40 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      Featured Podcast
                    </span>
                    <h3 className="font-display text-2xl font-bold mt-2">
                      {featuredPodcast.title}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {featuredPodcast.author}
                    </p>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {featuredPodcast.description}
                    </p>
                    <Button variant="hero" size="sm" className="mt-4" asChild>
                      <Link to={`/podcast/${featuredPodcast.id}`}>
                        Watch Now
                      </Link>
                    </Button>
                  </div>
                </div>
                {/* Audio Wave Animation */}
                <div className="flex items-end gap-1 h-8 mt-6">
                  {[...Array(20)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-primary/60 rounded-full wave-bar"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Youtube className="w-6 h-6 text-red-500" />
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Featured Videos
              </h2>
            </div>
            <button
              onClick={() => setShowAllFeaturedVideos(!showAllFeaturedVideos)}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 font-medium group bg-transparent border-none cursor-pointer"
            >
              {showAllFeaturedVideos ? 'Show Less' : 'View All'}
              <span className={`transition-transform duration-300 ${showAllFeaturedVideos ? '-rotate-90' : 'group-hover:translate-x-1'}`}>
                →
              </span>
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {displayVideos.map((video) => (
              <div key={video.id} className="space-y-3">
                <VideoPlayer
                  videoId={video.id}
                  title={video.title}
                  videoUrl={video.videoUrl}
                  thumbnail={getImageUrl(video.thumbnail)} // Pass thumbnail here
                />
                <div>
                  <h3 className="font-display font-semibold">{video.title}</h3>
                  {video.channel && typeof video.channel === 'object' && video.channel.id ? (
                    <Link to={`/creator/${video.channel.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {video.channel.name}
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">{typeof video.channel === 'object' ? video.channel.name : video.channel}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audio Podcasts Section (NEW) */}
      <section className="py-16 bg-[#0f0f0f] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Headphones className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Audio Podcasts
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {sampleAudioItems.map((item) => (
              <div key={item.id} className="group relative bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <img
                    src={getImageUrl(item.image) || item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePlayAudio(item)}
                      className="bg-primary text-white p-3 rounded-full hover:scale-110 transition-transform flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 duration-300"
                    >
                      {currentUser ? (
                        <Play className="w-6 h-6 ml-1 fill-current" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1">{item.podcast}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Explore Categories
            </h2>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 font-medium group bg-transparent border-none cursor-pointer"
            >
              {showAllCategories ? 'Show Less' : 'View All'}
              <span className={`transition-transform duration-300 ${showAllCategories ? '-rotate-90' : 'group-hover:translate-x-1'}`}>
                →
              </span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-10">
            {/* Combine default categories with any new ones found in uploaded podcasts */}
            {(() => {
              const uploadedCategories = realPodcasts.map(p => p.category).filter(Boolean);
              const uniqueCategories = Array.from(new Set([...categories, ...uploadedCategories]));
              const displayCategories = showAllCategories ? uniqueCategories : uniqueCategories.slice(0, 10);

              return displayCategories.map((category, index) => (
                <Link
                  key={category}
                  to={`/browse?category=${category}`}
                  className="flex flex-col items-center gap-3 group w-20 md:w-24"
                >
                  {/* Circle Container */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300 group-hover:scale-110 group-active:scale-95">

                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-100 transition-all duration-300
                      ${index % 4 === 0 ? 'from-orange-500 to-red-600 group-hover:from-orange-400 group-hover:to-red-500' : ''}
                      ${index % 4 === 1 ? 'from-blue-500 to-indigo-600 group-hover:from-blue-400 group-hover:to-indigo-500' : ''}
                      ${index % 4 === 2 ? 'from-green-500 to-teal-600 group-hover:from-green-400 group-hover:to-teal-500' : ''}
                      ${index % 4 === 3 ? 'from-purple-500 to-pink-600 group-hover:from-purple-400 group-hover:to-pink-500' : ''}
                    `} />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Icon */}
                    <div className="relative z-10 w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110">
                      {(() => {
                        const IconComponent = {
                          "All": LayoutGrid,
                          "Business": Briefcase,
                          "Motivation": Zap,
                          "Finance": DollarSign,
                          "Comedy": Smile,
                          "Spirituality": Flower2,
                          "Crime": Siren,
                          "News": Newspaper,
                          "Lifestyle": Coffee,
                          "Mindfulness": Brain,
                          "Nutrition": Apple,
                          "Fitness": Dumbbell,
                          "Mental Health": HeartHandshake,
                          "Fashion": Shirt,
                          "Travel": Plane,
                          "Food & Cooking": Utensils,
                          "Minimalism": Box,
                          "Relationships": Heart,
                          "Horror Stories": Ghost,
                          "Mystery": Search,
                          "Storytelling": BookOpen,
                          "Stand-Up Clips": Mic,
                          "Drama": Clapperboard,
                          "Mythology": Scroll,
                          "History": Hourglass,
                          "Kids Stories": Baby,
                          "Entrepreneurship": Rocket,
                          "Law": Scale,
                          "Economics": BarChart,
                          "World News": Globe,
                          "Politics": Landmark,
                          "Personal Finance": Wallet,
                          "Leadership": Crown
                        }[category] || Play;
                        return <IconComponent className="w-full h-full" />;
                      })()}
                    </div>
                  </div>

                  {/* Text Label */}
                  <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {category}
                  </span>
                </Link>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Trending Podcasts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Top Indian Podcasters
              </h2>
            </div>
            <button
              onClick={() => setShowAllPodcasters(!showAllPodcasters)}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 font-medium group bg-transparent border-none cursor-pointer"
            >
              {showAllPodcasters ? 'Show Less' : 'View All'}
              <span className={`transition-transform duration-300 ${showAllPodcasters ? '-rotate-90' : 'group-hover:translate-x-1'}`}>
                →
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Display Unique Creators first */}
            {(showAllPodcasters ? uniqueCreators : uniqueCreators.slice(0, 6)).map(creator => (
              <Link
                key={creator._id}
                to={creator.isStatic ? `/podcast/${creator._id}` : `/creator/${creator._id}`}
                className="group relative flex flex-col gap-3 p-3 rounded-3xl transition-all duration-300 hover:bg-white/5 animate-fade-up"
              >
                <div className="relative aspect-square rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-300 border-4 border-white/5 group-hover:border-primary/50">
                  <img
                    src={creator.profilePicture ? getImageUrl(creator.profilePicture) : getImageUrl(creator.latestPodcastImage)}
                    alt={creator.username}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="text-center px-1">
                  <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {creator.username}
                  </h3>
                  <p className="text-sm text-muted-foreground">Content Creator</p>
                </div>
              </Link>
            ))}

            {/* If no creators yet, show fallback static content (optional, filtered to avoid duplicates if needed) */}
            {uniqueCreators.length === 0 && [...podcasts].slice(0, 6).map((podcast) => (
              <PodcastCard
                key={podcast._id || podcast.id}
                id={podcast.id}
                title={podcast.title}
                author={podcast.author || "Unknown"}
                image={podcast.image?.startsWith('/uploads') ? `${BASE_URL}${podcast.image}` : podcast.image}
                category={podcast.category}
                className="animate-fade-up"
              />
            ))}
          </div>
        </div>
      </section>

      {/* More Podcasters */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              More Popular Shows
            </h2>
            <button
              onClick={() => setShowAllPopularShows(!showAllPopularShows)}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 font-medium group bg-transparent border-none cursor-pointer"
            >
              {showAllPopularShows ? 'Show Less' : 'View All'}
              <span className={`transition-transform duration-300 ${showAllPopularShows ? '-rotate-90' : 'group-hover:translate-x-1'}`}>
                →
              </span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(showAllPopularShows ? podcasts.slice(12) : podcasts.slice(12, 18)).map((podcast) => (
              <PodcastCard
                key={podcast.id}
                id={podcast.id}
                title={podcast.title}
                author={podcast.author}
                image={podcast.image}
                category={podcast.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Audio Podcasts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Latest Audio Podcasts
            </h2>
            <Link
              to="/browse"
              className="text-sm text-primary hover:underline font-medium"
            >
              View All
            </Link>
          </div>

          {/* Logic to get latest unique audio podcasts from real uploads + fallback */}
          {(() => {
            // 1. Get real audio podcasts associated with users
            const realAudio = realPodcasts.filter(p => !p.type || p.type === 'audio');

            // 2. Reduce to unique creators (showing their latest upload)
            const uniqueAudio = realAudio.reduce((acc, podcast) => {
              const userId = podcast.user && typeof podcast.user === 'object' ? podcast.user._id : podcast.author;
              const exists = acc.find(p => {
                const pUserId = p.user && typeof p.user === 'object' ? p.user._id : p.author;
                return pUserId === userId;
              });
              if (!exists) acc.push(podcast);
              return acc;
            }, []);

            // 3. Fallback to static podcasts if empty (just for demo if needed, or leave empty)
            // Using 'podcasts' array imported from data
            if (uniqueAudio.length === 0 && realPodcasts.length === 0) {
              // Demo mode: slice some static podcasts
              uniqueAudio.push(...podcasts.filter(p => !p.type).slice(0, 4));
            }

            const displayList = uniqueAudio.slice(0, 8); // Show up to 8

            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayList.map((podcast) => (
                  <PodcastCard
                    key={podcast._id || podcast.id}
                    id={podcast.id || podcast._id}
                    title={podcast.title}
                    author={podcast.author || (podcast.user?.username)}
                    image={getImageUrl(podcast.image)} // Use helper
                    category={podcast.category}
                    userId={podcast.user?._id} // For profile link
                    authorImg={podcast.user?.profilePicture ? getImageUrl(podcast.user.profilePicture) : null} // Pass profile pic
                  />
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative glass-card rounded-3xl p-8 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Never Miss an Episode
              </h2>
              <p className="text-muted-foreground mb-8">
                Subscribe to get notified when your favorite Indian podcasters
                release new episodes. It's free!
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-6 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground w-full sm:w-auto min-w-[300px]"
                />
                <Button type="submit" variant="hero" size="lg" disabled={loading}>
                  {loading ? 'Subscribing...' : 'Subscribe Free'}
                </Button>
              </form>
              {message && (
                <p className={`mt-4 text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout >
  );
};

export default Index;