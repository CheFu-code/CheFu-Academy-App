import { Colors } from '@/constant/Colors';
import { SPARKS_LIMIT } from '@/constant/random';
import { UserDetailContext } from '@/context/UserDetailContext';
import { fetchInitialSparks, fetchMoreSparks, toggleLikeSpark, deleteSpark } from '@/services/sparksService';
import { Likes, Spark } from '@/types/sparks';
import { showToast } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    Vibration,
    View,
} from 'react-native';
import Loading from '../Shared/Loading';
import UISpark from '../Spark/UISpark';

dayjs.extend(relativeTime);

const SparksFeed = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [loading, setLoading] = useState(true);
    const [likeLock, setLikeLock] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false);
    const isVerified = Boolean(userDetail?.isVerified);
    const [loadingMore, setLoadingMore] = useState(false);
    // Cursor for pagination instead of Firebase DocumentSnapshot
    const [lastVisible, setLastVisible] = useState<string | null>(null);

    useEffect(() => {
        fetchInitialSparks(SPARKS_LIMIT, setSparks, setLastVisible, setLoading);
    }, []);

    const handleLoadMore = () => {
        if (!lastVisible) return;
        fetchMoreSparks(
            SPARKS_LIMIT,
            lastVisible,
            setSparks,
            setLastVisible,
            loadingMore,
            setLoadingMore,
        );
    };

    const handleLike = async (sparkId: string) => {
        if (!userDetail || !userDetail.email) {
            showToast('You must be logged in to like sparks.');
            return;
        }

        if (likeLock === sparkId) return;
        setLikeLock(sparkId);

        try {
            // Optimistic update
            setSparks(currentSparks => currentSparks.map(spark => {
                if (spark.id === sparkId) {
                    const hasLiked = spark.likes?.some(like => like.createdBy.uid === userDetail.uid);
                    let newLikes = [...(spark.likes || [])];
                    
                    if (hasLiked) {
                        newLikes = newLikes.filter(like => like.createdBy.uid !== userDetail.uid);
                    } else {
                        newLikes.push({
                            id: userDetail.uid,
                            text: 'Liked',
                            createdBy: {
                                uid: userDetail.uid,
                                fullname: userDetail.fullname || 'Anonymous',
                                profilePicture: userDetail.profilePicture || '',
                            },
                            createdAt: new Date() as any, // Temporary client-side mock
                        });
                    }
                    return { ...spark, likes: newLikes };
                }
                return spark;
            }));

            // API Call
            await toggleLikeSpark(sparkId, userDetail.email);
            Vibration.vibrate(50);
        } catch (error) {
            console.error('Like toggle failed', error);
            showToast('Failed to toggle like');
            // Rollback optimistic update
            fetchInitialSparks(SPARKS_LIMIT, setSparks, setLastVisible, () => {}); 
        } finally {
            setLikeLock(null);
        }
    };

    const handleDelete = (sparkId: string) => {
        Alert.alert(
            'Delete Spark',
            'Are you sure you want to delete this spark? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(true);
                        try {
                            await deleteSpark(sparkId);
                            setSparks((prev) => prev.filter((s) => s.id !== sparkId));
                            showToast('Spark deleted successfully!');
                        } catch (error: any) {
                            showToast('Error deleting spark.');
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ],
            { cancelable: true },
        );
    };

    const renderSpark = ({ item }: { item: Spark }) => {
        const hasLiked = item.likes?.some(
            (like) => like.createdBy.uid === userDetail?.uid,
        );

        return (
            <UISpark
                deleting={deleting}
                handleDelete={handleDelete}
                handleLike={() => handleLike(item.id)}
                item={item}
                hasLiked={hasLiked}
                isVerified={isVerified}
            />
        );
    };

    if (loading) return <Loading />;

    return (
        <FlatList
            data={sparks}
            keyExtractor={(item) => item.id}
            renderItem={renderSpark}
            contentContainerClassName="pb-6"
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        className="my-4"
                        size="small"
                        color={Colors.PRIMARY}
                    />
                ) : null
            }
            ListEmptyComponent={
                <View className="flex-1 justify-center items-center mt-20">
                    <Ionicons
                        name="sparkles-outline"
                        size={40}
                        color={Colors.GRAY}
                        className="mb-4"
                    />
                    <Text className="text-gray-400 font-outfit text-base">
                        No Spark Feed yet
                    </Text>
                </View>
            }
        />
    );
};

export default SparksFeed;