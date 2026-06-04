import { chefuApiClient } from "@/services/chefuApiClient";
import { Video } from "@/types/video";
import { showToast } from "@/utils/toast";

interface DeleteVideoParams {
    currentUserEmail?: string;
    video: Video;
    onSuccess?: () => void;
    onFinally?: () => void;
}

export const deleteVideo = async ({
    currentUserEmail,
    video,
    onSuccess,
    onFinally,
}: DeleteVideoParams) => {
    if (!currentUserEmail) {
        showToast("You must be logged in to delete video");
        return;
    }

    try {
        showToast("Deleting video...");

        await chefuApiClient.delete(
            `/api/academy/mobile/videos/${encodeURIComponent(video.id)}`,
        );

        showToast("Video deleted successfully!");
        onSuccess?.();
    } catch (error) {
        console.error("Delete failed:", error);
        showToast("Failed to delete video.");
    } finally {
        onFinally?.();
    }
};
