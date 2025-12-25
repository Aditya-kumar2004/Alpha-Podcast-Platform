import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Camera, Save, User, Clock, Heart, ListMusic, Settings, ChevronRight, Play, CloudUpload, Edit, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PodcastCard from '@/components/podcast/PodcastCard';
import VideoPlayer from '@/components/podcast/VideoPlayer';
import { API_URL, BASE_URL } from '@/lib/api';

const Profile = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(user?.profilePicture ? `${BASE_URL}${user.profilePicture}` : null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // User Data State
    const [profileData, setProfileData] = useState(null);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    // Password state
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Account Deletion State
    const [deletionStep, setDeletionStep] = useState('idle'); // idle, reason, otp
    const [deleteReason, setDeleteReason] = useState('');
    const [deleteOtp, setDeleteOtp] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [myPodcasts, setMyPodcasts] = useState([]);
    const [uploadMediaType, setUploadMediaType] = useState('audio');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = user?.token;
                if (!token) return;

                const res = await fetch(`${API_URL}/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setProfileData(data);

                const uploadsRes = await fetch(`${API_URL}/podcasts/my-podcasts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const uploadsData = await uploadsRes.json();
                if (uploadsRes.ok) setMyPodcasts(uploadsData);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setFetchingProfile(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user, activeTab]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!image) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const token = user.token;
            const res = await fetch(`${API_URL}/auth/upload-profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                login(data);
                alert('Profile updated successfully!');
                setImage(null);
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match");
            return;
        }

        setPasswordLoading(true);
        try {
            const token = user.token;
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Password changed successfully');
                setPasswords({ current: '', new: '', confirm: '' });
            } else {
                alert(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeletePodcast = async (podcastId) => {
        if (!confirm("Are you sure you want to delete this podcast?")) return;

        try {
            const token = user.token;
            const res = await fetch(`${API_URL}/podcasts/${podcastId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setMyPodcasts(myPodcasts.filter(p => p.id !== podcastId));
                alert("Podcast deleted successfully");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete podcast");
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleSendDeleteOtp = async () => {
        if (!deleteReason.trim()) {
            alert("Please provide a reason for deleting your account");
            return;
        }

        setDeleteLoading(true);
        try {
            const token = user.token;
            const res = await fetch(`${API_URL}/users/delete-otp`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setDeletionStep('otp');
                alert("OTP sent to your email address");
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error("OTP send failed", error);
            alert("Something went wrong");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleVerifyAndDelete = async () => {
        if (deleteOtp.length !== 6) {
            alert("Please enter a valid 6-digit OTP");
            return;
        }

        if (!confirm("FINAL WARNING: This will permanently delete your account. Are you sure?")) return;

        setDeleteLoading(true);
        try {
            const token = user.token;
            const res = await fetch(`${API_URL}/users/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    otp: deleteOtp,
                    reason: deleteReason
                })
            });

            if (res.ok) {
                alert("Account deleted successfully. We're sorry to see you go.");
                logout();
                navigate('/');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error("Delete account failed", error);
            alert("Something went wrong");
        } finally {
            setDeleteLoading(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        // Normalize slashes for Windows compatibility
        const normalizedPath = path.replace(/\\/g, '/');
        // Ensure leading slash
        const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
        return `${BASE_URL}${finalPath}`;
    };

    const handleEdit = (podcastId) => {
        navigate(`/upload?edit=${podcastId}`);
    };

    const handleUnlike = async (podcastId) => {
        if (!confirm("Remove from liked podcasts?")) return;
        try {
            const token = user.token;
            // Toggle like to remove it (endpoint toggles)
            const res = await fetch(`${API_URL}/users/like/${podcastId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                // Update local state
                setProfileData(prev => ({
                    ...prev,
                    likedPodcasts: prev.likedPodcasts.filter(p => p.id !== podcastId)
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const safePodcasts = Array.isArray(myPodcasts) ? myPodcasts : [];
    const audioCount = safePodcasts.filter(p => !p.type || p.type === 'audio').length;
    const videoCount = safePodcasts.filter(p => p.type === 'video').length;

    const stats = [
        { label: 'Audio Uploads', value: audioCount, icon: ListMusic, color: 'text-primary' },
        { label: 'Video Uploads', value: videoCount, icon: Play, color: 'text-purple-500' },
        { label: 'Podcasts Liked', value: profileData?.likedPodcasts?.length || 0, icon: Heart, color: 'text-red-500' },
    ];

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'uploads', label: 'My Uploads', icon: CloudUpload },
        { id: 'library', label: 'My Library', icon: ListMusic },
        { id: 'history', label: 'Listening History', icon: Clock },
        { id: 'liked', label: 'Liked Podcasts', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-background relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 py-24 relative z-10">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl text-center">
                                <div className="relative group mx-auto w-32 h-32 mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary border-4 border-white/5 shadow-2xl relative">
                                        {preview ? (
                                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground bg-gradient-to-tr from-primary/20 to-purple-500/20">
                                                {user?.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs font-medium text-white">Change</span>
                                        </div>
                                    </div>
                                    <label className="absolute bottom-1 right-1 p-2.5 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-lg hover:scale-110 border border-white/20">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                                <h2 className="text-xl font-bold font-display">{user?.username}</h2>
                                <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                                {image && (
                                    <Button size="sm" onClick={handleUpload} disabled={loading} className="w-full gap-2 mb-2">
                                        <Save className="w-4 h-4" />
                                        {loading ? 'Saving...' : 'Save Photo'}
                                    </Button>
                                )}
                                {user?.isVerified && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Verified
                                    </div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-xl">
                                <nav className="space-y-1">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            {activeTab === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-9 space-y-6">

                            {/* OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Audio Stats */}
                                        <div
                                            onClick={() => {
                                                setActiveTab('uploads');
                                                setUploadMediaType('audio');
                                            }}
                                            className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className={`p-3 rounded-2xl bg-white/5 text-primary`}>
                                                    <ListMusic className="w-6 h-6" />
                                                </div>
                                                <span className="text-3xl font-bold font-display">{audioCount}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium pl-1">Audio Uploads</p>
                                        </div>

                                        {/* Video Stats */}
                                        <div
                                            onClick={() => {
                                                setActiveTab('uploads');
                                                setUploadMediaType('video');
                                            }}
                                            className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className={`p-3 rounded-2xl bg-white/5 text-purple-500`}>
                                                    <Play className="w-6 h-6" />
                                                </div>
                                                <span className="text-3xl font-bold font-display">{videoCount}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium pl-1">Video Uploads</p>
                                        </div>

                                        {/* Liked Stats */}
                                        <div
                                            onClick={() => setActiveTab('liked')}
                                            className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:bg-white/5 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className={`p-3 rounded-2xl bg-white/5 text-red-500`}>
                                                    <Heart className="w-6 h-6" />
                                                </div>
                                                <span className="text-3xl font-bold font-display">{profileData?.likedPodcasts?.length || 0}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground font-medium pl-1">Podcasts Liked</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
                                        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                                                <Link to="/browse">
                                                    <ListMusic className="w-6 h-6 text-primary" />
                                                    Explore Podcasts
                                                </Link>
                                            </Button>
                                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => setActiveTab('settings')}>
                                                <Settings className="w-6 h-6 text-primary" />
                                                Edit Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MY UPLOADS */}
                            {activeTab === 'uploads' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold font-display">My Uploads</h3>
                                        <Button variant="hero" asChild>
                                            <Link to="/upload" className="gap-2">
                                                <CloudUpload className="w-4 h-4" />
                                                Upload New
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl w-fit mb-6">
                                        <button
                                            onClick={() => setUploadMediaType('audio')}
                                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${uploadMediaType === 'audio'
                                                ? 'bg-primary text-primary-foreground shadow-lg'
                                                : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            Audio
                                        </button>
                                        <button
                                            onClick={() => setUploadMediaType('video')}
                                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${uploadMediaType === 'video'
                                                ? 'bg-purple-600 text-white shadow-lg'
                                                : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            Video
                                        </button>
                                    </div>

                                    {(Array.isArray(myPodcasts) ? myPodcasts : []).filter(p => p.type === uploadMediaType || (!p.type && uploadMediaType === 'audio')).length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            {(Array.isArray(myPodcasts) ? myPodcasts : [])
                                                .filter(p => p.type === uploadMediaType || (!p.type && uploadMediaType === 'audio'))
                                                .map((podcast) => (
                                                    uploadMediaType === 'video' ? (
                                                        <div key={podcast._id || podcast.id} className="space-y-3">
                                                            <VideoPlayer
                                                                videoId={podcast.id}
                                                                videoUrl={podcast.videoUrl}
                                                                title={podcast.title}
                                                                thumbnail={getImageUrl(podcast.image)}
                                                            />
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="font-display font-semibold line-clamp-1">{podcast.title}</h3>
                                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                                        {podcast.author || user?.username}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => handleEdit(podcast.id)}>
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDeletePodcast(podcast.id)}>
                                                                        <Trash className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <PodcastCard
                                                            key={podcast._id || podcast.id}
                                                            id={podcast.id}
                                                            internalId={podcast._id}
                                                            title={podcast.title}
                                                            author={podcast.author || user?.username}
                                                            image={getImageUrl(podcast.image)}
                                                            category={podcast.category}
                                                            showActions={true}
                                                            onDelete={() => handleDeletePodcast(podcast.id)}
                                                            onEdit={() => handleEdit(podcast.id)}
                                                        />
                                                    )
                                                ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={uploadMediaType === 'video' ? Play : ListMusic}
                                            title={`No ${uploadMediaType} uploads`}
                                            description={`You haven't uploaded any ${uploadMediaType} podcasts yet.`}
                                            actionLink="/upload"
                                            actionText="Upload Now"
                                        />
                                    )}
                                </div>
                            )}

                            {/* MY LIBRARY */}
                            {activeTab === 'library' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold font-display">My Library</h3>
                                    {profileData?.library?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            {profileData.library.map((podcast) => (
                                                <PodcastCard
                                                    key={podcast._id}
                                                    id={podcast.id}
                                                    title={podcast.title}
                                                    author={podcast.author}
                                                    image={getImageUrl(podcast.image)}
                                                    category={podcast.category}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={ListMusic}
                                            title="Your library is empty"
                                            description="Save podcasts you want to listen to later."
                                            actionLink="/browse"
                                            actionText="Browse Podcasts"
                                        />
                                    )}
                                </div>
                            )}

                            {/* LISTENING HISTORY */}
                            {activeTab === 'history' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold font-display">Listening History</h3>
                                    {profileData?.history?.length > 0 ? (
                                        <div className="space-y-4">
                                            {profileData.history.map((item) => (
                                                <Link to={`/podcast/${item.podcast.id}`} key={item._id} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors group">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                        <img src={getImageUrl(item.podcast.image)} alt={item.podcast.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold group-hover:text-primary transition-colors">{item.podcast.title}</h4>
                                                        <p className="text-sm text-muted-foreground">Listened on {new Date(item.playedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="rounded-full">
                                                        <Play className="w-5 h-5 fill-current" />
                                                    </Button>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={Clock}
                                            title="No history yet"
                                            description="Podcasts you listen to will appear here."
                                            actionLink="/browse"
                                            actionText="Start Listening"
                                        />
                                    )}
                                </div>
                            )}

                            {/* LIKED PODCASTS */}
                            {activeTab === 'liked' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold font-display">Liked Podcasts</h3>
                                    {profileData?.likedPodcasts?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            {profileData.likedPodcasts.map((podcast) => (
                                                <PodcastCard
                                                    key={podcast._id}
                                                    id={podcast.id}
                                                    title={podcast.title}
                                                    author={podcast.author}
                                                    image={getImageUrl(podcast.image)}
                                                    category={podcast.category}
                                                    showActions={true}
                                                    onDelete={() => handleUnlike(podcast.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={Heart}
                                            title="No liked podcasts"
                                            description="Tap the heart icon on podcasts to save them here."
                                            actionLink="/browse"
                                            actionText="Explore & Like"
                                        />
                                    )}
                                </div>
                            )}

                            {/* SETTINGS */}
                            {activeTab === 'settings' && (
                                <div className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-xl font-bold mb-6">Account Settings</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <h4 className="font-medium">Email Notifications</h4>
                                                <p className="text-sm text-muted-foreground">Receive updates about new episodes</p>
                                            </div>
                                            <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <h4 className="font-medium mb-4">Change Password</h4>
                                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground uppercase">Current Password</label>
                                                        <input
                                                            type="password"
                                                            required
                                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-white"
                                                            value={passwords.current}
                                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground uppercase">New Password</label>
                                                        <input
                                                            type="password"
                                                            required
                                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-white"
                                                            value={passwords.new}
                                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground uppercase">Confirm New Password</label>
                                                        <input
                                                            type="password"
                                                            required
                                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-white"
                                                            value={passwords.confirm}
                                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end pt-2">
                                                    <Button type="submit" disabled={passwordLoading} className="gap-2">
                                                        <Save className="w-4 h-4" />
                                                        {passwordLoading ? 'Updating...' : 'Update Password'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="bg-red-500/5 rounded-2xl border border-red-500/10 p-6">
                                            <h4 className="text-red-500 font-bold mb-2 flex items-center gap-2">
                                                <Trash className="w-4 h-4" />
                                                Delete Account
                                            </h4>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Permanently delete your account and all of your content. This action cannot be undone.
                                            </p>

                                            {deletionStep === 'idle' && (
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => setDeletionStep('reason')}
                                                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                                                >
                                                    Delete Account
                                                </Button>
                                            )}

                                            {deletionStep === 'reason' && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground uppercase">Reason for leaving</label>
                                                        <textarea
                                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all text-white min-h-[80px]"
                                                            placeholder="Please tell us why you are deleting your account..."
                                                            value={deleteReason}
                                                            onChange={(e) => setDeleteReason(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setDeletionStep('idle')}
                                                            disabled={deleteLoading}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={handleSendDeleteOtp}
                                                            disabled={deleteLoading || !deleteReason.trim()}
                                                        >
                                                            {deleteLoading ? 'Sending OTP...' : 'Continue'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {deletionStep === 'otp' && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-muted-foreground uppercase">Enter Verification Code</label>
                                                        <p className="text-xs text-muted-foreground">We sent a 6-digit code to your email to verify this request.</p>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all text-white tracking-widest text-center text-lg font-mono placeholder:text-muted-foreground/30"
                                                            placeholder="000000"
                                                            maxLength={6}
                                                            value={deleteOtp}
                                                            onChange={(e) => setDeleteOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setDeletionStep('reason')}
                                                            disabled={deleteLoading}
                                                        >
                                                            Back
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={handleVerifyAndDelete}
                                                            disabled={deleteLoading || deleteOtp.length !== 6}
                                                            className="flex-1"
                                                        >
                                                            {deleteLoading ? 'Deleting Account...' : 'Verify & Delete Forever'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// Reusable Empty State Component
const EmptyState = ({ icon: Icon, title, description, actionLink, actionText }) => (
    <div className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Icon className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
                {description}
            </p>
        </div>
        <Button variant="hero" asChild>
            <Link to={actionLink}>{actionText}</Link>
        </Button>
    </div>
);

export default Profile;
