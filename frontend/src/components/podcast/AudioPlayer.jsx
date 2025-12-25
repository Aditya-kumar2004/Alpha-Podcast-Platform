import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAudio } from "@/context/AudioContext";

const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume: setGlobalVolume,
    audioRef,
    isMinimized,
    setIsMinimized
  } = useAudio();

  const [progress, setProgress] = useState([0]);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress([(audio.currentTime / audio.duration) * 100]);
    };

    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, [audioRef]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setGlobalVolume(newVolume[0] / 100);
    setIsMuted(newVolume[0] === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setGlobalVolume(volume[0] / 100);
    } else {
      setIsMuted(true);
      setGlobalVolume(0);
    }
  };

  if (!currentTrack) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform group relative overflow-hidden"
        >
          {/* Animated ring */}
          <div className={`absolute inset-0 border-2 border-white/20 rounded-full ${isPlaying ? 'animate-ping' : ''}`} />

          <img
            src={currentTrack.image || "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80"}
            alt="Mini player"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/40" />

          {isPlaying ? (
            <Pause className="w-6 h-6 text-white relative z-10" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1 relative z-10" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] animate-slide-up">
      <div className="container mx-auto px-4">
        {/* Progress Bar (Spotify Style - Thin line at top edge) */}
        <Slider
          value={progress}
          onValueChange={(val) => {
            setProgress(val);
            seek(val[0]);
          }}
          max={100}
          step={0.1}
          className="absolute top-[-6px] left-0 w-full cursor-pointer hover:h-2 transition-all [&>.relative>.bg-primary]:bg-red-600 [&>.relative>.bg-primary]:shadow-[0_0_10px_rgba(220,38,38,0.5)]"
        />

        <div className="flex items-center gap-4 py-3 h-20">
          {/* Track Info */}
          <div className="flex items-center gap-4 w-[30%] min-w-0">
            <div className="relative group">
              <img
                src={currentTrack.image || "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80"}
                alt={currentTrack.title}
                className={`w-14 h-14 rounded-lg object-cover shadow-lg transition-transform duration-700 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}
              />
              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded-lg cursor-pointer" onClick={() => setIsMinimized(true)}>
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm truncate text-white hover:underline cursor-pointer">{currentTrack.title}</h4>
              <p className="text-xs text-muted-foreground truncate hover:text-white cursor-pointer transition-colors">
                {currentTrack.author || currentTrack.podcast || "Unknown Artist"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white" onClick={playPrev}>
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all shadow-lg"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white" onClick={playNext}>
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            <div className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground font-variant-numeric tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/20">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Actions */}
          <div className="w-[30%] flex items-center justify-end gap-3">
            <div className="flex items-center gap-2 group">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-white"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <div className="w-24 transition-all opacity-100 sm:opacity-50 sm:group-hover:opacity-100">
                <Slider
                  value={isMuted ? [0] : volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="[&>.relative>.bg-primary]:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;