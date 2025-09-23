import Loading from '@/component/Shared/Loading';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SparkDetail';
import { Likes, Spark } from '@/types/sparks';
import { showToast } from '@/utils/toast';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import {
    arrayRemove,
    arrayUnion,
    doc,
    getFirestore,
    onSnapshot,
    Timestamp,
    updateDoc,
} from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SparkDetail = () => {
    const { safeBack } = useSafeNavigation();
    const { sparkId } = useLocalSearchParams<{ sparkId: string }>();
    const { userDetail } = useContext(UserDetailContext);
    const [comment, setComment] = useState('');
    const [commenting, setCommenting] = useState(false);
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState<string | null>(null);

    useEffect(() => {
        if (!sparkId) return;

        const db = getFirestore();
        const sparkRef = doc(db, 'sparks', sparkId);

        const unsubscribe = onSnapshot(
            sparkRef,
            (snap) => {
                if (snap.exists()) {
                    setSpark({
                        id: snap.id,
                        ...(snap.data() as Omit<Spark, 'id'>),
                    });
                }
                setLoading(false);
            },
            (err) => {
                console.log('Error fetching spark detail:', err);
                setLoading(false);
            },
        );

        return () => unsubscribe();
    }, [sparkId]);

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

    const handleAddComment = async (sparkId: string) => {
        if (!userDetail || !spark || !comment.trim()) return;
        setCommenting(true);
        try {
            const db = getFirestore();
            const sparkRef = doc(db, 'sparks', sparkId);

            await updateDoc(sparkRef, {
                comments: arrayUnion({
                    id: userDetail.uid + '-' + Timestamp.now().toMillis(),
                    text: comment.trim(),
                    createdBy: {
                        uid: userDetail.uid,
                        fullname: userDetail.fullname || 'Anonymous',
                        profilePicture: userDetail.profilePicture || '',
                    },
                    createdAt: Timestamp.now(),
                }),
            });

            setComment('');
            showToast('Comment added successfully');
        } catch (error) {
            console.log('Error adding comment:', error);
            showToast('Failed to add comment');
        } finally {
            setCommenting(false);
        }
    };

    // Edit comment
    const handleEditComment = async (commentId: string, newText: string) => {
        if (!spark || !userDetail) return;

        const db = getFirestore();
        const sparkRef = doc(db, 'sparks', spark.id);

        try {
            const updatedComments = spark.comments.map((c) =>
                c.id === commentId ? { ...c, text: newText } : c,
            );

            await updateDoc(sparkRef, { comments: updatedComments });
            showToast('Comment updated successfully');
        } catch (err) {
            console.log('Error editing comment:', err);
            showToast('Failed to update comment');
        }
    };

    // Delete comment
    const handleDeleteComment = async (commentId: string) => {
        if (!spark || !userDetail) return;

        const db = getFirestore();
        const sparkRef = doc(db, 'sparks', spark.id);

        try {
            const updatedComments = spark.comments.filter(
                (c) => c.id !== commentId,
            );

            await updateDoc(sparkRef, { comments: updatedComments });
            showToast('Comment deleted successfully');
        } catch (err) {
            console.log('Error deleting comment:', err);
            showToast('Failed to delete comment');
        }
    };

    const hasLiked = () => {
        if (!spark || !userDetail) return false;
        return spark.likes?.some(
            (like) => like.createdBy.uid === userDetail.uid,
        );
    };

    if (loading) {
        return <Loading message="Loading spark..." />;
    }

    if (!spark) {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={safeBack} style={styles.backButton}>
                    <AntDesign name="left" size={20} color={Colors.PRIMARY} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.center}>
                    <Text style={styles.notFound}>Spark not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Back button */}
            <TouchableOpacity onPress={safeBack} style={styles.backButton}>
                <AntDesign name="left" size={20} color={Colors.PRIMARY} />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={
                            spark.createdBy?.profilePicture
                                ? { uri: spark.createdBy.profilePicture }
                                : require('@/assets/images/avatar.jpg')
                        }
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.author}>
                            {spark.createdBy.fullname}
                        </Text>
                        <Text style={styles.timestamp}>
                            {spark.createdAt?.toDate
                                ? dayjs(spark.createdAt.toDate()).fromNow()
                                : 'Just now'}
                        </Text>
                    </View>
                </View>
                <View style={styles.categoryBox}>
                    <Text style={styles.category}>{spark.category}</Text>
                </View>
            </View>

            {/* Title & Content */}
            <Text style={styles.title}>{spark.title}</Text>
            <Text style={styles.content}>{spark.content}</Text>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => handleLike(spark.id, spark.likes)}
                    style={styles.actionButton}
                >
                    <AntDesign
                        name={hasLiked() ? 'like1' : 'like2'}
                        size={20}
                        color={Colors.PRIMARY}
                    />
                    <Text style={styles.actionText}>
                        {`${spark.likes?.length || 0} ${
                            spark.likes?.length < 2 ? 'Like' : 'Likes'
                        }`}
                    </Text>
                </TouchableOpacity>

                <View style={styles.actionButton}>
                    <FontAwesome
                        name="comment-o"
                        size={20}
                        color={Colors.PRIMARY}
                    />
                    <Text style={styles.actionText}>
                        {`${spark.comments?.length || 0} ${
                            spark.comments?.length < 2 ? 'Comment' : 'Comments'
                        }`}
                    </Text>
                </View>
            </View>
            <View style={styles.addButtonContainer}>
                <TextInput
                    multiline
                    numberOfLines={2}
                    placeholder="Add a comment..."
                    style={styles.commentInput}
                    placeholderTextColor={Colors.GRAY}
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity
                    onPress={() => handleAddComment(spark.id)}
                    disabled={!comment.trim() || commenting}
                    style={[
                        styles.postButton,
                        { opacity: commenting || !comment.trim() ? 0.5 : 1 },
                    ]}
                >
                    <Text style={{ fontFamily: 'outfit', color: Colors.WHITE }}>
                        {commenting ? 'Posting...' : 'Post'}
                    </Text>
                    {commenting ? (
                        <ActivityIndicator
                            size={'small'}
                            color={Colors.WHITE}
                        />
                    ) : (
                        <AntDesign name="plus" size={12} color={Colors.WHITE} />
                    )}
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Comments placeholder */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsHeader}>Comments</Text>
                    {spark.comments?.length ? (
                        spark.comments.map((c, index) => (
                            <View
                                key={`${c.id}-${index}`}
                                style={[
                                    styles.comment,
                                    {
                                        backgroundColor:
                                            index % 2 === 0
                                                ? Colors.BG_COLOR
                                                : '#25252A',
                                    },
                                ]}
                            >
                                <Image
                                    source={
                                        c.createdBy?.profilePicture
                                            ? {
                                                  uri: c.createdBy
                                                      .profilePicture,
                                              }
                                            : require('@/assets/images/avatar.jpg')
                                    }
                                    style={styles.commentAvatar}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.commentAuthor}>
                                        {c.createdBy.fullname}
                                    </Text>

                                    <Text style={styles.commentText}>
                                        {c.text}
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 10,
                                            marginBottom: 5,
                                            alignItems: 'center',
                                            gap: 20,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                        >
                                            <AntDesign
                                                name="like2"
                                                color={Colors.PRIMARY}
                                                size={15}
                                            />
                                            <Text style={styles.actionText}>
                                                0 Likes
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.actionButton}
                                        >
                                            <FontAwesome
                                                name="comment-o"
                                                size={15}
                                                color={Colors.PRIMARY}
                                            />
                                            <Text style={styles.actionText}>
                                                0 Comments
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {c.createdBy.uid === userDetail?.uid && (
                                    <>
                                        <View
                                            style={{
                                                alignItems: 'flex-end',
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <TouchableOpacity
                                                style={{
                                                    padding: 2,
                                                    backgroundColor: '#1E1E1E',
                                                    borderRadius: 20,
                                                }}
                                                onPress={() => {
                                                    setSelectedComment(c.id);
                                                    setMenuVisible(true);
                                                }}
                                            >
                                                <Ionicons
                                                    name="ellipsis-vertical"
                                                    size={16}
                                                    color={Colors.GRAY}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        <Modal
                                            transparent
                                            animationType="fade"
                                            visible={menuVisible}
                                            onRequestClose={() =>
                                                setMenuVisible(false)
                                            }
                                        >
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    backgroundColor:
                                                        'rgba(0,0,0,0.5)',
                                                    justifyContent: 'flex-end',
                                                }}
                                                activeOpacity={1}
                                                onPressOut={() =>
                                                    setMenuVisible(false)
                                                }
                                            >
                                                <View
                                                    style={{
                                                        backgroundColor:
                                                            Colors.BG_COLOR,
                                                        padding: 20,
                                                        borderTopLeftRadius: 12,
                                                        borderTopRightRadius: 12,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={{
                                                            paddingVertical: 12,
                                                        }}
                                                        onPress={() => {
                                                            setMenuVisible(
                                                                false,
                                                            );
                                                            if (
                                                                selectedComment
                                                            ) {
                                                                handleEditComment(
                                                                    selectedComment,
                                                                    'New text here',
                                                                ); // You can replace this with an input
                                                            }
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: Colors.WHITE,
                                                                fontSize: 16,
                                                            }}
                                                        >
                                                            ✏️ Edit
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{
                                                            paddingVertical: 12,
                                                        }}
                                                        onPress={() => {
                                                            setMenuVisible(
                                                                false,
                                                            );
                                                            if (
                                                                selectedComment
                                                            ) {
                                                                handleDeleteComment(
                                                                    selectedComment,
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color: 'red',
                                                                fontSize: 16,
                                                            }}
                                                        >
                                                            🗑️ Delete
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity>
                                        </Modal>
                                    </>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noComments}>No comments yet</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SparkDetail;
