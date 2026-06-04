import { db } from "@/config/firebaseConfig";
import { chefuApiClient } from "@/services/chefuApiClient";
import { Video, YouTubeVideo } from "@/types/video";
import {
    doc,
    serverTimestamp,
    setDoc,
} from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import uuid from "react-native-uuid";

export const uploadVideo = async (
    title: string,
    instructor: string,
    description: string,
    videoUri: string,
    thumbnailUri: string,
    category: string,
    visibility: "public" | "private",
    duration: number,
    uploadedByEmail: string,
    views: number = 0,
    topics: string[],

) => {
    if (!uploadedByEmail) throw new Error("Not authenticated");

    const videoId = uuid.v4().toString();

    // Upload video and thumbnail
    const videoURL = await uploadFile(videoUri, `videos/${videoId}/video.mp4`);
    const thumbnailURL = await uploadFile(thumbnailUri, `videos/${videoId}/thumbnail.jpg`);

    // Save Firestore metadata
    await setDoc(doc(db, "videos", videoId), {
        id: videoId,
        title,
        instructor,
        description,
        videoURL,
        thumbnailURL,
        category,
        uploadedBy: uploadedByEmail,
        uploadedAt: serverTimestamp(),
        visibility,
        duration,
        views,
        topics,
    });

    return true;
};

const uploadFile = async (uri: string, path: string): Promise<string> => {
    const reference = storage().ref(path);
    await reference.putFile(uri);
    return await reference.getDownloadURL();
};

export const fetchVideos = async (): Promise<Video[]> => {
    const response = await chefuApiClient.get("/api/academy/mobile/videos", {
        params: { source: "uploaded" },
    });

    return (response.data?.videos || []) as Video[];
};

export const fetchVideoById = async (videoId: string): Promise<Video | null> => {
    try {
        const response = await chefuApiClient.get(
            `/api/academy/mobile/videos/${encodeURIComponent(videoId)}`,
        );

        return response.data as Video;
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
};

export const fetchYouTubeVideos = async (): Promise<YouTubeVideo[]> => {
    try {
        const response = await chefuApiClient.get("/api/academy/mobile/videos", {
            params: { source: "youtube" },
        });

        return (response.data?.videos || []) as YouTubeVideo[];
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
};


export const formatYouTubeDuration = (duration: string): string => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) return "0:00";

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    const pad = (num: number) => num.toString().padStart(2, "0");

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    } else {
        return `${minutes}:${pad(seconds)}`;
    }
};
