import { Video } from "@/types/video";
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
import uuid from "react-native-uuid";

export const uploadVideo = async (
    title: string,
    description: string,
    videoUri: string,
    thumbnailUri: string,
    category: string,
    visibility: "public" | "private",
    duration: number,
    views: number = 0, // default to 0 if not provided
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
        where("visibility", "==", "public"), // ✅ usually show only public
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
            description: data.description,
            videoURL: data.videoURL,
            thumbnailURL: data.thumbnailURL,
            uploadedBy: data.uploadedBy,
            uploadedAt: data.uploadedAt, // Firestore Timestamp
            category: data.category,
            visibility: data.visibility,
            duration: data.duration ?? 0,
            views: data.views ?? 0,
            topics: data.topics ?? [],
        } as Video;
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
};

