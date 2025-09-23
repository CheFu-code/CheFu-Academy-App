import { Colors } from '@/constant/Colors';
import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    FirebaseFirestoreTypes,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
} from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Likes, Spark } from '@/types/sparks';
import { UserDetailContext } from '@/context/UserDetailContext';
import { formatViews } from '@/utils/formatViews';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

dayjs.extend(relativeTime);

const SparksFeed = () => {
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getFirestore();
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

        const db = getFirestore();
        const sparkRef = doc(db, 'sparks', sparkId);

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
        }
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
                            <Text
                                numberOfLines={1}
                                style={{
                                    maxWidth: 150,
                                    fontFamily: 'outfit-bold',
                                }}
                            >
                                {item.createdBy?.fullname || 'Anonymous'}
                            </Text>
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
                        style={{
                            backgroundColor: '#8FBC8F20',
                            padding: 2,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 80,
                        }}
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
                            size={18}
                            color={hasLiked ? Colors.PRIMARY : Colors.GRAY}
                        />
                        <Text style={styles.actionText}>
                            {formatViews(item.likes?.length || 0)}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <FontAwesome
                            name="comment-o"
                            size={18}
                            color={Colors.PRIMARY}
                        />
                        <Text style={styles.actionText}>
                            {formatViews(item.comments?.length || 0)}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <AntDesign
                            name="sharealt"
                            size={18}
                            color={Colors.PRIMARY}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading)
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );

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

const styles = StyleSheet.create({
    list: {
        padding: 16,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG_COLOR,
    },
    card: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.PRIMARY,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    content: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    author: {
        fontSize: 12,
        color: '#555',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 6,
        borderTopWidth: 0.2,
        borderColor: Colors.GRAY,
        paddingTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.BG_GRAY,
        padding: 8,
        borderRadius: 10,
        paddingHorizontal: 18,
    },
    actionText: {
        fontSize: 12,
        color: Colors.PRIMARY,
    },
    authorContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export default SparksFeed;
