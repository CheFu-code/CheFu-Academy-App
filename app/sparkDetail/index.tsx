import HeaderText from '@/component/common/Header';
import Loading from '@/component/Shared/Loading';
import AddComment from '@/component/Spark/AddComment';
import CommentsList from '@/component/Spark/CommentsList';
import SparkActions from '@/component/Spark/SparkActions';
import SparkHeader from '@/component/Spark/SparkHeaser';
import { db } from '@/config/firebaseConfig';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/SparkDetail';
import { Likes, Replies, Spark } from '@/types/sparks';
import { sendNotification } from '@/utils/notifications';
import { showToast } from '@/utils/toast';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    onSnapshot,
    Timestamp,
    updateDoc,
} from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SparkDetail = () => {
    const { sparkId } = useLocalSearchParams<{ sparkId: string }>();
    const { userDetail } = useContext(UserDetailContext);
    const { color, backgroundColor } = useDarkMode();
    const [comment, setComment] = useState('');
    const [commenting, setCommenting] = useState(false);
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sparkId) return;

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
                    likes: [],
                    replies: [],
                }),
            });

            // ✅ Send notification only if user is not liking their own spark
            if (
                spark.createdBy?.uid !== userDetail.uid &&
                spark.createdBy?.email
            ) {
                const notificationRef = collection(db, 'notifications');
                await addDoc(notificationRef, {
                    type: 'comment',
                    sparkId,
                    from: {
                        uid: userDetail.uid,
                        fullname: userDetail.fullname || 'Anonymous',
                    },
                    to: spark.createdBy.uid,
                    message: `${
                        userDetail.fullname || 'Someone'
                    } commented on your spark.`,
                    createdAt: Timestamp.now(),
                    read: false,
                });

                await sendNotification(
                    spark.createdBy.email,
                    'New Comment',
                    `${
                        userDetail.fullname || 'Someone'
                    } commented on your spark!`,
                );
            }

            setComment('');
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

        const sparkRef = doc(db, 'sparks', spark.id);

        try {
            const updatedComments = spark.comments.map((c) =>
                c.id === commentId ? { ...c, text: newText } : c,
            );

            // Immediately update local state
            setSpark({ ...spark, comments: updatedComments });

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

        const sparkRef = doc(db, 'sparks', spark.id);

        try {
            const updatedComments = spark.comments.filter(
                (c) => c.id !== commentId,
            );

            await updateDoc(sparkRef, { comments: updatedComments });
        } catch (err) {
            console.log('Error deleting comment:', err);
            showToast('Failed to delete comment');
        }
    };

    // Like a comment
    const handleLikeComment = async (
        commentId: string,
        likes: Likes[] = [],
    ) => {
        if (!spark || !userDetail) return;

        const sparkRef = doc(db, 'sparks', spark.id);

        try {
            // Find if the user already liked the comment
            const existingLike = likes?.find(
                (like) => like.createdBy.uid === userDetail.uid,
            );

            let updatedComments;

            if (existingLike) {
                // Unlike → remove user's like
                updatedComments = spark.comments.map((c) =>
                    c.id === commentId
                        ? {
                              ...c,
                              likes: c.likes?.filter(
                                  (l) => l.createdBy.uid !== userDetail.uid,
                              ),
                          }
                        : c,
                );
            } else {
                // Like → add a new like
                const newLike: Likes = {
                    id: userDetail.uid,
                    text: 'Liked',
                    createdBy: {
                        uid: userDetail.uid,
                        fullname: userDetail.fullname || 'Anonymous',
                        profilePicture: userDetail.profilePicture || '',
                    },
                    createdAt: Timestamp.now(),
                };

                updatedComments = spark.comments.map((c) =>
                    c.id === commentId
                        ? { ...c, likes: [...(c.likes || []), newLike] }
                        : c,
                );
            }

            // Update Firestore
            await updateDoc(sparkRef, { comments: updatedComments });

            // Update local state immediately
            setSpark({ ...spark, comments: updatedComments });
        } catch (err) {
            console.log('Error liking comment:', err);
            showToast('Failed to like comment');
        }
    };

    const handleAddReply = async (commentId: string, reply: Replies) => {
        if (!spark) return;
        const sparkRef = doc(db, 'sparks', spark.id);

        try {
            const updatedComments = spark.comments.map((c) =>
                c.id === commentId
                    ? { ...c, replies: [...(c.replies || []), reply] }
                    : c,
            );

            await updateDoc(sparkRef, { comments: updatedComments });
            setSpark({ ...spark, comments: updatedComments });
        } catch (err) {
            console.log('Error adding reply:', err);
            showToast('Failed to reply');
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
            <SafeAreaView style={[styles.container, { backgroundColor }]}>
                <HeaderText title="Back" />
                <View style={styles.center}>
                    <Text style={styles.notFound}>Spark not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Back button */}
            <HeaderText title="Back" />

            {/* Header */}
            <SparkHeader spark={spark} />

            {/* Title & Content */}
            <Text style={[styles.title, { color }]}>
                {spark.title}
            </Text>
            <Text style={[styles.content, { color }]}>
                {spark.content}
            </Text>

            {/* Actions */}
            <SparkActions
                likes={spark.likes}
                commentsCount={spark.comments?.length || 0}
                liked={hasLiked()}
                onLike={() => handleLike(spark.id, spark.likes)}
            />
            {/* Add comment */}
            <AddComment
                value={comment}
                onChange={setComment}
                onSubmit={() => handleAddComment(spark.id)}
                loading={commenting}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <CommentsList
                    comments={spark.comments || []}
                    currentUserId={userDetail?.uid || ''}
                    sparkId={sparkId}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    onLike={handleLikeComment}
                    onReply={handleAddReply}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SparkDetail;
