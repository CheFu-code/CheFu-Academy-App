import { auth, db } from "@/config/fireConfig";
import { Video } from "@/types/video";
import { showToast } from "@/utils/toast";
import {
    deleteDoc,
    doc,
} from "@react-native-firebase/firestore";
import {
    deleteObject,
    getStorage,
    refFromURL,
} from "@react-native-firebase/storage";

interface DeleteVideoParams {
    video: Video;
    onSuccess?: () => void;
    onFinally?: () => void;
}

export const deleteVideo = async ({
    video,
    onSuccess,
    onFinally,
}: DeleteVideoParams) => {
    if (!auth.currentUser) {
        showToast("You must be logged in to delete video");
        return;
    }

    try {
        showToast("Deleting video...");

        if (video.uploadedBy === "YouTube") {
            const docRef = doc(db, "youTubeVideos", video.id);
            await deleteDoc(docRef);
        } else {
            const storage = getStorage();
            const videoRef = refFromURL(storage, video.videoURL);
            const thumbnailRef = refFromURL(storage, video.thumbnailURL);

            await deleteObject(videoRef);
            await deleteObject(thumbnailRef);

            const docRef = doc(db, "videos", video.id);
            await deleteDoc(docRef);
        }

        showToast("Video deleted successfully!");
        onSuccess?.();
    } catch (error) {
        console.error("Delete failed:", error);
        showToast("Failed to delete video.");
    } finally {
        onFinally?.();
    }
};
