import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constant/Colors';
import { Likes } from '@/types/sparks';
import { styles } from '@/styles/SparkDetail';
import { formatViews } from '@/utils/formatViews';

interface Props {
    likes: Likes[];
    commentsCount: number;
    onLike: () => void;
    liked: boolean;
}

export default function SparkActions({
    likes,
    commentsCount,
    onLike,
    liked,
}: Props) {
    return (
        <View style={styles.actions}>
            <TouchableOpacity onPress={onLike} style={styles.actionButton}>
                <AntDesign
                    name={liked ? 'like1' : 'like2'}
                    size={20}
                    color={Colors.PRIMARY}
                />
                <Text style={styles.actionText}>
                    {formatViews(likes?.length || 0)}{' '}
                    {likes?.length < 2 ? 'Like' : 'Likes'}
                </Text>
            </TouchableOpacity>
            <View style={styles.actionButton}>
                <FontAwesome
                    name="comment-o"
                    size={20}
                    color={Colors.PRIMARY}
                />
                <Text style={styles.actionText}>
                    {formatViews(commentsCount || 0)}{' '}
                    {commentsCount < 2 ? 'Comment' : 'Comments'}
                </Text>
            </View>
        </View>
    );
}
