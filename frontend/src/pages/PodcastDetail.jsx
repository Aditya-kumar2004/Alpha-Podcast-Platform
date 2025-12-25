import { useParams, useNavigate, Link } from "react-router-dom";
import { Play, Share2, Star, Users, ArrowLeft, Youtube, Heart, ListMusic, Check, X, ThumbsUp, ThumbsDown, UserPlus, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import VideoPlayer from "@/components/podcast/VideoPlayer";
import { Button } from "@/components/ui/button";
import { fetchPodcastById, API_URL, BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useAudio } from "@/context/AudioContext";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalizedPath = path.replace(/\\/g, '/');
  const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `${BASE_URL}${finalPath}`;
};

const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playTrack, isPlaying, togglePlay } = useAudio();

  // Interactions State
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [inLibrary, setInLibrary] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Data State
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const { data: podcast, isLoading, error } = useQuery({
    queryKey: ['podcast', id],
    queryFn: () => fetchPodcastById(id),
    enabled: !!id
  });

  // Auto-pause audio context when video player is active
  useEffect(() => {
    if ((activeVideo || podcast?.type === 'video') && isPlaying) {
      togglePlay();
    }
  }, [activeVideo, podcast, isPlaying, togglePlay]);

  // Initialize View & Determine content type
  useEffect(() => {
    if (podcast) {
      // Check if it's a single video podcast
      const isVideoPodcast = podcast.type === 'video' || !!podcast.videoUrl;

      if (isVideoPodcast) {
        setActiveVideo({
          type: 'uploaded',
          id: podcast.id || podcast._id, // Ensure we have an ID
          title: podcast.title,
          videoUrl: podcast.videoUrl,
          date: podcast.createdAt
        });

        // Increment View Count
        fetch(`${API_URL}/interactions/view/${id}`, { method: 'POST' })
          .catch(err => console.error("Failed to increment view", err));
      }

      // Set initial counts
      setLikesCount(podcast.likes ? podcast.likes.length : 0);

      // Fetch Related Videos (More from Creator)
      if (podcast.user) {
        const userId = typeof podcast.user === 'object' ? podcast.user._id : podcast.user;
        fetch(`${API_URL}/users/${userId}/public-profile`)
          .then(res => res.json())
          .then(data => {
            // Filter out current video
            const others = data.podcasts.filter(p => p.id !== id && p._id !== id && (p.type === 'video' || p.videoUrl));
            setRelatedVideos(others);
          })
          .catch(err => console.error("Failed to load related", err));
      }
    }
  }, [podcast, id]);

  // Check User Interactions
  useEffect(() => {
    const checkUserInteractions = async () => {
      if (!user || !user.token) return;

      try {
        // 1. Profile Data (Likes/Library/Subs)
        const res = await fetch(`${API_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();

        if (res.ok) {
          const isLiked = data.likedPodcasts.some(p => p.id === id || p._id === id);
          const isInLib = data.library.some(p => p.id === id || p._id === id);
          setIsLiked(isLiked);
          setInLibrary(isInLib);

          if (podcast && podcast.dislikes) {
            setIsDisliked(podcast.dislikes.includes(user._id));
          }

          if (podcast && podcast.user) {
            const creatorId = typeof podcast.user === 'object' ? podcast.user._id : podcast.user;
            setIsSubscribed(data.subscribedTo && data.subscribedTo.includes(creatorId));
          }
        }
      } catch (err) {
        console.error("Failed to fetch interactions", err);
      }
    };

    if (podcast) checkUserInteractions();
  }, [user, id, podcast]);

  // Fetch Comments
  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/interactions/comments/${id}`)
        .then(res => res.json())
        .then(data => setComments(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  /* HANDLERS */
  const handleLike = async () => {
    if (!user) return alert("Please login to like");
    try {
      // Optimistic
      const wasLiked = isLiked;
      setIsLiked(!wasLiked);
      setIsDisliked(false); // Can't be both
      setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

      const res = await fetch(`${API_URL}/interactions/like/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title: podcast.title,
          image: podcast.image, // For playlist
          author: podcast.author
        })
      });
      const data = await res.json();
      if (res.ok) setLikesCount(data.likesCount);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleDislike = async () => {
    if (!user) return alert("Please login to dislike");
    try {
      // Optimistic
      const wasDisliked = isDisliked;
      setIsDisliked(!wasDisliked);
      setIsLiked(false); // Can't be both
      if (isLiked) setLikesCount(prev => prev - 1); // Remove like if switching

      await fetch(`${API_URL}/interactions/dislike/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
    } catch (error) {
      console.error("Dislike failed", error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return alert("Please login to subscribe");
    const creatorId = typeof podcast.user === 'object' ? podcast.user._id : podcast.user;

    try {
      setIsSubscribed(!isSubscribed);
      await fetch(`${API_URL}/interactions/subscribe/${creatorId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
    } catch (error) {
      setIsSubscribed(!isSubscribed); // Revert
      console.error(error);
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;

    try {
      const res = await fetch(`${API_URL}/interactions/comment/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ text: commentText })
      });
      const newComment = await res.json();
      if (res.ok) {
        setComments([newComment, ...comments]);
        setCommentText('');
      }
    } catch (error) {
      console.error("Comment failed", error);
    }
  };

  const handlePlayAudio = (episode) => {
    if (!user) {
      if (confirm("You must be signed in to listen to audio podcasts. Go to login?")) {
        navigate("/login");
      }
      return;
    }

    // Determine correct audio source:
    // 1. Episode argument (if valid)
    // 2. Podcast root audioUrl (for single-file podcasts)
    let trackToPlay = {};

    if (episode && episode.audioUrl) {
      trackToPlay = {
        id: episode.id || episode._id, // Handle MongoID or String ID
        title: episode.title,
        artist: podcast.author || "Unknown",
        image: getImageUrl(podcast.image),
        audioUrl: episode.audioUrl,
        duration: episode.duration
      };
    } else if (podcast.audioUrl) {
      trackToPlay = {
        id: podcast.id || podcast._id,
        title: podcast.title,
        artist: podcast.author || "Unknown",
        image: getImageUrl(podcast.image),
        audioUrl: podcast.audioUrl, // Use root audio
        duration: "Unknown"
      };
    } else {
      console.error("No audio source found");
      return;
    }

    playTrack(trackToPlay);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (isLoading) return <Layout><div className="text-center py-20">Loading...</div></Layout>;
  if (error || !podcast) return <Layout><div className="text-center py-20">Podcast not found</div></Layout>;

  // Use Active Video mode heavily if it's a video podcast
  if (activeVideo || podcast.type === 'video') {
    const videoToPlay = activeVideo || {
      type: 'uploaded',
      videoUrl: podcast.videoUrl,
      title: podcast.title,
      id: podcast.id
    };

    return (
      <Layout>
        <div className="min-h-screen bg-black/95 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="grid lg:grid-cols-12 gap-6">

              {/* LEFT COLUMN: Player & Info */}
              <div className="lg:col-span-8">
                {/* Player Container */}
                <div className="rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10 aspect-video mb-4 relative z-10">
                  <VideoPlayer
                    videoId={videoToPlay.type === 'youtube' ? videoToPlay.id : undefined}
                    videoUrl={videoToPlay.videoUrl}
                    title={videoToPlay.title}
                    thumbnail={getImageUrl(podcast.image)}
                    onPlay={() => {
                      if (isPlaying) togglePlay();
                    }}
                  />
                </div>

                {/* Title */}
                <h1 className="text-xl md:text-2xl font-bold font-display mb-2">{videoToPlay.title}</h1>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
                  {/* Creator Info */}
                  <div className="flex items-center gap-3">
                    <Link to={`/creator/${typeof podcast.user === 'object' ? podcast.user._id : podcast.user}`} className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                        {podcast.user && podcast.user.profilePicture ? (
                          <img src={getImageUrl(podcast.user.profilePicture)} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-primary to-purple-600">
                            {podcast.author?.[0]}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div>
                      <Link to={`/creator/${typeof podcast.user === 'object' ? podcast.user._id : podcast.user}`} className="font-bold hover:text-primary transition-colors block">
                        {podcast.author}
                      </Link>
                      <span className="text-xs text-muted-foreground">{podcast.subscribers || "0"} subscribers</span>
                    </div>
                    <Button
                      size="sm"
                      className={`ml-4 rounded-full ${isSubscribed ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                      onClick={handleSubscribe}
                    >
                      {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </Button>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/10 rounded-full overflow-hidden">
                      <Button variant="ghost" size="sm" className="rounded-none hover:bg-white/20 gap-2 px-4" onClick={handleLike}>
                        <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                        {likesCount}
                      </Button>
                      <div className="w-[1px] h-6 bg-white/20"></div>
                      <Button variant="ghost" size="sm" className="rounded-none hover:bg-white/20 px-4" onClick={handleDislike}>
                        <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-white' : ''}`} />
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" className="rounded-full bg-white/10 hover:bg-white/20 gap-2" onClick={handleShare}>
                      <Share2 className="w-4 h-4" /> Share
                    </Button>

                    <Button variant="ghost" size="sm" className="rounded-full bg-white/10 hover:bg-white/20 gap-2">
                      <Download className="w-4 h-4" /> Download
                    </Button>
                  </div>
                </div>

                {/* Description Box */}
                <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex gap-4 font-bold mb-2">
                    <span>{podcast.views || 0} views</span>
                    <span>{new Date(podcast.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {podcast.description}
                  </p>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="font-bold text-xl mb-6">{comments.length} Comments</h3>

                  {/* Add Comment */}
                  <div className="flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {user?.profilePicture ? (
                        <img src={getImageUrl(user.profilePicture)} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold">{user?.username?.[0] || "?"}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-b border-white/20 pb-2 focus:border-white focus:outline-none transition-colors"
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={handleComment} disabled={!commentText.trim()} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment._id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {comment.user.profilePicture ? (
                            <img src={getImageUrl(comment.user.profilePicture)} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold">{comment.user.username?.[0] || "?"}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.user.username}</span>
                            <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-300">{comment.text}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10"><ThumbsUp className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10"><ThumbsDown className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-6 text-xs hover:bg-white/10 rounded-full px-2">Reply</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sidebar (Up Next) */}
              <div className="lg:col-span-4">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">From {podcast.author}</h3>
                  {relatedVideos.length > 0 ? relatedVideos.map((vid) => (
                    <div
                      key={vid.id || vid._id}
                      className="flex gap-2 cursor-pointer group"
                      onClick={() => navigate(`/podcast/${vid.id || vid._id}`)}
                    >
                      <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        {vid.image ? (
                          <img src={getImageUrl(vid.image)} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center"><Play className="w-6 h-6 opacity-50" /></div>
                        )}
                        <div className="absolute bottom-1 right-1 px-1 bg-black/80 rounded text-[10px] font-bold">Video</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{vid.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{podcast.author}</p>
                        <p className="text-xs text-muted-foreground">{vid.views || 0} views • {new Date(vid.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-sm">No other videos found.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Default Fallback to standard view if it's purely audio and no active video (Code for standard audio view omitted for brevity, but could optionally be kept if mixed types exist)
  // For now, given the request, let's assume if it's audio, we show the standard page, but current request is focused on Video.
  // I will include the Standard Audio View briefly here or simple redirect helper.

  // ... (Existing Audio Layout if needed or just return null/redirect)
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 bg-background min-h-screen">
        <Link to="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <div className="flex flex-col md:flex-row gap-8">
          <img src={getImageUrl(podcast.image)} alt={podcast.title} className="w-64 h-64 rounded-full object-cover shadow-2xl animate-[spin_10s_linear_infinite]" />
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold font-display">{podcast.title}</h1>
            <p className="text-xl text-muted-foreground">By {podcast.author}</p>
            <div className="flex gap-4">
              <Button size="lg" className="rounded-full gap-2" onClick={() => handlePlayAudio(podcast.episodes[0] || {})}>
                <Play className="fill-current w-5 h-5" /> Play Audio
              </Button>
              <Button variant="outline" size="lg" className="rounded-full gap-2" onClick={handleLike}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-primary text-primary' : ''}`} /> {isLiked ? 'Liked' : 'Like'}
              </Button>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl mt-8">
              <h3 className="font-bold text-lg mb-4">Audio Episodes</h3>
              {podcast.episodes.map(ep => (
                <div key={ep.id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg cursor-pointer" onClick={() => handlePlayAudio(ep)}>
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Play className="w-4 h-4 ml-0.5 fill-current" /></div>
                    <span className="font-medium">{ep.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{ep.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PodcastDetail;