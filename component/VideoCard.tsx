// components/VideoCard.tsx
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Colors } from '@/constant/Colors';
import { formatDuration } from '@/helpers/formatDateVideoCard';
import { formatYouTubeDuration } from '@/services/videoService';
import { formatViews } from '@/utils/formatViews';
import { Video } from '@/types/video';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { styles } from '@/styles/VideoCardHomeScreen.styles';

interface VideoCardProps {
    item: Video;
    onPressCategory: (category: string) => void;
    onPressVideo: (video: Video) => void;
}

export default function VideoCard({
    item,
    onPressCategory,
    onPressVideo,
}: VideoCardProps) {
    return (
        <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => onPressVideo(item)}
        >
            <View style={styles.card}>
                {item.thumbnailURL && (
                    <Image
                        source={{ uri: item.thumbnailURL }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                )}
            </View>
            <Text numberOfLines={2} style={styles.title}>
                {item.title}
            </Text>
            <Text numberOfLines={3} style={styles.description}>
                {item.description}
            </Text>

            <TouchableOpacity
                onPress={() => onPressCategory(item.category)}
                style={styles.category}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                    }}
                >
                    <Text style={styles.categoryText}>{item.category}</Text>
                    {item.category === 'YouTube' && (
                        <AntDesign name="youtube" color={'red'} size={15} />
                    )}
                </View>
            </TouchableOpacity>

            <View style={styles.durationContainer}>
                <Text style={styles.uploadedAt}>
                    {item.uploadedBy !== 'YouTube'
                        ? item.uploadedAt && 'toDate' in item.uploadedAt
                            ? dayjs(item.uploadedAt.toDate()).fromNow()
                            : 'Just now'
                        : item.uploadedBy}
                </Text>
                <View style={[styles.durationInfo, { left: 40 }]}>
                    <AntDesign
                        name="clockcircleo"
                        size={14}
                        color={Colors.BLACK}
                    />
                    <Text style={styles.duration}>
                        {typeof item.duration === 'string'
                            ? formatYouTubeDuration(item.duration)
                            : formatDuration(item.duration)}{' '}
                    </Text>
                </View>
                <View style={[styles.durationInfo, { maxWidth: 100 }]}>
                    <FontAwesome5 name="users" size={14} color={Colors.BLACK} />
                    <Text numberOfLines={1} style={styles.duration}>
                        {formatViews(item.views)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
