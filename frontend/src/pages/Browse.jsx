import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import Layout from "@/components/layout/Layout";
import PodcastCard from "@/components/podcast/PodcastCard";
import CategoryBadge from "@/components/podcast/CategoryBadge";
import { categories } from "@/data/podcasts";
import { fetchPodcasts, BASE_URL } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalizedPath = path.replace(/\\/g, '/');
  const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `${BASE_URL}${finalPath}`;
};

const Browse = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Sync search query with URL params
  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const { data: podcasts = [], isLoading, error } = useQuery({
    queryKey: ['podcasts'],
    queryFn: fetchPodcasts
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading podcasts...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center text-red-500">
          <p>Error loading podcasts. Make sure the backend server is running.</p>
        </div>
      </Layout>
    );
  }

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesCategory =
      selectedCategory === "All" || podcast.category === selectedCategory;
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (podcast.category && podcast.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;

  });

  // Extract unique creators from filteredPodcasts
  // Reverse to show newest uploads/creators first
  const uniqueCreators = [...filteredPodcasts].reverse().reduce((acc, podcast) => {
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
    // Handle Static podcasts (no user object, just author)
    else if (podcast.author) {
      // Use author name as unique key for static content
      if (!acc.find(c => c.username === podcast.author)) {
        acc.push({
          _id: podcast.id, // Use podcast ID as creator ID for linking (might need handling in Creator page)
          username: podcast.author,
          profilePicture: null, // Static podcasts might not have profile pic, use podcast image fallback
          latestPodcastImage: podcast.image,
          isStatic: true
        });
      }
    }
    return acc;
  }, []);

  const displayCreators = user ? uniqueCreators : uniqueCreators.slice(0, 4);

  return (
    <Layout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header Section */}
          <div className="mb-16 text-center max-w-3xl mx-auto space-y-6">
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Podcasts</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed">
              Curated collections of the world's most insightful conversations.
              Discover, listen, and grow.
            </p>

            {/* Modern Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl transition-all group-hover:border-primary/30 group-hover:shadow-primary/10">
                <Search className="w-6 h-6 text-muted-foreground ml-3" />
                <input
                  type="text"
                  placeholder="Search interactions, creators, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none px-4 py-3 text-lg focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
          </div>

          {/* Categories Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-up">
            {(showAllCategories ? categories : categories.slice(0, 10)).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                  ${selectedCategory === category
                    ? "bg-[#FF5722] text-white border-[#FF5722] shadow-[0_0_20px_rgba(255,87,34,0.3)] scale-105"
                    : "bg-[#1A1A1A] text-gray-300 border-white/10 hover:bg-[#2A2A2A] hover:text-white hover:border-white/20"
                  }
                `}
              >
                {category}
              </button>
            ))}

            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-white/10 bg-[#1A1A1A] text-primary hover:bg-[#2A2A2A] hover:border-primary/30"
            >
              {showAllCategories ? 'Show Less' : 'See All'}
            </button>
          </div>

          {/* Content Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                {selectedCategory === "All" ? "Trending Now" : `${selectedCategory} Podcasts`}
              </h2>
              <span className="text-sm text-muted-foreground">
                Showing {uniqueCreators.length} results
              </span>
            </div>

            {displayCreators.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayCreators.map((creator) => (
                  <Link
                    key={creator._id}
                    to={creator.isStatic ? `/podcast/${creator._id}` : `/creator/${creator._id}`}
                    className="group relative flex flex-col gap-3 p-3 rounded-3xl transition-all duration-300 hover:bg-white/5 bg-card/50 border border-white/5"
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
                {!user && (
                  <div
                    onClick={() => navigate('/login')}
                    className="group relative flex flex-col items-center justify-center gap-3 p-3 rounded-3xl transition-all duration-300 hover:bg-white/5 bg-card/50 border border-white/5 cursor-pointer min-h-[250px]"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-bold text-primary">+</span>
                    </div>
                    <div className="text-center px-1">
                      <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                        View All
                      </h3>
                      <p className="text-sm text-muted-foreground">Sign in to explore more</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">No results found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Browse;