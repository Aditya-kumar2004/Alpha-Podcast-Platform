import { Link } from "react-router-dom";
import { Play, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const EpisodeCard = ({
  id,
  podcastId,
  title,
  description,
  image,
  duration,
  date,
  episodeNumber,
}) => {
  return (
    <div className="glass-card p-4 flex gap-4 hover-lift group">
      <Link
        to={`/podcast/${podcastId}/episode/${id}`}
        className="flex-shrink-0"
      >
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-primary fill-current" />
          </div>
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="text-primary font-medium">Episode {episodeNumber}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </span>
        </div>
        <Link to={`/podcast/${podcastId}/episode/${id}`}>
          <h3 className="font-display font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {description}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Button size="sm" variant="hero" className="gap-2">
            <Play className="w-4 h-4 fill-current" />
            Play
          </Button>
          <Button size="sm" variant="ghost">
            + Queue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;