import { auth, db } from "@/lib/firebase";
import { Video } from "@/types/video";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    QueryDocumentSnapshot,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const uploadVideo = async (
    title: string,
    description: string,
    videoUri: string,
    thumbnailUri: string,
    category: string,
    visibility: "public" | "private",
    level: "beginner" | "advance",
    duration: number,
    views: number = 0,
    topics: string[]
) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const videoId = uuidv4().toString();

    // Upload video and thumbnail
    const videoURL = await uploadFile(videoUri, `videos/${videoId}/video.mp4`);
    const thumbnailURL = await uploadFile(
        thumbnailUri,
        `videos/${videoId}/thumbnail.jpg`
    );

    // Save Firestore metadata
    await setDoc(doc(db, "videos", videoId), {
        id: videoId,
        title,
        description,
        videoURL,
        thumbnailURL,
        category,
        uploadedBy: user.email,
        uploadedAt: serverTimestamp(),
        visibility,
        duration,
        level,
        views,
        topics,
    });

    return true;
};

export const uploadFile = async (
    fileOrUri: File | string,
    path: string
): Promise<string> => {
    const storage = getStorage();
    const fileRef = ref(storage, path);

    let data: Blob;

    if (typeof fileOrUri === "string") {
        // It's a URI → fetch blob
        const response = await fetch(fileOrUri);
        data = await response.blob();
    } else {
        // It's already a File
        data = fileOrUri;
    }

    await uploadBytes(fileRef, data);
    return await getDownloadURL(fileRef);
};

export const fetchVideos = async (): Promise<Video[]> => {
    const q = query(
        collection(db, "videos"),
        where("visibility", "==", "public"),
        orderBy("uploadedAt", "desc")
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc: QueryDocumentSnapshot) => doc.data() as Video);
};

export const fetchVideoById = async (
    videoId: string
): Promise<Video | null> => {
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
            description: data.description,
            videoURL: data.videoURL,
            thumbnailURL: data.thumbnailURL,
            uploadedBy: data.uploadedBy,
            uploadedAt: data.uploadedAt, // Firestore Timestamp
            category: data.category,
            visibility: data.visibility,
            level: data.level,
            duration: data.duration ?? 0,
            views: data.views ?? 0,
            topics: data.topics ?? [],
        } as Video;
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
};
