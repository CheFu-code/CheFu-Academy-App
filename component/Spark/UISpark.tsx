import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/SparksFeed.styles';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { Colors } from '@/constant/Colors';
import dayjs from 'dayjs';
import { formatViews } from '@/utils/formatViews';
import { Likes, Spark } from '@/types/sparks';

interface UISparkProps {
    deleting: boolean;
    handleDelete: (sparkId: string) => void;
    handleLike: (sparkId: string, likes?: Likes[]) => void;
    item: Spark;
    hasLiked: boolean;
    isVerified: boolean;
}

const UISpark = ({
    deleting,
    handleDelete,
    handleLike,
    item,
    hasLiked,
    isVerified,
}: UISparkProps) => {
    const { safePush } = useSafeNavigation();
    return (
        <TouchableOpacity
            disabled={deleting}
            onPress={() => {
                safePush({
                    pathname: '/sparkDetail',
                    params: { sparkId: item.id },
                });
            }}
            onLongPress={() => handleDelete(item.id)}
            style={styles.card}
        >
            <View style={styles.header}>
                <TouchableOpacity style={styles.authorContainer}>
                    <Image
                        source={
                            item.createdBy?.profilePicture
                                ? { uri: item?.createdBy?.profilePicture }
                                : require('@/assets/images/avatar.jpg')
                        }
                        style={{ width: 35, height: 35, borderRadius: 20 }}
                    />
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: scale(3),
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    maxWidth: 150,
                                    fontFamily: 'outfit-bold',
                                }}
                            >
                                {item.createdBy?.fullname || 'Anonymous'}
                            </Text>
                            {isVerified && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={scale(12)}
                                    color={Colors.PRIMARY}
                                />
                            )}
                        </View>
                        <Text style={styles.author}>
                            {item.createdAt?.toDate
                                ? dayjs(item.createdAt.toDate()).fromNow()
                                : 'Just now'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        safePush({
                            pathname: '/categorySparks',
                            params: { category: item.category },
                        });
                    }}
                    style={styles.categoryCont}
                >
                    <Text style={styles.category}>{item.category}</Text>
                </TouchableOpacity>
            </View>
            <Text numberOfLines={1} style={styles.title}>
                {item.title}
            </Text>
            <Text numberOfLines={3} style={styles.content}>
                {item.content}
            </Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLike(item.id, item.likes)}
                >
                    <AntDesign
                        name={hasLiked ? 'like1' : 'like2'}
                        size={scale(16)}
                        color={hasLiked ? Colors.PRIMARY : Colors.GRAY}
                    />
                    <Text style={styles.actionText}>
                        {formatViews(item.likes?.length || 0)}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        safePush({
                            pathname: '/sparkDetail',
                            params: { sparkId: item.id },
                        });
                    }}
                    style={styles.actionButton}
                >
                    <FontAwesome
                        name="comment-o"
                        size={scale(16)}
                        color={Colors.PRIMARY}
                    />
                    <Text style={styles.actionText}>
                        {formatViews(item.comments?.length || 0)}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <AntDesign
                        name="sharealt"
                        size={scale(16)}
                        color={Colors.PRIMARY}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default UISpark;