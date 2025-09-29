import { Colors } from '@/constant/Colors';
import { styles } from '@/styles/SparkDetail';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Likes } from '@/types/sparks';
import { formatViews } from '@/utils/formatViews';

interface Props {
    comment: any;
    currentUserId: string;
    onLike: () => void;
    openReplies: () => void;
}

export default function CommentActions({
    comment,
    currentUserId,
    onLike,
    openReplies,
}: Props) {
    return (
        <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={onLike} style={styles.actionButton}>
                <AntDesign
                    name={
                        comment.likes?.some(
                            (like: Likes) =>
                                like.createdBy.uid === currentUserId,
                        )
                            ? 'like1'
                            : 'like2'
                    }
                    color={Colors.PRIMARY}
                    size={15}
                />
                <Text style={styles.actionText}>
                    {formatViews(comment.likes?.length || 0)}
                    {comment.likes?.length < 2 ? ' Like' : ' Likes'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openReplies} style={styles.actionButton}>
                <FontAwesome
                    name="comment-o"
                    size={15}
                    color={Colors.PRIMARY}
                />
                <Text style={styles.actionText}>
                    {formatViews(comment.replies?.length || 0)}
                    {comment.replies?.length < 2 ? ' Reply' : ' Replies'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
