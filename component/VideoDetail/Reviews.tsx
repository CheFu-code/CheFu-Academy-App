import { auth, db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { UserReviews, Video } from '@/types/video';
import { showToast } from '@/utils/toast';
import { AntDesign, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    FirebaseFirestoreTypes,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from '../../styles/Reviews.styles';

type Props = {
    video: Video | null;
    enrolled: boolean;
};

dayjs.extend(relativeTime);

export default function Reviews({ video, enrolled }: Props) {
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const { userDetail } = useContext(UserDetailContext);
    const [editReviewModal, setEditReviewModal] = useState(false);
    const [addReviewModal, setAddReviewModal] = useState(false);
    const [deleteReviewModal, setDeleteReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState<UserReviews[]>([]);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const { safePush } = useSafeNavigation();

    const hasReviewed = () => {
        if (!userDetail?.uid) return false;
        return reviews.some((rev) => rev.userId === userDetail.uid);
    };

    useEffect(() => {
        if (!video) return;

        const reviewsRef = collection(db, 'videos', video.id, 'reviews');

        const q = query(reviewsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                }),
            ) as UserReviews[];

            setReviews(data);
        });

        return () => unsubscribe();
    }, [video]);

    const handleSubmitReview = async () => {
        if (!video || !video.id) {
            showToast('Invalid video');
            return;
        }
        if (!userDetail?.uid || !userDetail?.fullname) {
            showToast("You're not logged in properly");
            return;
        }
        if (hasReviewed()) {
            showToast('You have already reviewed this video');
            return;
        }
        if (rating === 0 || reviewText.trim() === '') {
            showToast('Please select a rating and write a review');
            return;
        }

        setLoading(true);
        try {
            const reviewsCollection = collection(
                db,
                'videos',
                video.id,
                'reviews',
            );

            const reviewRef = await addDoc(reviewsCollection, {
                userId: userDetail.uid,
                username: userDetail.fullname,
                email: userDetail?.email || '',
                avatar: userDetail?.profilePicture || '', // ✅ default empty string
                rating,
                comment: reviewText.trim(),
                videoId: video.id,
                createdAt: serverTimestamp(),
            });

            const newReview: UserReviews = {
                id: reviewRef.id,
                userId: userDetail.uid,
                username: userDetail.fullname,
                email: userDetail?.email || '',
                avatar: userDetail?.profilePicture || '', // ✅ default empty string
                rating,
                comment: reviewText.trim(),
                videoId: video.id,
                createdAt: new Date() as any,
            };

            setReviews((prev) => [newReview, ...prev]);

            setReviewText('');
            setRating(0);
            setAddReviewModal(false);
            showToast('Review submitted successfully');
        } catch (error) {
            console.error('Error submitting a review: ', error);
            showToast('Failed to submit a review');
        } finally {
            setLoading(false);
        }
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        return total / reviews.length;
    };

    const handleEditReview = async () => {
        if (!video || !editingReviewId) return;
        if (userDetail?.uid !== auth.currentUser?.uid) {
            showToast('You can only edit your own reviews');
            return;
        }
        setLoading(true);

        if (rating === 0 || reviewText.trim() === '') {
            showToast('Please select a rating and write a review');
            setLoading(false);
            return;
        }

        try {
            const updatedReview = {
                rating,
                comment: reviewText.trim(),
                updatedAt: serverTimestamp(),
            };

            const reviewRef = doc(
                db,
                'videos',
                video.id,
                'reviews',
                editingReviewId,
            );
            await updateDoc(reviewRef, updatedReview);

            // update local state
            setReviews((prev) =>
                prev.map((rev) =>
                    rev.id === editingReviewId
                        ? { ...rev, ...updatedReview }
                        : rev,
                ),
            );

            // reset state
            setEditingReviewId(null);
            setReviewText('');
            setRating(0);
            setEditReviewModal(false);

            showToast('Review updated successfully');
        } catch (error) {
            console.error('Error updating review: ', error);
            showToast('Failed to update review');
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteReview = async () => {
        if (!video || !video.id) {
            showToast('Invalid video');
            return;
        }
        if (!userDetail?.uid) {
            showToast("You're not logged in properly");
            return;
        }
        if (!editingReviewId) {
            showToast('No review selected');
            return;
        }

        setLoading(true);
        try {
            const reviewRef = doc(
                db,
                'videos',
                video.id,
                'reviews',
                editingReviewId,
            );

            await deleteDoc(reviewRef);

            // update local state
            setReviews((prev) =>
                prev.filter((rev) => rev.id !== editingReviewId),
            );

            // reset state
            setEditingReviewId(null);
            setDeleteReviewModal(false);

            showToast('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
            showToast('Failed to delete review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View>
                <View style={styles.container}>
                    <Text style={styles.header}>Student Reviews</Text>
                    <View style={styles.ratingContainer}>
                        <View style={styles.ratingContainer2}>
                            <AntDesign name="star" size={20} color="yellow" />
                            <Text>
                                {getAverageRating().toFixed(1)} (
                                {reviews.length})
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (hasReviewed()) {
                                    showToast(
                                        'You have already reviewed this video',
                                    );
                                    return;
                                }

                                if (!enrolled) {
                                    showToast(
                                        'You must be enrolled to review this video',
                                    );
                                    return;
                                }

                                setAddReviewModal(true);
                            }}
                            style={styles.addRating}
                        >
                            <FontAwesome6 name="add" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <>
                    {reviews.length === 0 ? (
                        <View style={styles.noReviewsContainer}>
                            <Text style={styles.noReviewsText}>No reviews</Text>
                        </View>
                    ) : (
                        reviews.map((rev) => (
                            <Pressable
                                onLongPress={() => {
                                    setEditingReviewId(rev.id);
                                    setReviewText(rev.comment);
                                    setRating(rev.rating);
                                    setEditReviewModal(true);
                                }}
                                key={rev.id}
                                style={styles.box}
                            >
                                <View style={styles.reviewContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            safePush({
                                                pathname: '/profileView',
                                                params: {
                                                    userId: rev.email,
                                                },
                                            });
                                        }}
                                    >
                                        <Image
                                            source={{ uri: rev.avatar }}
                                            style={styles.image}
                                        />
                                    </TouchableOpacity>
                                    <View style={styles.reviewHeader}>
                                        <View>
                                            <Text style={styles.username}>
                                                {rev.username}
                                            </Text>
                                            <Text>
                                                {'⭐'.repeat(rev.rating)}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.date}>
                                                {rev.createdAt &&
                                                'toDate' in rev.createdAt
                                                    ? dayjs(
                                                          rev.createdAt.toDate(),
                                                      ).fromNow()
                                                    : 'Just now'}
                                            </Text>
                                            <View style={styles.deleteButton}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setEditingReviewId(
                                                            rev.id,
                                                        );
                                                        setReviewText(
                                                            rev.comment,
                                                        );
                                                        setRating(rev.rating);
                                                        setEditReviewModal(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    <AntDesign
                                                        name="edit"
                                                        size={18}
                                                        color={'black'}
                                                    />
                                                </TouchableOpacity>
                                                {rev.userId ===
                                                    userDetail?.uid && (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setDeleteReviewModal(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <MaterialIcons
                                                            name="delete-outline"
                                                            size={18}
                                                            color="red"
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <Text
                                    numberOfLines={3}
                                    style={styles.reviewText}
                                >
                                    {rev.comment}
                                </Text>
                            </Pressable>
                        ))
                    )}
                </>
            </View>

            {/* Add review modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={addReviewModal}
                onRequestClose={() => setAddReviewModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add your review</Text>

                        {/* Rating stars */}
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                >
                                    <AntDesign
                                        name="star"
                                        size={28}
                                        color={star <= rating ? 'gold' : 'gray'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            multiline
                            numberOfLines={4}
                            value={reviewText}
                            onChangeText={setReviewText}
                            style={styles.textInput}
                            placeholder="Write your review here..."
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                disabled={loading}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: Colors.GRAY,
                                        opacity: loading ? 0.5 : 1,
                                    },
                                ]}
                                onPress={() => setAddReviewModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <TouchableOpacity
                                disabled={loading}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: Colors.PRIMARY,
                                        opacity: loading ? 0.5 : 1,
                                    },
                                ]}
                                onPress={handleSubmitReview}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size={'small'}
                                        color={Colors.GREEN}
                                    />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Submit
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={editReviewModal}
                onRequestClose={() => setEditReviewModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit your review</Text>

                        {/* Rating stars */}
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                >
                                    <AntDesign
                                        name="star"
                                        size={28}
                                        color={star <= rating ? 'gold' : 'gray'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            multiline
                            numberOfLines={4}
                            value={reviewText}
                            onChangeText={setReviewText}
                            style={styles.textInput}
                            placeholder="Edit your review here..."
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                disabled={loading}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: Colors.GRAY,
                                        opacity: loading ? 0.5 : 1,
                                    },
                                ]}
                                onPress={() => setEditReviewModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <TouchableOpacity
                                disabled={loading}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: Colors.PRIMARY,
                                        opacity: loading ? 0.5 : 1,
                                    },
                                ]}
                                onPress={handleEditReview}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size={'small'}
                                        color={Colors.GREEN}
                                    />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Submit
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteReviewModal}
                onRequestClose={() => setDeleteReviewModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: Colors.LIGHT_RED },
                        ]}
                    >
                        <Text style={[styles.modalTitle, { color: 'red' }]}>
                            Delete your review
                        </Text>

                        <Text
                            style={{
                                marginBottom: 20,
                                textAlign: 'center',
                                fontFamily: 'outfit',
                                fontSize: 15,
                            }}
                        >
                            Are you sure you want to delete your review?
                        </Text>

                        <View style={styles.modalButtons}>
                            <Pressable
                                disabled={loading}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: Colors.GRAY,
                                        opacity: loading ? 0.5 : 1,
                                    },
                                ]}
                                onPress={() => setDeleteReviewModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <TouchableOpacity
                                disabled={loading}
                                style={[
                                    styles.button,
                                    {
                                        backgroundColor: Colors.RED,
                                        opacity: loading ? 0.5 : 1,
                                    },
                                ]}
                                onPress={handleDeleteReview}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size={'small'}
                                        color={Colors.WHITE}
                                    />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Delete
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
