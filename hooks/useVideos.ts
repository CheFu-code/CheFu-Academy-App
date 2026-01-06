// hooks/useVideos.ts
import { STORAGE_KEY } from '@/constant/caches';
import { parseYouTubeDuration } from '@/helpers/formatDate';
import { fetchVideos, fetchYouTubeVideos } from '@/services/videoService';
import { Video } from '@/types/video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

// Fisher–Yates shuffle
const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export function useVideos() {
    const [videos, setVideosState] = useState<Video[]>([]);

    // Wrapper to shuffle whenever videos are set
    const setVideos = useCallback((arr: Video[]) => {
        setVideosState(shuffleArray(arr));
    }, []);

    const loadCachedVideos = useCallback(async () => {
        try {
            const cached = await AsyncStorage.getItem(STORAGE_KEY);
            if (cached) setVideos(JSON.parse(cached));
        } catch (err) {
            console.warn('Failed to load cache:', err);
        }
    }, [setVideos]);

    const fetchAndUpdateVideos = useCallback(async () => {
        try {
            const backendVideos = await fetchVideos();
            const ytVideosRaw = await fetchYouTubeVideos();

            const ytVideos: Video[] = ytVideosRaw.map((v) => ({
                id: v.videoId,
                title: v.title,
                thumbnailURL: v.thumbnailURL,
                description: v.description,
                duration: parseYouTubeDuration(v.duration),
                views: v.views,
                publishedAt: v.publishedAt,
                category: v.category || 'YouTube',
                uploadedAt: v.createdAt,
                instructorName: v.channelTitle || 'Unknown Channel',
                instructorCompany: v.channelTitle ? `${v.channelTitle}` : '',
                videoURL: '',
                uploadedBy: 'YouTube',
                level: 'beginner',
                topics: [],
                visibility: 'public',
            }));

            const allVideos = [...backendVideos, ...ytVideos];

            setVideos(allVideos);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allVideos));
        } catch (err) {
            console.warn('Failed to fetch videos:', err);
        }
    }, [setVideos]);

    useEffect(() => {
        loadCachedVideos();
        fetchAndUpdateVideos();
    }, [loadCachedVideos, fetchAndUpdateVideos]);

    return { videos, setVideos, fetchAndUpdateVideos };
}
