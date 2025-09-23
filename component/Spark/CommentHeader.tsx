import { styles } from '@/styles/SparkDetail';
import dayjs from 'dayjs';
import React from 'react';
import { Image, Text, View } from 'react-native';

export default function CommentHeader({ comment }: { comment: any }) {
    return (
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
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
            </View>
        </View>
    );
}
