import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/SparkDetail';
import React, { useContext, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    useWindowDimensions,
    KeyboardAvoidingView,
    Platform,
    Image,
    Pressable,
} from 'react-native';
import { Replies } from '@/types/sparks';
import { UserDetailContext } from '@/context/UserDetailContext';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { useRenderTextWithLinks } from '@/helpers/detectLinks';
import dayjs from 'dayjs';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

interface Props {
    visible: boolean;
    slideAnim: Animated.Value;
    closeReplies: () => void;
    comment: { id: string; replies?: Replies[] };
    onAddReply?: (commentId: string, reply: Replies) => void;
}

export default function RepliesSheet({
    visible,
    slideAnim,
    closeReplies,
    comment,
    onAddReply,
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
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 12,
                                        backgroundColor: Colors.BG_COLOR,
                                        borderRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: 10,
                                        }}
                                    >
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
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        color: Colors.WHITE,
                                                        fontSize: 14,
                                                    }}
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

                                            <Text
                                                style={{
                                                    color: Colors.GRAY,
                                                    fontSize: 13,
                                                    lineHeight: 20,
                                                    maxWidth: 270,
                                                }}
                                            >
                                                {renderTextWithLinks(
                                                    reply.text,
                                                )}
                                            </Text>
                                        </View>

                                        {reply?.createdBy?.email ===
                                            userDetail?.email && (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-end',
                                                }}
                                            >
                                                <Menu>
                                                    <MenuTrigger>
                                                        <Ionicons
                                                            name="ellipsis-vertical"
                                                            size={16}
                                                            color={Colors.GRAY}
                                                        />
                                                    </MenuTrigger>
                                                    <MenuOptions>
                                                        <MenuOption>
                                                            <View
                                                                style={
                                                                    styles.menuOption1
                                                                }
                                                            >
                                                                <Ionicons
                                                                    name="pencil"
                                                                    size={15}
                                                                    color={
                                                                        Colors.WHITE
                                                                    }
                                                                />
                                                                <Text
                                                                    style={{
                                                                        color: Colors.WHITE,
                                                                        fontSize: 15,
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Text>
                                                            </View>
                                                        </MenuOption>
                                                        <MenuOption>
                                                            <View
                                                                style={
                                                                    styles.menuOption2
                                                                }
                                                            >
                                                                <Ionicons
                                                                    name="trash-bin"
                                                                    size={15}
                                                                    color={
                                                                        Colors.RED
                                                                    }
                                                                />
                                                                <Text
                                                                    style={{
                                                                        color: Colors.RED,
                                                                        fontSize: 15,
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Text>
                                                            </View>
                                                        </MenuOption>
                                                    </MenuOptions>
                                                </Menu>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 40,
                                }}
                            >
                                <Text style={styles.noReplyText}>
                                    No replies yet...
                                </Text>
                                <Text
                                    style={{
                                        color: Colors.PRIMARY,
                                        fontFamily: 'outfit',
                                        marginTop: 6,
                                    }}
                                >
                                    Be the first to share your thoughts 💬
                                </Text>
                            </View>
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
                                <Text
                                    style={{
                                        color: Colors.WHITE,
                                        fontFamily: 'outfit',
                                        fontSize: 14,
                                    }}
                                >
                                    Reply
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View>
        </Modal>
    );
}
