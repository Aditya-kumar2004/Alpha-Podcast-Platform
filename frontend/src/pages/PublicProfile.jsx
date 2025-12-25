import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ListMusic, Play, CloudUpload, ArrowLeft } from 'lucide-react';
import PodcastCard from '@/components/podcast/PodcastCard';
import VideoPlayer from '@/components/podcast/VideoPlayer';
import { useAuth } from '@/context/AuthContext';
import { API_URL, BASE_URL } from '@/lib/api';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const normalizedPath = path.replace(/\\/g, '/');
    const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    return `${BASE_URL}${finalPath}`;
};

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('uploads');
    const [mediaType, setMediaType] = useState('audio');

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/users/${id}/public-profile`);
                const data = await res.json();
                if (res.ok) {
                    setProfileData(data);
                    setSubscriberCount(data.user.subscribers ? data.user.subscribers.length : 0);

                    // Check subscription status
                    if (currentUser && data.user.subscribers) {
                        setIsSubscribed(data.user.subscribers.includes(currentUser._id));
                    }

                    // Smart default: if no audio but has video, switch to video
                    const hasAudio = data.podcasts.some(p => !p.type || p.type === 'audio');
                    const hasVideo = data.podcasts.some(p => p.type === 'video');
                    if (hasVideo && !hasAudio) {
                        setMediaType('video');
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id, currentUser]);

    const handleSubscribe = async () => {
        if (!currentUser) return alert("Please login to subscribe");
        if (!profileData?.user) return;

        try {
            const res = await fetch(`${API_URL}/interactions/subscribe/${profileData.user._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setIsSubscribed(data.isSubscribed);
                setSubscriberCount(data.subscribersCount);
            }
        } catch (error) {
            console.error("Subscription failed", error);
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>
        </Layout>
    );

    if (!profileData) return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen text-white">User not found</div>
        </Layout>
    );

    const { user, podcasts } = profileData;
    const audioCount = podcasts.filter(p => !p.type || p.type === 'audio').length;
    const videoCount = podcasts.filter(p => p.type === 'video').length;

    const preview = user.profilePicture ? getImageUrl(user.profilePicture) : null;

    return (
        <Layout>
            <div className="min-h-screen bg-background relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 py-24 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            <Link to="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-4">
                                <ArrowLeft className="w-4 h-4" /> Back to Browse
                            </Link>

                            <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl text-center">
                                <div className="relative mx-auto w-32 h-32 mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary border-4 border-white/5 shadow-2xl relative">
                                        {preview ? (
                                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground bg-gradient-to-tr from-primary/20 to-purple-500/20">
                                                {user.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold font-display">{user.username}</h2>
                                <p className="text-sm text-muted-foreground mb-4">{subscriberCount} Subscribers</p>

                                {currentUser && currentUser._id !== user._id && (
                                    <Button
                                        onClick={handleSubscribe}
                                        variant={isSubscribed ? "secondary" : "default"}
                                        className={`w-full mb-2 ${isSubscribed ? "bg-white/10 hover:bg-white/20" : "bg-red-600 hover:bg-red-700 text-white"}`}
                                    >
                                        {isSubscribed ? "Subscribed" : "Subscribe"}
                                    </Button>
                                )}

                                {user.isVerified && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Verified Creator
                                    </div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-xl">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 text-white">
                                        <div className="flex items-center gap-3">
                                            <CloudUpload className="w-5 h-5 text-primary" />
                                            <span className="font-medium">All Uploads</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-9 space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setMediaType('audio')}
                                    className={`bg-[#1a1a1a]/50 backdrop-blur-xl border rounded-3xl p-6 shadow-xl cursor-pointer transition-all duration-300 hover:bg-white/5 group ${mediaType === 'audio' ? 'border-primary/50 ring-2 ring-primary/20' : 'border-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className={`p-3 rounded-2xl transition-colors ${mediaType === 'audio' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground'}`}>
                                            <ListMusic className="w-6 h-6" />
                                        </div>
                                        <span className="text-3xl font-bold font-display">{audioCount}</span>
                                    </div>
                                    <p className={`text-sm font-medium pl-1 transition-colors ${mediaType === 'audio' ? 'text-primary' : 'text-muted-foreground group-hover:text-white'}`}>Audio Uploads</p>
                                </div>
                                <div
                                    onClick={() => setMediaType('video')}
                                    className={`bg-[#1a1a1a]/50 backdrop-blur-xl border rounded-3xl p-6 shadow-xl cursor-pointer transition-all duration-300 hover:bg-white/5 group ${mediaType === 'video' ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className={`p-3 rounded-2xl transition-colors ${mediaType === 'video' ? 'bg-purple-600 text-white' : 'bg-white/5 text-purple-500 group-hover:bg-purple-600 group-hover:text-white'}`}>
                                            <Play className="w-6 h-6" />
                                        </div>
                                        <span className="text-3xl font-bold font-display">{videoCount}</span>
                                    </div>
                                    <p className={`text-sm font-medium pl-1 transition-colors ${mediaType === 'video' ? 'text-purple-400' : 'text-muted-foreground group-hover:text-white'}`}>Video Uploads</p>
                                </div>
                            </div>

                            {/* Content Tabs */}
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold font-display">Creator Uploads</h3>

                                    <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl">
                                        <button
                                            onClick={() => setMediaType('audio')}
                                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mediaType === 'audio'
                                                ? 'bg-primary text-primary-foreground shadow-lg'
                                                : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            Audio
                                        </button>
                                        <button
                                            onClick={() => setMediaType('video')}
                                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mediaType === 'video'
                                                ? 'bg-purple-600 text-white shadow-lg'
                                                : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            Video
                                        </button>
                                    </div>
                                </div>

                                {podcasts.filter(p => p.type === mediaType || (!p.type && mediaType === 'audio')).length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {podcasts
                                            .filter(p => p.type === mediaType || (!p.type && mediaType === 'audio'))
                                            .map((podcast) => (
                                                mediaType === 'video' ? (
                                                    <div key={podcast.id || podcast._id} className="space-y-3 cursor-pointer group" onClick={() => navigate(`/podcast/${podcast.id || podcast._id}`)}>
                                                        <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/5 bg-black/50">
                                                            {/* Thumbnail or Video Preview */}
                                                            {podcast.image ? (
                                                                <img src={getImageUrl(podcast.image)} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                            ) : (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                                                    <Play className="w-12 h-12 text-white/50" />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Play className="w-12 h-12 text-white fill-white" />
                                                            </div>
                                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs font-bold text-white">Video</div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-display font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">{podcast.title}</h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                                                {podcast.views || 0} views • {new Date(podcast.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <PodcastCard
                                                        key={podcast._id || podcast.id}
                                                        id={podcast.id}
                                                        title={podcast.title}
                                                        author={podcast.author || user.username}
                                                        image={getImageUrl(podcast.image)}
                                                        category={podcast.category}
                                                    />
                                                )
                                            ))}
                                    </div>
                                ) : (
                                    <div className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                            {mediaType === 'video' ? <Play className="w-8 h-8 text-muted-foreground/50" /> : <ListMusic className="w-8 h-8 text-muted-foreground/50" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">No {mediaType} uploads</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                This creator hasn't uploaded any {mediaType} content yet.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PublicProfile;
