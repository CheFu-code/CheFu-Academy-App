import useDarkMode from '@/hooks/useDarkMode';
import { styles } from '@/styles/SparkDetail';
import { Likes, Replies } from '@/types/sparks';
import { Text, View } from 'react-native';
import CommentItem from './CommentItem';

interface Props {
    comments: any[];
    currentUserId: string;
    sparkId: string;
    onEdit: (id: string, newText: string) => void;
    onDelete: (id: string) => void;
    onLike: (commentId: string, likes?: Likes[]) => void;
    onReply?: (commentId: string, reply: Replies) => void; // <-- new prop
}

export default function CommentsList({
    comments,
    currentUserId,
    sparkId,
    onEdit,
    onDelete,
    onLike,
    onReply,
}: Props) {
    const { textColor } = useDarkMode();
    if (!comments.length) {
        return <Text style={styles.noComments}>No comments yet</Text>;
    }

    return (
        <View>
            <Text style={[styles.commentsHeader, { color: textColor }]}>
                Comments
            </Text>
            {comments.map((c, i) => (
                <CommentItem
                    key={c.id}
                    comment={c}
                    index={i}
                    currentUserId={currentUserId}
                    sparkId={sparkId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onLike={onLike}
                    onReply={onReply} // <-- pass down the new prop
                />
            ))}
        </View>
    );
}
