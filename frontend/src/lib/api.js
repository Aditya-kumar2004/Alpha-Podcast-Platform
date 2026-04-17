import { podcasts as staticPodcasts } from '@/data/podcasts';

const getStaticPodcastById = (id) => {
    return staticPodcasts.find(p => p.id === id);
};

// In production (Vercel), VITE_API_URL points to your deployed backend.
// In local dev, it is empty string so Vite proxy handles /api/* → localhost:5000.
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export const fetchPodcasts = async () => {
    let apiData = [];
    try {
        const response = await fetch(`${API_URL}/podcasts`);
        if (response.ok) {
            apiData = await response.json();
        }
    } catch (error) {
        console.error("Failed to fetch from API, falling back to static data", error);
    }
    // Return merged data: API data first, then static data
    return [...apiData, ...staticPodcasts];
};

export const fetchPodcastById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/podcasts/${id}`);
        if (!response.ok) {
            // If API fails (e.g. 404), try static
            const staticP = getStaticPodcastById(id);
            if (staticP) return staticP;
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        // Fallback to static data if API fails or network error
        const staticP = getStaticPodcastById(id);
        if (staticP) return staticP;
        throw error;
    }
};
