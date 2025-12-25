import { Link } from "react-router-dom";
import { Play, Heart, Trash, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";

const PodcastCard = ({
  id,
  title,
  author,
  image,
  category,
  userId,
  authorImg,
  className,
  initialIsLiked = false,
  showActions = false,
  onDelete,
  onEdit
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login to like podcasts");
      return;
    }

    // Optimistic update
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/like/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to like');
      }
    } catch (error) {
      setIsLiked(previousState);
      console.error("Like failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("group relative", className)}>
      <Link
        to={`/podcast/${id}`}
        className="flex flex-col gap-3 p-3 rounded-3xl transition-all duration-300 hover:bg-white/5"
      >
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-300">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 scale-90 group-hover:scale-100 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm text-white flex items-center justify-center shadow-xl shadow-primary/30 border border-white/20">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
          </div>

          {/* Category Tag (Floating) */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {category}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 px-1 relative">
          {/* Profile Picture & Author */}
          <div className="flex items-center gap-2">
            {authorImg && (
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                <img src={authorImg} alt={author} className="w-full h-full object-cover" />
              </div>
            )}
            {userId ? (
              <Link
                to={`/creator/${userId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-muted-foreground font-medium line-clamp-1 hover:text-white hover:underline z-20 relative"
              >
                {author}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                {author}
              </p>
            )}
          </div>

          <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
        </div>
      </Link>

      {/* Like Button */}
      {!showActions && (
        <button
          onClick={toggleLike}
          className="absolute top-5 left-5 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all opacity-0 group-hover:opacity-100 z-20"
          title={isLiked ? "Unlike" : "Like"}
        >
          <Heart className={cn("w-5 h-5 transition-all", isLiked && "fill-red-500 text-red-500")} />
        </button>
      )}

      {/* Edit/Delete Actions */}
      {showActions && (
        <div className="absolute top-5 left-5 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
            className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-red-500/80 hover:border-red-500 transition-all"
            title="Delete"
          >
            <Trash className="w-4 h-4" />
          </button>
          {onEdit && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
              className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-blue-500/80 hover:border-blue-500 transition-all"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastCard;