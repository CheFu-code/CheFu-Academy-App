import { chefuApiClient } from "./chefuApiClient";
import { FavoriteCourse } from "@/types/video";

export const fetchFavoritesFromFirestore = async (userEmail: string) => {
    try {
        // Hitting our centralized API instead of direct Firestore queries
        const response = await chefuApiClient.get(`/academy-mobile/users/${userEmail}/favorites`);
        return response.data as FavoriteCourse[];
    } catch (error) {
        console.error("Failed to fetch favorites from API:", error);
        return [];
    }
};

export const removeFavoriteFromFirestore = async (userEmail: string, videoId: string) => {
    try {
        await chefuApiClient.delete(`/academy-mobile/users/${userEmail}/favorites/${videoId}`);
    } catch (error) {
        console.error(`Failed to remove favorite ${videoId} for ${userEmail}:`, error);
        throw error; // Re-throw to handle error state in UI
    }
};