import { Video, YouTubeVideo } from "@/types/video";
import { getAuth } from "@react-native-firebase/auth";
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import axios from "axios";
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
    views: number = 0,
    topics: string[],

) => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

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
        uploadedBy: user.email,
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
    const db = getFirestore();
    const q = query(
        collection(db, "videos"),
        where("visibility", "==", "public"),
        orderBy("uploadedAt", "desc")
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => doc.data() as Video);
};

export const fetchVideoById = async (videoId: string): Promise<Video | null> => {
    const db = getFirestore();
    try {
        const docRef = doc(db, "videos", videoId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("Video not found");
            return null;
        }

        const data = docSnap.data();
        if (!data) return null;

        return {
            id: docSnap.id,
            title: data.title,
            instructorCompany: data.instructorCompany,
            instructorName: data.instructorName,
            description: data.description,
            videoURL: data.videoURL,
            thumbnailURL: data.thumbnailURL,
            uploadedBy: data.uploadedBy,
            uploadedAt: data.uploadedAt,
            category: data.category,
            visibility: data.visibility,
            level: data.level ?? "beginner",
            duration: data.duration ?? 0,
            views: data.views ?? 0,
            topics: data.topics ?? [],
        } as Video;
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
};

const fetchYouTubeVideoDetails = async (videoId: string) => {
    const YOUTUBE_API_KEY = 'AIzaSyDslnFAex5WgQcEmnFw1SysNBdJbkuehzY'
    try {
        const res = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );

        if (res.data.items.length === 0) return null;

        const video = res.data.items[0];
        const channelTitle = video.snippet.channelTitle || "";
        return {
            videoId: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnailURL: video.snippet.thumbnails.high.url,
            duration: video.contentDetails.duration,
            views: parseInt(video.statistics.viewCount, 10) || 0,
            publishedAt: new Date(video.snippet.publishedAt),
            instructorName: channelTitle,
            instructorCompany: `${channelTitle}`,
            channelTitle: video.snippet.channelTitle,
        };
    } catch (err) {
        console.error(`Error fetching details for videoId ${videoId}:`, err);
        return null;
    }
};

export const fetchYouTubeVideos = async (): Promise<YouTubeVideo[]> => {
    try {
        const db = getFirestore();
        const videosCol = collection(db, "youTubeVideos");
        const q = query(videosCol, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const videos = await Promise.all(
            snapshot.docs.map(async (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                const firestoreData = doc.data() as Partial<YouTubeVideo>; // may include category
                if (!firestoreData.videoId) return null; // skip invalid docs
                const ytDetails = await fetchYouTubeVideoDetails(firestoreData.videoId);

                if (!ytDetails) return null;

                return {
                    ...ytDetails,
                    category: firestoreData.category ?? "YouTube",
                } as YouTubeVideo;


            })
        );

        return videos.filter(Boolean) as YouTubeVideo[];

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