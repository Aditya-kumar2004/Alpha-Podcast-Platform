import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { BASE_URL } from '@/lib/api';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]); // List of tracks
    const [isMinimized, setIsMinimized] = useState(false);

    // HTML Audio Element Ref
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            playNext();
        };

        const handleError = (e) => {
            console.error("Audio Error:", e);
            setIsPlaying(false);
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.pause();
        };
    }, []);

    // Effect to handle track changes
    useEffect(() => {
        if (currentTrack) {
            const audio = audioRef.current;
            // Only update src if it's different to avoid reloading same track
            // But if we just want to replay, we might need logic.
            // Check if src includes the currentTrack url
            const currentSrc = audio.src;
            // Handle localhost url differences if needed, but simple check:
            if (!currentSrc.includes(currentTrack.audioUrl)) {
                audio.src = currentTrack.audioUrl.startsWith('http')
                    ? currentTrack.audioUrl
                    : `${BASE_URL}${currentTrack.audioUrl}`;

                audio.load();
            }

            if (isPlaying) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Playback failed:", error);
                        setIsPlaying(false);
                    });
                }
            }
        }
    }, [currentTrack]);

    // Cleanup effect to toggle play/pause based on state
    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying && audio.paused && currentTrack) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.error("Play error", e));
            }
        } else if (!isPlaying && !audio.paused) {
            audio.pause();
        }
    }, [isPlaying]);


    const playTrack = (track, newQueue = []) => {
        if (newQueue.length > 0) {
            setQueue(newQueue);
        } else {
            // If no queue provided, make single item queue or keep existing?
            // Usually clicking a track implies starting a context. 
            // Let's default to just this track if no queue given, unless it's already in queue
            setQueue([track]);
        }

        setCurrentTrack(track);
        setIsPlaying(true);
        setIsMinimized(false);
    };

    const togglePlay = () => {
        if (!currentTrack) return;
        setIsPlaying(!isPlaying);
    };

    const playNext = () => {
        if (!currentTrack || queue.length === 0) return;
        const currentIndex = queue.findIndex(t => t.id === currentTrack.id || t._id === currentTrack._id); // Handle both id types

        if (currentIndex !== -1 && currentIndex < queue.length - 1) {
            setCurrentTrack(queue[currentIndex + 1]);
            setIsPlaying(true);
        } else {
            // End of queue loop or stop? Let's stop.
            setIsPlaying(false);
        }
    };

    const playPrev = () => {
        if (!currentTrack || queue.length === 0) return;
        const currentIndex = queue.findIndex(t => t.id === currentTrack.id || t._id === currentTrack._id);

        if (currentIndex > 0) {
            setCurrentTrack(queue[currentIndex - 1]);
            setIsPlaying(true);
        } else {
            // Restart current track or do nothing
            audioRef.current.currentTime = 0;
        }
    };

    const seek = (value) => { // 0 to 100
        if (audioRef.current && currentTrack) {
            const time = (value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
        }
    };

    const setVolume = (value) => { // 0 to 1
        if (audioRef.current) {
            audioRef.current.volume = value;
        }
    };

    return (
        <AudioContext.Provider value={{
            currentTrack,
            isPlaying,
            queue,
            isMinimized,
            setIsMinimized,
            playTrack,
            togglePlay,
            playNext,
            playPrev,
            seek,
            setVolume,
            audioRef
        }}>
            {children}
        </AudioContext.Provider>
    );
};
