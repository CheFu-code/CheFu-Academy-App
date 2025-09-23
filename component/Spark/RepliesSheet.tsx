import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/SparkDetail';
import React from 'react';
import {
    Animated,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Replies } from '@/types/sparks';

interface Props {
    visible: boolean;
    slideAnim: Animated.Value;
    closeReplies: () => void;
    comment: { replies?: Replies[] };
}

export default function RepliesSheet({
    visible,
    slideAnim,
    closeReplies,
    comment,
}: Props) {
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
                    { transform: [{ translateY: slideAnim }] },
                ]}
            >
                <Text
                    style={{
                        color: Colors.WHITE,
                        fontSize: 16,
                        marginBottom: 10,
                        fontFamily: 'outfit-bold',
                    }}
                >
                    Replies
                </Text>
                {comment.replies && comment.replies.length > 0 ? (
                    comment.replies.map((reply: Replies) => (
                        <View key={reply.id} style={{ paddingVertical: 8 }}>
                            <Text style={{ color: Colors.WHITE }}>
                                {reply.text}
                            </Text>
                        </View>
                    ))
                ) : (
                    <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <Text
                            style={{
                                color: Colors.GRAY,
                                marginBottom: 5,
                                fontFamily: 'outfit-bold',
                            }}
                        >
                            No replies yet...
                        </Text>
                        <Text
                            style={{
                                color: Colors.PRIMARY,
                                fontFamily: 'outfit',
                            }}
                        >
                            Why not be the first to share your thoughts? 💬
                        </Text>
                    </View>
                )}
                <View
                    style={{
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                    }}
                >
                    <TextInput
                        placeholder="Write a reply..."
                        placeholderTextColor={Colors.GRAY}
                        style={styles.editInput}
                        multiline
                        numberOfLines={4}
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.PRIMARY,
                            padding: 10,
                            borderRadius: 20,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: Colors.WHITE }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Modal>
    );
}
