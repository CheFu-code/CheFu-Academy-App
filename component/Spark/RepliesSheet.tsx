import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useRenderTextWithLinks } from '@/helpers/detectLinks';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SparkDetail';
import { Comment, Replies } from '@/types/sparks';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { db } from '@/config/fireConfig';
import { doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import NoReply from './NoReply';
import { showToast } from '@/utils/toast';

interface Props {
    visible: boolean;
    slideAnim: Animated.Value;
    closeReplies: () => void;
    comment: { id: string; replies?: Replies[] };
    onAddReply?: (commentId: string, reply: Replies) => void;
    sparkId: string;
}

export default function RepliesSheet({
    visible,
    slideAnim,
    closeReplies,
    comment,
    onAddReply,
    sparkId,
}: Props) {
    const [replyText, setReplyText] = useState('');
    const { safePush } = useSafeNavigation();
    const [replying, setReplying] = useState(false);
    const { userDetail } = useContext(UserDetailContext);
    const { height: screenHeight } = useWindowDimensions();
    const { renderTextWithLinks } = useRenderTextWithLinks();

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
                    },
                ]}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* Header */}
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.replyText}>Replies</Text>
                    </View>

                    {/* Replies List */}
                    <ScrollView
                        style={{ flex: 1, marginVertical: 10 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {comment.replies && comment.replies.length > 0 ? (
                            comment.replies.map((reply: Replies) => (
                                <View
                                    key={reply.id}
                                    style={styles.containerReply}
                                >
                                    <View style={styles.X}>
                                        <Image
                                            source={{
                                                uri: reply.createdBy
                                                    .profilePicture,
                                            }}
                                            style={styles.commentAvatar}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <Pressable
                                                onPress={() => {
                                                    safePush({
                                                        pathname:
                                                            '/profileView',
                                                        params: {
                                                            userId: reply
                                                                .createdBy
                                                                .email,
                                                        },
                                                    });
                                                }}
                                                style={styles.fullnameCont}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={styles.fullname}
                                                >
                                                    {reply.createdBy.fullname}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.commentTimestamp
                                                    }
                                                >
                                                    {reply.createdAt?.toDate
                                                        ? dayjs(
                                                              reply.createdAt.toDate(),
                                                          ).fromNow()
                                                        : 'Just now'}
                                                </Text>
                                            </Pressable>

                                            <Pressable
                                                onLongPress={() => {
                                                    if (
                                                        reply.createdBy
                                                            .email ===
                                                        userDetail?.email
                                                    ) {
                                                        Haptics.impactAsync(
                                                            Haptics
                                                                .ImpactFeedbackStyle
                                                                .Medium,
                                                        );
                                                        handleDeleteReply(
                                                            reply.id,
                                                        );
                                                    }
                                                }}
                                            >
                                                <Text style={styles.reply}>
                                                    {renderTextWithLinks(
                                                        reply.text,
                                                    )}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <NoReply />
                        )}
                    </ScrollView>

                    {/* Reply Input */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TextInput
                            placeholder="Write a reply..."
                            placeholderTextColor={Colors.GRAY}
                            style={styles.editInput}
                            multiline
                            value={replyText}
                            onChangeText={setReplyText}
                        />
                        <TouchableOpacity
                            onPress={handleAddReply}
                            style={[
                                styles.replyButton,
                                {
                                    backgroundColor: replyText.trim()
                                        ? Colors.PRIMARY
                                        : Colors.GRAY,
                                },
                            ]}
                            disabled={replying || !replyText.trim()}
                        >
                            {replying ? (
                                <ActivityIndicator
                                    size="small"
                                    color={Colors.WHITE}
                                />
                            ) : (
                                <Text style={styles.A}>Reply</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View>
        </Modal>
    );
}
