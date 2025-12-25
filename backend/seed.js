import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Podcast from './models/Podcast.js';

dotenv.config();

const podcasts = [
    {
        id: "1",
        title: "Figuring Out",
        author: "Raj Shamani",
        description: "Conversations with India's most successful entrepreneurs, creators, and thought leaders. Learn how they figured out life and business.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        category: "Business",
        subscribers: "5.2M",
        rating: 4.9,
        youtubeChannel: "@RajShamani",
        episodes: [
            { id: "e1", title: "How to Build a Personal Brand in 2024", description: "Deep dive into personal branding strategies.", duration: "1:25:30", date: "Dec 5, 2024", episodeNumber: 245 },
            { id: "e2", title: "The Art of Networking", description: "Building meaningful connections.", duration: "58:15", date: "Dec 2, 2024", episodeNumber: 244 },
        ],
    },
    {
        id: "2",
        title: "The Ranveer Show",
        author: "Ranveer Allahbadia",
        description: "India's biggest podcast featuring conversations with celebrities, entrepreneurs, athletes and thought leaders.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        category: "Motivation",
        subscribers: "8.5M",
        rating: 4.8,
        youtubeChannel: "@BeerBicepsTRS",
        episodes: [
            { id: "e1", title: "Mental Health & Success with Deepika Padukone", description: "A candid conversation about mental health.", duration: "1:45:00", date: "Dec 4, 2024", episodeNumber: 312 },
            { id: "e2", title: "Building India's Biggest Startup", description: "Founder stories and lessons.", duration: "1:20:30", date: "Dec 1, 2024", episodeNumber: 311 },
        ],
    },
    {
        id: "3",
        title: "BeerBiceps",
        author: "Ranveer Allahbadia",
        description: "Fitness, lifestyle, and motivation content for the modern Indian youth. Transform your mind and body.",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
        category: "Lifestyle",
        subscribers: "7.8M",
        rating: 4.7,
        youtubeChannel: "@BeerBiceps",
        episodes: [
            { id: "e1", title: "Ultimate Fitness Guide 2024", description: "Complete workout and nutrition plan.", duration: "42:00", date: "Dec 3, 2024", episodeNumber: 890 },
        ],
    },
    {
        id: "4",
        title: "Dostcast",
        author: "Vidit",
        description: "Fun, casual conversations about life, relationships, and everything in between with your virtual dost.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        category: "Comedy",
        subscribers: "2.1M",
        rating: 4.6,
        youtubeChannel: "@Dostcast",
        episodes: [
            { id: "e1", title: "Dating in India 101", description: "Hilarious takes on modern dating.", duration: "55:00", date: "Dec 5, 2024", episodeNumber: 178 },
        ],
    },
    {
        id: "5",
        title: "The Barber Shop",
        author: "The Barber Shop Team",
        description: "Raw, unfiltered conversations about men's issues, relationships, and life in India.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        category: "Lifestyle",
        subscribers: "1.8M",
        rating: 4.5,
        youtubeChannel: "@TheBarberShopPodcast",
        episodes: [
            { id: "e1", title: "Modern Masculinity", description: "What it means to be a man today.", duration: "1:10:00", date: "Dec 4, 2024", episodeNumber: 145 },
        ],
    },
    {
        id: "6",
        title: "WTF is with Nikhil Kamath",
        author: "Nikhil Kamath",
        description: "India's youngest billionaire talks to the world's most interesting people about business, life and everything WTF.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
        category: "Business",
        subscribers: "3.2M",
        rating: 4.9,
        youtubeChannel: "@niaborish",
        episodes: [
            { id: "e1", title: "Building Zerodha - The Story", description: "How we built India's largest broker.", duration: "2:05:00", date: "Dec 3, 2024", episodeNumber: 56 },
            { id: "e2", title: "The Future of Indian Startups", description: "Investment insights and predictions.", duration: "1:35:00", date: "Nov 28, 2024", episodeNumber: 55 },
        ],
    },
    {
        id: "7",
        title: "Humans of Bombay",
        author: "Humans of Bombay",
        description: "Real stories from real people. Emotional, inspiring, and deeply human narratives from across India.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        category: "Lifestyle",
        subscribers: "4.5M",
        rating: 4.8,
        youtubeChannel: "@HumansOfBombay",
        episodes: [
            { id: "e1", title: "From Streets to Success", description: "An inspiring journey of transformation.", duration: "28:00", date: "Dec 5, 2024", episodeNumber: 456 },
        ],
    },
    {
        id: "8",
        title: "Josh Talks Podcast",
        author: "Josh Talks",
        description: "Motivational stories and talks from India's most inspiring personalities. Find your josh!",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
        category: "Motivation",
        subscribers: "6.8M",
        rating: 4.7,
        youtubeChannel: "@JoshTalks",
        episodes: [
            { id: "e1", title: "IAS Officer's Journey", description: "From small village to civil services.", duration: "35:00", date: "Dec 4, 2024", episodeNumber: 678 },
        ],
    },
    {
        id: "9",
        title: "Finance With Sharan",
        author: "Sharan Hegde",
        description: "Making finance simple and fun for young India. Learn investing, saving, and wealth building.",
        image: "https://images.unsplash.com/photo-1556157382-97edd2f9e5ee?w=400&h=400&fit=crop",
        category: "Finance",
        subscribers: "4.2M",
        rating: 4.8,
        youtubeChannel: "@FinanceWithSharan",
        episodes: [
            { id: "e1", title: "Stock Market for Beginners", description: "Complete guide to start investing.", duration: "45:00", date: "Dec 5, 2024", episodeNumber: 234 },
            { id: "e2", title: "Mutual Funds Explained", description: "Everything about mutual funds.", duration: "38:00", date: "Dec 2, 2024", episodeNumber: 233 },
        ],
    },
    {
        id: "10",
        title: "Prakhar Ke Pravachan",
        author: "Prakhar Gupta",
        description: "Thought-provoking discussions on politics, society, and current affairs with a unique perspective.",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop",
        category: "News",
        subscribers: "3.5M",
        rating: 4.6,
        youtubeChannel: "@PrakharGupta",
        episodes: [
            { id: "e1", title: "Understanding Indian Politics", description: "Deep dive into political landscape.", duration: "1:15:00", date: "Dec 4, 2024", episodeNumber: 345 },
        ],
    },
    {
        id: "11",
        title: "TRS Clips",
        author: "Ranveer Allahbadia",
        description: "Best moments and highlights from The Ranveer Show. Bite-sized wisdom and entertainment.",
        image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop",
        category: "Motivation",
        subscribers: "2.8M",
        rating: 4.5,
        youtubeChannel: "@TRSClips",
        episodes: [
            { id: "e1", title: "Best Life Advice Compilation", description: "Top wisdom from successful guests.", duration: "25:00", date: "Dec 5, 2024", episodeNumber: 890 },
        ],
    },
    {
        id: "12",
        title: "IndiaPodcasts",
        author: "IndiaPodcasts Team",
        description: "Curated collection of the best podcast content from across India. Discover new voices.",
        image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop",
        category: "Lifestyle",
        subscribers: "1.5M",
        rating: 4.4,
        youtubeChannel: "@IndiaPodcasts",
        episodes: [
            { id: "e1", title: "Best of Indian Podcasts 2024", description: "Year's top podcast moments.", duration: "55:00", date: "Dec 3, 2024", episodeNumber: 156 },
        ],
    },
    {
        id: "13",
        title: "Curly Tales Interviews",
        author: "Curly Tales",
        description: "Travel, food, and lifestyle conversations with India's top content creators and travelers.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        category: "Lifestyle",
        subscribers: "2.2M",
        rating: 4.6,
        youtubeChannel: "@CurlyTales",
        episodes: [
            { id: "e1", title: "Hidden Gems of India", description: "Unexplored travel destinations.", duration: "32:00", date: "Dec 4, 2024", episodeNumber: 234 },
        ],
    },
    {
        id: "14",
        title: "Brut India Interviews",
        author: "Brut India",
        description: "Hard-hitting interviews and stories that matter. Real journalism, real impact.",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
        category: "News",
        subscribers: "3.1M",
        rating: 4.7,
        youtubeChannel: "@BrutIndia",
        episodes: [
            { id: "e1", title: "Voices of Change", description: "Changemakers transforming India.", duration: "28:00", date: "Dec 5, 2024", episodeNumber: 567 },
        ],
    },
    {
        id: "15",
        title: "Raj Shamani Clips",
        author: "Raj Shamani",
        description: "Short, powerful clips from Figuring Out podcast. Quick insights for busy entrepreneurs.",
        image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400&h=400&fit=crop",
        category: "Business",
        subscribers: "1.9M",
        rating: 4.5,
        youtubeChannel: "@RajShamaniClips",
        episodes: [
            { id: "e1", title: "1 Minute Business Tips", description: "Quick actionable advice.", duration: "15:00", date: "Dec 5, 2024", episodeNumber: 456 },
        ],
    },
    {
        id: "16",
        title: "The Siddharth Warrier Podcast",
        author: "Dr. Siddharth Warrier",
        description: "Science, neuroscience, and medicine explained by a practicing neurologist. Evidence-based insights.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        category: "Lifestyle",
        subscribers: "1.2M",
        rating: 4.8,
        youtubeChannel: "@SiddharthWarrier",
        episodes: [
            { id: "e1", title: "Understanding Your Brain", description: "How your brain really works.", duration: "1:05:00", date: "Dec 3, 2024", episodeNumber: 178 },
        ],
    },
    {
        id: "17",
        title: "Abhi and Niyu Podcast",
        author: "Abhi and Niyu",
        description: "Positive news and inspiring stories from India. Celebrating what's good about our country.",
        image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&fit=crop",
        category: "Motivation",
        subscribers: "2.8M",
        rating: 4.6,
        youtubeChannel: "@AbhiandNiyu",
        episodes: [
            { id: "e1", title: "India's Amazing Innovations", description: "Homegrown success stories.", duration: "22:00", date: "Dec 4, 2024", episodeNumber: 345 },
        ],
    },
    {
        id: "18",
        title: "Figuring Out Clips",
        author: "Raj Shamani",
        description: "Highlight reels from Figuring Out featuring the best moments and insights.",
        image: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=400&h=400&fit=crop",
        category: "Business",
        subscribers: "980K",
        rating: 4.4,
        youtubeChannel: "@FiguringOutClips",
        episodes: [
            { id: "e1", title: "Best Entrepreneurship Advice", description: "Top tips from founders.", duration: "18:00", date: "Dec 5, 2024", episodeNumber: 234 },
        ],
    },
    {
        id: "19",
        title: "The Desi Crime Podcast",
        author: "Desi Crime Team",
        description: "True crime stories from India. Investigative journalism meets storytelling.",
        image: "https://images.unsplash.com/photo-1453873531674-2151bcd01707?w=400&h=400&fit=crop",
        category: "Crime",
        subscribers: "1.5M",
        rating: 4.7,
        youtubeChannel: "@DesiCrimePodcast",
        episodes: [
            { id: "e1", title: "The Case That Shocked Mumbai", description: "Deep investigation into a famous case.", duration: "1:25:00", date: "Dec 3, 2024", episodeNumber: 89 },
        ],
    },
    {
        id: "20",
        title: "BeerBiceps Shorts Podcast",
        author: "Ranveer Allahbadia",
        description: "Quick, impactful content from BeerBiceps. Motivation in minutes.",
        image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=400&fit=crop",
        category: "Motivation",
        subscribers: "1.2M",
        rating: 4.3,
        youtubeChannel: "@BeerBicepsShorts",
        episodes: [
            { id: "e1", title: "Daily Motivation Dose", description: "Start your day right.", duration: "8:00", date: "Dec 5, 2024", episodeNumber: 567 },
        ],
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/podcast-hub');
        console.log('Connected to MongoDB');

        await Podcast.deleteMany({});
        console.log('Cleared existing podcasts');

        await Podcast.insertMany(podcasts);
        console.log('Seeded podcasts');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
