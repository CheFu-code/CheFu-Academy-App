import HeaderText from '@/component/common/Header';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import {
    fetchFavoritesFromFirestore,
    removeFavoriteFromFirestore,
} from '@/services/favorites';
import { styles } from '@/styles/FavoriteVideos';
import { FavoriteCourse } from '@/types/video';
import { showToast } from '@/utils/toast';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useContext, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function FavoriteVideos() {
    const { safeBack, safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { color, backgroundColor } = useDarkMode();
    const [loading, setLoading] = useState(true);
    const [favoriteCourses, setFavoriteCourses] = useState<FavoriteCourse[]>(
        [],
    );

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
        if (!userDetail) return showToast('Please log in to remove favorites.');
        try {
            await removeFavoriteFromFirestore(userDetail.email, videoId);
            setFavoriteCourses((prev) =>
                prev.filter((item) => item.videoId !== videoId),
            );
            showToast('Removed from favorites.');
        } catch {
            showToast('Something went wrong while removing favorite.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [fetchFavorites]),
    );

    const renderCourse = ({ item }: { item: FavoriteCourse }) => (
        <Pressable
            style={styles.courseCard}
            onPress={() => {
                safePush({
                    pathname: '/videoDetail',
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
                        'https://d2uolguxr56s4e.cloudfront.net/img/kartrapages/video_player_placeholder.gif',
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
                <Ionicons name="heart" size={scale(24)} color={Colors.RED} />
            </TouchableOpacity>
        </Pressable>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor }]}>
                <TouchableOpacity
                    onPress={safeBack}
                    style={{
                        flexDirection: 'row',
                        gap: scale(8),
                        alignItems: 'center',
                    }}
                >
                    <AntDesign name="left" color={color} size={scale(20)} />
                    <Text style={{ color, fontSize: RFValue(18) }}>
                        Back
                    </Text>
                </TouchableOpacity>
                <ActivityIndicator
                    size="large"
                    color={color}
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Header */}
            <HeaderText title="Favorite Videos" />

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
