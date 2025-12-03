import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { styles } from '@/styles/SparksFeed.styles';
import { Likes, Spark } from '@/types/sparks';
import { sendNotification } from '@/utils/notifications';
import { showToast } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    updateDoc,
} from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Text, Vibration, View } from 'react-native';
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
        fetchInitialSparks();
    }, []);

    const fetchInitialSparks = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'sparks'),
                orderBy('createdAt', 'desc'),
                limit(SPARKS_LIMIT),
            );

            const snapshot = await getDocs(q);
            const fetchedSparks: Spark[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Spark, 'id'>),
                }),
            );

            setSparks(fetchedSparks);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        } catch (error) {
            console.log('Error fetching sparks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreSparks = async () => {
        if (!lastVisible || loadingMore) return;

        setLoadingMore(true);
        try {
            const q = query(
                collection(db, 'sparks'),
                orderBy('createdAt', 'desc'),
                startAfter(lastVisible),
                limit(SPARKS_LIMIT),
            );

            const snapshot = await getDocs(q);
            const moreSparks: Spark[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Spark, 'id'>),
                }),
            );

            setSparks((prev) => [...prev, ...moreSparks]);
            setLastVisible(
                snapshot.docs[snapshot.docs.length - 1] || lastVisible,
            );
        } catch (error) {
            console.log('Error fetching more sparks:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleLike = async (sparkId: string, likes: Likes[] = []) => {
        if (!userDetail) return;

        // ⛔ prevent double tap
        if (likeLock === sparkId) return;
        setLikeLock(sparkId);

        try {
            const sparkRef = doc(db, 'sparks', sparkId);
            const sparkSnap = await getDoc(sparkRef);
            const sparkData = sparkSnap.data();

            if (!sparkData) return;

            const existingLike = likes.find(
                (like) => like.createdBy.uid === userDetail?.uid,
            );

            if (existingLike) {
                // Unlike → remove
                await updateDoc(sparkRef, {
                    likes: arrayRemove(existingLike),
                });
            } else {
                // Like → add new object
                const newLike: Likes = {
                    id: userDetail?.uid,
                    text: 'Liked',
                    createdBy: {
                        uid: userDetail?.uid,
                        fullname: userDetail?.fullname || 'Anonymous',
                        profilePicture: userDetail?.profilePicture || '',
                    },
                    createdAt: Timestamp.now(),
                };

                await updateDoc(sparkRef, {
                    likes: arrayUnion(newLike),
                });

                // Send notification if not liking own spark
                if (
                    sparkData.createdBy?.uid !== userDetail?.uid &&
                    sparkData.createdBy?.email
                ) {
                    await addDoc(collection(db, 'notifications'), {
                        type: 'like',
                        sparkId,
                        from: {
                            uid: userDetail?.uid,
                            fullname: userDetail?.fullname || 'Anonymous',
                        },
                        to: sparkData.createdBy?.uid,
                        message: `${
                            userDetail?.fullname || 'Someone'
                        } liked your spark.`,
                        createdAt: Timestamp.now(),
                        read: false,
                    });
                }

                await sendNotification(
                    sparkData.createdBy?.email,
                    'New Like',
                    `${userDetail?.fullname || 'Someone'} liked your spark.`,
                );
            }
        } catch (e) {
            console.log('Like error:', e);
        } finally {
            // 🔓 Unlock after Firestore completes
            setLikeLock(null);
        }
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
            contentContainerStyle={[
                styles.list,
                { flexGrow: 1 }, // ensures empty component is centered
            ]}
            showsVerticalScrollIndicator={false}
            onEndReached={fetchMoreSparks}
            onEndReachedThreshold={0.4}
            ListFooterComponent={loadingMore ? <Loading /> : null}
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
