import { db } from '@/config/fireConfig';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useRenderTextWithLinks } from '@/helpers/detectLinks';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SparkDetail';
import { Comment, Props, Replies } from '@/types/sparks';
import { showToast } from '@/utils/toast';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';

import { useContext, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import RepliesList from './RepliesSheet/RepliesList';
import ReplyHeader from './RepliesSheet/ReplyHeader';
import ReplyTextInput from './RepliesSheet/TextInput';

export default function RepliesSheet({
    visible,
    slideAnim,
    closeReplies,
    comment,
    onAddReply,
    sparkId,
}: Props) {
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { backgroundColor } = useDarkMode();
    const { renderTextWithLinks } = useRenderTextWithLinks();
    const { height: screenHeight } = useWindowDimensions();

    const handleAddReply = () => {
        if (!replyText.trim()) return;
        setReplying(true);

        try {
            const newReply: Replies = {
                id: Date.now().toString(),
                text: replyText.trim(),
                createdAt: new Date(),
                createdBy: {
                    uid: userDetail?.uid,
                    fullname: userDetail?.fullname || 'Unknown User',
                    profilePicture: userDetail?.profilePicture || '',
                    email: userDetail?.email || '',
                },
            };

            onAddReply?.(comment.id, newReply);
            setReplyText('');
        } catch (error) {
            console.error('Error adding reply:', error);
            showToast('Failed to add reply');
        } finally {
            setReplying(false);
        }
    };

    const handleDeleteReply = async (replyId: string) => {
        if (!sparkId) return showToast('Missing sparkId');
        if (!replyId) return showToast('Missing replyId');

        Alert.alert(
            'Delete Reply',
            'Are you sure you want to delete this reply?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const sparkRef = doc(db, 'sparks', sparkId);
                            const sparkSnap = await getDoc(sparkRef);
                            if (!sparkSnap.exists()) return;

                            const sparkData = sparkSnap.data();
                            if (!sparkData) return;

                            const updatedComments = (
                                sparkData.comments || []
                            ).map((c: Comment) => {
                                if (c.id !== comment.id) return c;
                                return {
                                    ...c,
                                    replies:
                                        c.replies?.filter(
                                            (r) => r.id !== replyId,
                                        ) || [],
                                };
                            });

                            await updateDoc(sparkRef, {
                                comments: updatedComments,
                            });
                            showToast('Reply deleted');
                        } catch (error) {
                            console.error('Error deleting reply:', error);
                        }
                    },
                },
            ],
        );
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={closeReplies}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={closeReplies}
            />

            <Animated.View
                style={[
                    styles.sheetContainer,
                    {
                        transform: [{ translateY: slideAnim }],
                        height: screenHeight * 0.6,
                        shadowOffset: { width: 0, height: -2 },
                        backgroundColor,
                    },
                ]}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* Header */}
                    <ReplyHeader />

                    {/* Replies List */}
                    <RepliesList
                        comment={comment}
                        userDetail={userDetail}
                        safePush={safePush}
                        handleDeleteReply={handleDeleteReply}
                        renderTextWithLinks={renderTextWithLinks}
                    />

                    {/* Reply Input */}
                    <ReplyTextInput
                        replyText={replyText}
                        setReplyText={setReplyText}
                        handleAddReply={handleAddReply}
                        replying={replying}
                    />
                </KeyboardAvoidingView>
            </Animated.View>
        </Modal>
    );
}
