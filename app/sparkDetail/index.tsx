import Loading from '@/component/Shared/Loading';
import AddComment from '@/component/Spark/AddComment';
import CommentsList from '@/component/Spark/CommentsList';
import SparkActions from '@/component/Spark/SparkActions';
import SparkHeader from '@/component/Spark/SparkHeaser';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SparkDetail';
import { Likes, Spark } from '@/types/sparks';
import { showToast } from '@/utils/toast';
import { AntDesign } from '@expo/vector-icons';
import {
    arrayRemove,
    arrayUnion,
    doc,
    getFirestore,
    onSnapshot,
    Timestamp,
    updateDoc,
} from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SparkDetail = () => {
    const { safeBack } = useSafeNavigation();
    const { sparkId } = useLocalSearchParams<{ sparkId: string }>();
    const { userDetail } = useContext(UserDetailContext);
    const [comment, setComment] = useState('');
    const [commenting, setCommenting] = useState(false);
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);

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
                    likes: [],
                    replies: [],
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

    // Like a comment
    const handleLikeComment = async (
        commentId: string,
        likes: Likes[] = [],
    ) => {
        if (!spark || !userDetail) return;

        const db = getFirestore();
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
            <SparkHeader spark={spark} />

            {/* Title & Content */}
            <Text style={styles.title}>{spark.title}</Text>
            <Text style={styles.content}>{spark.content}</Text>

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
                {/* Comments placeholder */}
                <CommentsList
                    comments={spark.comments || []}
                    currentUserId={userDetail?.uid || ''}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    onLike={handleLikeComment}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SparkDetail;
