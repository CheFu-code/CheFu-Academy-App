import { db } from "@/config/fireConfig";
import { FavoriteCourse } from "@/types/video";
import { collection, deleteDoc, doc, FirebaseFirestoreTypes, getDoc, getDocs } from "@react-native-firebase/firestore";


export const fetchFavoritesFromFirestore = async (userEmail: string) => {
    const favColRef = collection(db, "users", userEmail, "favorites");
    const favSnapshot = await getDocs(favColRef);

    const favorites: FavoriteCourse[] = [];

    await Promise.all(
        favSnapshot.docs.map(async (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const data = docSnap.data() as FavoriteCourse;

            if (!data.videoId || !data.title || !data.thumbnailURL) {
                return;
            }

            try {
                // First check "videos"
                const videoRef = doc(db, "videos", data.videoId);
                const videoSnap = await getDoc(videoRef);

                if (videoSnap.exists()) {
                    favorites.push(data);
                    return;
                }

                // Then check "youTubeVideos"
                const ytRef = doc(db, "youTubeVideos", data.videoId);
                const ytSnap = await getDoc(ytRef);

                if (ytSnap.exists()) {
                    favorites.push(data);
                    return;
                }

            } catch (err) {
                console.warn(`Failed to check video ${data.videoId}`, err);
            }
        })
    );

    return favorites;
};

export const removeFavoriteFromFirestore = async (userEmail: string, videoId: string) => {
    const favRef = doc(db, "users", userEmail, "favorites", videoId);
    await deleteDoc(favRef);
};
