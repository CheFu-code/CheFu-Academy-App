import { chefuApiClient } from "@/services/chefuApiClient";
import { Course } from "@/types/course";
import { Video } from "@/types/video";
import { useCallback, useState } from "react";

export const useVideo = () => {
    const [results, setResults] = useState<Course[]>([]);
    const [videoResults, setVideoResults] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = useCallback(async (query: string | string[]) => {
        try {
            const term = Array.isArray(query) ? query[0] : query || "";
            const response = await chefuApiClient.get(
                "/api/academy/mobile/courses",
                { params: { limit: 100, query: term } },
            );

            setResults((response.data?.courses || []) as Course[]);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVideos = useCallback(async (query: string | string[]) => {
        try {
            const term = Array.isArray(query) ? query[0] : query || "";
            const response = await chefuApiClient.get(
                "/api/academy/mobile/videos",
                { params: { limit: 100, query: term } },
            );

            setVideoResults((response.data?.videos || []) as Video[]);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        fetchCourses,
        fetchVideos,
        loading,
        results,
        setLoading,
        videoResults,
    };
};
