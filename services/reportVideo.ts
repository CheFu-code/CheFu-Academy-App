import { db } from "@/config/firebaseConfig";
import { Video } from "@/types/video";
import { showToast } from "@/utils/toast";
import {
    doc,
    serverTimestamp,
    setDoc,
} from "@react-native-firebase/firestore";

interface ReportVideoParams {
    video: Video;
    userEmail: string;
    reason: string;
    onSuccess?: () => void;
    onFinally?: () => void;
}

export const reportVideo = async ({
    video,
    userEmail,
    reason,
    onSuccess,
    onFinally,
}: ReportVideoParams) => {
    if (!userEmail) {
        showToast("Please log in to report this video.");
        return;
    }

    try {
        showToast("Reporting video...");

        const reportRef = doc(
            db,
            "reports",
            `${video.id}_${userEmail}`,
        );

        await setDoc(reportRef, {
            videoId: video.id,
            title: video.title,
            reportedBy: userEmail,
            reason,
            reportedAt: serverTimestamp(),
        });

        showToast("Video reported successfully!");
        onSuccess?.();
    } catch (error) {
        console.error("Report failed:", error);
        showToast("Failed to report video.");
    } finally {
        onFinally?.();
    }
};
