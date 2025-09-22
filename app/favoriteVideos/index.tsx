import { Colors } from "@/constant/Colors";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useContext, useCallback } from "react";
import {
    getFirestore,
    collection,
    getDocs,
    FirebaseFirestoreTypes,
    doc,
    getDoc,
    deleteDoc,
    setDoc,
    serverTimestamp,
} from "@react-native-firebase/firestore";
import { UserDetailContext } from "@/context/UserDetailContext";
import { FavoriteCourse, Video } from "@/types/video";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";
import { showToast } from "@/utils/toast";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "@/styles/FavoriteVideos";
import {
    fetchFavoritesFromFirestore,
    removeFavoriteFromFirestore,
} from "@/services/favorites";

export default function FavoriteVideos() {
    const { safeBack, safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const [favoriteCourses, setFavoriteCourses] = useState<FavoriteCourse[]>(
        []
    );
    const [loading, setLoading] = useState(true);

    const fetchFavorites = useCallback(async () => {
        if (!userDetail?.email) return;
        setLoading(true);
        try {
            const favs = await fetchFavoritesFromFirestore(userDetail.email);
            setFavoriteCourses(favs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userDetail]);

    const handleRemoveFavorite = async (videoId: string) => {
        if (!userDetail) return showToast("Please log in to remove favorites.");
        try {
            await removeFavoriteFromFirestore(userDetail.email, videoId);
            setFavoriteCourses((prev) =>
                prev.filter((item) => item.videoId !== videoId)
            );
            showToast("Removed from favorites.");
        } catch (err) {
            console.error(err);
            showToast("Something went wrong while removing favorite.");
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [fetchFavorites])
    );

    const renderCourse = ({ item }: { item: FavoriteCourse }) => (
        <Pressable
            style={styles.courseCard}
            onPress={() => {
                safePush({
                    pathname: "/videoDetail",
                    params: {
                        id: item.videoId, // always send videoId
                    },
                });
            }}
        >
            <Image
                source={{
                    uri:
                        item.thumbnailURL ||
                        "https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif",
                }}
                style={styles.courseImage}
            />
            <View style={styles.courseInfo}>
                <Text numberOfLines={3} style={styles.courseTitle}>
                    {item.title}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => handleRemoveFavorite(item.videoId)}
                style={styles.remove}
            >
                <Ionicons name="heart" size={24} color={Colors.RED} />
            </TouchableOpacity>
        </Pressable>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    onPress={safeBack}
                    style={{ flexDirection: "row", gap: 8, marginTop: 8 }}
                >
                    <AntDesign name="left" color={"white"} size={20} />
                    <Text style={{ color: Colors.WHITE, fontSize: 18 }}>
                        Back
                    </Text>
                </TouchableOpacity>
                <ActivityIndicator
                    size="large"
                    color={Colors.PRIMARY}
                    style={{ marginTop: 70 }}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={safeBack}>
                    <AntDesign name="left" size={24} color={Colors.PRIMARY} />
                    <Text style={styles.headerText}>Favorite Videos</Text>
                </TouchableOpacity>
            </View>

            {favoriteCourses.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                        No favorite videos yet.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favoriteCourses}
                    keyExtractor={(item) => item.videoId}
                    renderItem={renderCourse}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
