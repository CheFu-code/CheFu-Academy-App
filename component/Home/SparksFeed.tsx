import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { fetchInitialSparks, fetchMoreSparks } from '@/services/sparksService';
import { styles } from '@/styles/SparksFeed.styles';
import { Spark } from '@/types/sparks';
import { showToast } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import {
    deleteDoc,
    doc,
    FirebaseFirestoreTypes,
    getDoc
} from '@react-native-firebase/firestore';
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
import { scale, verticalScale } from 'react-native-size-matters';
import Loading from '../Shared/Loading';
import UISpark from '../Spark/UISpark';

dayjs.extend(relativeTime);

const SparksFeed = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [loading, setLoading] = useState(true);
    const [likeLock, setLikeLock] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const SPARKS_LIMIT = 6;
    const [lastVisible, setLastVisible] =
        useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);

    useEffect(() => {
        const checkVerified = async () => {
            if (!userDetail?.email) return;

            try {
                const userDoc = await getDoc(
                    doc(db, 'users', userDetail?.email),
                );
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsVerified(!!userData?.isVerified);
                }
            } catch (err) {
                console.log('Error checking verified status:', err);
            }
        };

        checkVerified();
    }, [userDetail?.email]);

    useEffect(() => {
        fetchInitialSparks(SPARKS_LIMIT, setSparks, setLastVisible, setLoading);
    }, []);

    const handleLoadMore = () => {
        fetchMoreSparks(
            SPARKS_LIMIT,
            lastVisible,
            setSparks,
            setLastVisible,
            loadingMore,
            setLoadingMore,
        );
    };

    

    const handleDelete = (sparkId: string) => {
        Vibration.vibrate(100);

        Alert.alert(
            'Delete Spark',
            'Are you sure you want to delete this spark?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setDeleting(true);

                            const sparkRef = doc(db, 'sparks', sparkId);
                            const snap = await getDoc(sparkRef);

                            if (!snap.exists()) {
                                showToast('Spark no longer exists.');
                                return;
                            }

                            const data = snap.data()!;

                            // Security guard
                            if (data.createdBy.uid !== userDetail?.uid) {
                                showToast("You can't delete this spark.");
                                return;
                            }

                            // Optimistic UI (only AFTER permission check)
                            setSparks((prev) =>
                                prev.filter((s) => s.id !== sparkId),
                            );

                            // Delete in Firestore
                            await deleteDoc(sparkRef);

                            showToast('Spark deleted successfully!');
                        } catch (error: any) {
                            if (error.code === 'permission-denied') {
                                showToast(
                                    "You don't have permission to delete this spark.",
                                );
                            } else {
                                showToast('Error deleting spark.');
                            }
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
                handleLike={handleLike}
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
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                        style={{ marginVertical: verticalScale(10) }}
                        size="small"
                        color={Colors.PRIMARY}
                    />
                ) : null
            }
            ListEmptyComponent={
                <View style={styles.NoSparkFeedHeader}>
                    <Ionicons
                        name="sparkles-outline"
                        size={scale(40)}
                        color={Colors.GRAY}
                        style={{ marginBottom: verticalScale(10) }}
                    />
                    <Text style={styles.NoSparkFeedText}>
                        No Spark Feed yet
                    </Text>
                </View>
            }
        />
    );
};

export default SparksFeed;
