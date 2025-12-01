import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SparksFeed.styles';
import { Likes, Spark } from '@/types/sparks';
import { formatViews } from '@/utils/formatViews';
import { showToast } from '@/utils/toast';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
} from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Loading from '../Shared/Loading';
import { sendNotification } from '@/utils/notifications';
import { scale } from 'react-native-size-matters';

dayjs.extend(relativeTime);

const SparksFeed = () => {
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

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
        const q = query(collection(db, 'sparks'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const fetchedSparks: Spark[] = snapshot.docs.map(
                    (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                        id: doc.id,
                        ...(doc.data() as Omit<Spark, 'id'>),
                    }),
                );
                setSparks(fetchedSparks);
                setLoading(false);
            },
            (error) => {
                console.log('Error fetching sparks:', error);
                setLoading(false);
            },
        );

        return () => unsubscribe();
    }, []);

    const handleLike = async (sparkId: string, likes: Likes[] = []) => {
        if (!userDetail) return;

        const sparkRef = doc(db, 'sparks', sparkId);
        const sparkSnap = await getDoc(sparkRef);
        const sparkData = sparkSnap.data();

        if (!sparkData) return;

        // Check if the user already liked
        const existingLike = likes.find(
            (like) => like.createdBy.uid === userDetail?.uid,
        );

        if (existingLike) {
            // Unlike → remove the like object
            await updateDoc(sparkRef, {
                likes: arrayRemove(existingLike),
            });
        } else {
            // Like → add a new like object
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

            // ✅ Send notification only if user is not liking their own spark
            if (
                sparkData.createdBy?.uid !== userDetail?.uid &&
                sparkData.createdBy?.email
            ) {
                const notificationRef = collection(db, 'notifications');
                await addDoc(notificationRef, {
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
    };

    const handleDelete = (sparkId: string) => {
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
                            const sparkRef = doc(db, 'sparks', sparkId);
                            await deleteDoc(sparkRef);
                            showToast('Spark deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting spark:', error);
                            showToast('Failed to delete spark.');
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
            <TouchableOpacity
                onPress={() => {
                    safePush({
                        pathname: '/sparkDetail',
                        params: { sparkId: item.id },
                    });
                }}
                onLongPress={() => handleDelete(item.id)}
                style={styles.card}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.authorContainer}>
                        <Image
                            source={
                                item.createdBy?.profilePicture
                                    ? { uri: item?.createdBy?.profilePicture }
                                    : require('@/assets/images/avatar.jpg')
                            }
                            style={{ width: 35, height: 35, borderRadius: 20 }}
                        />
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 3,
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        maxWidth: 150,
                                        fontFamily: 'outfit-bold',
                                    }}
                                >
                                    {item.createdBy?.fullname || 'Anonymous'}
                                </Text>
                                {isVerified && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={13}
                                        color={Colors.PRIMARY}
                                    />
                                )}
                            </View>
                            <Text style={styles.author}>
                                {item.createdAt?.toDate
                                    ? dayjs(item.createdAt.toDate()).fromNow()
                                    : 'Just now'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            safePush({
                                pathname: '/categorySparks',
                                params: { category: item.category },
                            });
                        }}
                        style={styles.categoryCont}
                    >
                        <Text style={styles.category}>{item.category}</Text>
                    </TouchableOpacity>
                </View>
                <Text numberOfLines={1} style={styles.title}>
                    {item.title}
                </Text>
                <Text numberOfLines={3} style={styles.content}>
                    {item.content}
                </Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLike(item.id, item.likes)}
                    >
                        <AntDesign
                            name={hasLiked ? 'like1' : 'like2'}
                            size={scale(16)}
                            color={hasLiked ? Colors.PRIMARY : Colors.GRAY}
                        />
                        <Text style={styles.actionText}>
                            {formatViews(item.likes?.length || 0)}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            safePush({
                                pathname: '/sparkDetail',
                                params: { sparkId: item.id },
                            });
                        }}
                        style={styles.actionButton}
                    >
                        <FontAwesome
                            name="comment-o"
                            size={scale(16)}
                            color={Colors.PRIMARY}
                        />
                        <Text style={styles.actionText}>
                            {formatViews(item.comments?.length || 0)}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                    >
                        <AntDesign
                            name="sharealt"
                            size={scale(16)}
                            color={Colors.PRIMARY}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
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
        />
    );
};

export default SparksFeed;
