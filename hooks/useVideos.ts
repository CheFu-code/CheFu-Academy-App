import { STORAGE_KEY } from '@/constant/caches';
import { parseYouTubeDuration } from '@/helpers/formatDate';
import { fetchVideos, fetchYouTubeVideos } from '@/services/videoService';
import { Video } from '@/types/video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const VIDEO_CACHE_TTL_MS = 5 * 60 * 1000;

type VideoCachePayload = {
    fetchedAt: number;
    videos: Video[];
};

const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
};

const parseVideoCache = (raw: string): VideoCachePayload | null => {
    let parsed: Video[] | VideoCachePayload;

    try {
        parsed = JSON.parse(raw) as Video[] | VideoCachePayload;
    } catch (error) {
        console.warn('Failed to parse video cache:', error);
        return null;
    }

    if (Array.isArray(parsed)) {
        return { fetchedAt: 0, videos: parsed };
    }

    if (Array.isArray(parsed?.videos)) {
        return {
            fetchedAt: Number(parsed.fetchedAt) || 0,
            videos: parsed.videos,
        };
    }

    return null;
};

export function useVideos() {
    const [videos, setVideosState] = useState<Video[]>([]);

    const setVideos = useCallback((arr: Video[]) => {
        setVideosState(shuffleArray(arr));
    }, []);

    const loadCachedVideos = useCallback(async () => {
        try {
            const cached = await AsyncStorage.getItem(STORAGE_KEY);
            if (!cached) return false;

            const payload = parseVideoCache(cached);
            if (!payload) return false;

            setVideos(payload.videos);
            return Date.now() - payload.fetchedAt < VIDEO_CACHE_TTL_MS;
        } catch (err) {
            console.warn('Failed to load cache:', err);
            return false;
        }
    }, [setVideos]);

    const fetchAndUpdateVideos = useCallback(async () => {
        try {
            const [backendVideos, ytVideosRaw] = await Promise.all([
                fetchVideos(),
                fetchYouTubeVideos(),
            ]);

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
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    fetchedAt: Date.now(),
                    videos: allVideos,
                } satisfies VideoCachePayload),
            );
        } catch (err) {
            console.warn('Failed to fetch videos:', err);
        }
    }, [setVideos]);

    useEffect(() => {
        let active = true;

        const loadVideos = async () => {
            const hasFreshCache = await loadCachedVideos();
            if (active && !hasFreshCache) {
                await fetchAndUpdateVideos();
            }
        };

        void loadVideos();

        return () => {
            active = false;
        };
    }, [loadCachedVideos, fetchAndUpdateVideos]);

    return { videos, setVideos, fetchAndUpdateVideos };
}
