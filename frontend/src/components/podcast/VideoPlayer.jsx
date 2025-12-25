import PropTypes from 'prop-types';
import { useRef } from 'react';
import { BASE_URL } from '@/lib/api';

const VideoPlayer = ({ videoId, videoUrl, title, thumbnail, onPlay }) => {
  const videoRef = useRef(null);

  const handleForward10 = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  if (videoUrl) {
    const fullUrl = videoUrl.startsWith('http') ? videoUrl : `${BASE_URL}${videoUrl}`;
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden glass-card bg-black group">
        <video
          ref={videoRef}
          src={fullUrl}
          controls
          className="w-full h-full object-contain"
          poster={thumbnail || "/placeholder.svg"}
          onPlay={onPlay}
        >
          Your browser does not support the video tag.
        </video>
        <button
          onClick={handleForward10}
          className="absolute bottom-20 right-5 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Forward 10s"
        >
          <span className="text-xs font-bold">+10s</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden glass-card">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

VideoPlayer.propTypes = {
  videoId: PropTypes.string,
  videoUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  onPlay: PropTypes.func,
};

export default VideoPlayer;