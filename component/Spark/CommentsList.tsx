import { styles } from '@/styles/SparkDetail';
import { Text, View } from 'react-native';
import CommentItem from './CommentItem';
import { Likes } from '@/types/sparks';

interface Props {
    comments: any[];
    currentUserId: string;
    onEdit: (id: string, newText: string) => void;
    onDelete: (id: string) => void;
    onLike: (commentId: string, likes?: Likes[]) => void;
}

export default function CommentsList({
    comments,
    currentUserId,
    onEdit,
    onDelete,
    onLike,
}: Props) {
    if (!comments.length) {
        return <Text style={styles.noComments}>No comments yet</Text>;
    }

    return (
        <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>Comments</Text>
            {comments.map((c, i) => (
                <CommentItem
                    key={c.id}
                    comment={c}
                    index={i}
                    currentUserId={currentUserId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onLike={onLike}
                />
            ))}
        </View>
    );
}
