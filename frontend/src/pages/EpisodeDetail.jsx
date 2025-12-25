import { useParams, Link } from "react-router-dom";
import {
  Play,
  Share2,
  Clock,
  Calendar,
  ArrowLeft,
  Download,
  Heart,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { podcasts } from "@/data/podcasts";

const getPodcastById = (id) => podcasts.find((p) => p.id === id);
const getEpisodeById = (podcastId, episodeId) => {
  const podcast = getPodcastById(podcastId);
  return podcast?.episodes.find((e) => e.id === episodeId);
};

const EpisodeDetail = () => {
  const { podcastId, episodeId } = useParams();

  const podcast = getPodcastById(podcastId || "");
  const episode = getEpisodeById(podcastId || "", episodeId || "");

  if (!podcast || !episode) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">
            Episode Not Found
          </h1>
          <Link to="/browse" className="text-primary hover:underline">
            Back to Browse
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <Link
            to={`/podcast/${podcastId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {podcast.title}
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={podcast.image}
                  alt={episode.title}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover shadow-2xl"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl">
                    <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                  </div>
                </button>
              </div>
            </div>
            <div className="flex-1">
              <Link
                to={`/podcast/${podcastId}`}
                className="text-primary hover:underline text-sm font-medium"
              >
                {podcast.title}
              </Link>
              <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
                {episode.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <span className="text-primary font-medium">
                  Episode {episode.episodeNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {episode.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {episode.duration}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Play Episode
                </Button>
                <Button variant="glass" size="lg" className="gap-2">
                  <Download className="w-5 h-5" />
                  Download
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold mb-6">
            Episode Description
          </h2>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-muted-foreground leading-relaxed">
              {episode.description}
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              In this episode, we dive deep into the topic at hand, exploring
              various perspectives and insights from industry experts. Whether
              you're a seasoned professional or just getting started, there's
              something valuable for everyone.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Key topics covered in this episode include emerging trends,
              practical tips, and thought-provoking discussions that will leave
              you inspired and informed.
            </p>
          </div>

          <h2 className="font-display text-2xl font-bold mt-12 mb-6">
            Show Notes
          </h2>
          <div className="glass-card p-6 rounded-xl">
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">00:00</span>
                <span>Introduction and welcome</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">05:30</span>
                <span>Main discussion begins</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">25:00</span>
                <span>Expert insights and analysis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">40:00</span>
                <span>Conclusion and key takeaways</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EpisodeDetail;