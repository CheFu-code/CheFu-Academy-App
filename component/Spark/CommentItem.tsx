import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/SparkDetail';
import { Likes } from '@/types/sparks';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Image,
    Text,
    View
} from 'react-native';
import CommentActions from './CommentActions';
import CommentMenu from './CommentMenu';
import EditModal from './EditModal';
import RepliesSheet from './RepliesSheet';

interface Props {
    comment: any;
    index: number;
    onEdit: (id: string, newText: string) => void;
    onDelete: (id: string) => void;
    onLike: (commentId: string, likes?: Likes[]) => void;
    currentUserId: string;
}

export default function CommentItem({
    comment,
    index,
    onEdit,
    onDelete,
    onLike,
    currentUserId,
}: Props) {
    const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen
    const [editText, setEditText] = useState(comment.text);
    const [modalVisible, setModalVisible] = useState(false);
    const [repliesVisible, setRepliesVisible] = useState(false);

    const openReplies = () => {
        setRepliesVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeReplies = () => {
        Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setRepliesVisible(false));
    };

    const handleSave = () => {
        onEdit(comment.id, editText);
        setModalVisible(false);
    };

    const handleLikeComment = () => {
        if (!currentUserId) return;
        onLike(comment.id, comment.likes);
    };

    return (
        <View
            style={[
                styles.comment,
                {
                    backgroundColor:
                        index % 2 === 0 ? Colors.BG_COLOR : '#25252A',
                },
            ]}
        >
            {/* Comment Header */}
            <Image
                source={
                    comment.createdBy?.profilePicture
                        ? { uri: comment.createdBy.profilePicture }
                        : require('@/assets/images/avatar.jpg')
                }
                style={styles.commentAvatar}
            />
            <View style={{ flex: 1 }}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>
                        {comment.createdBy.fullname}
                    </Text>
                    <Text style={styles.commentTimestamp}>
                        {comment.createdAt?.toDate
                            ? dayjs(comment.createdAt.toDate()).fromNow()
                            : 'Just now'}
                    </Text>
                </View>

                <Text style={styles.commentText}>{comment.text}</Text>

                {/* Actions */}
                <CommentActions
                    comment={comment}
                    currentUserId={currentUserId}
                    onLike={handleLikeComment}
                    openReplies={openReplies}
                />
            </View>

            {/* Menu for edit/delete */}
            {comment.createdBy.uid === currentUserId && (
                <CommentMenu
                    setModalVisible={setModalVisible}
                    onDelete={() => onDelete(comment.id)}
                />
            )}

            {/* Edit Modal */}

            <EditModal
                visible={modalVisible}
                editText={editText}
                setEditText={setEditText}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
            />

            <RepliesSheet
                visible={repliesVisible}
                slideAnim={slideAnim}
                closeReplies={closeReplies}
                comment={comment}
            />
        </View>
    );
}
