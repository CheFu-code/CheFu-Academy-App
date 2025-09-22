import React, { memo } from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { formatDuration } from '@/helpers/formatDateVideoCard';
import { formatYouTubeDuration } from '@/services/videoService';
import { formatViews } from '@/utils/formatViews';
import { Colors } from '@/constant/Colors';
import { Video } from '@/types/video';
import { styles } from '@/styles/VideoCardHomeScreen.styles';
import { useRenderTextWithLinks } from '@/helpers/detectLinks';

interface Props {
    item: Video;
    onPress: (item: Video) => void;
    onCategoryPress: (category: string) => void;
}

const VideoCard: React.FC<Props> = ({ item, onPress, onCategoryPress }) => {
    const { renderTextWithLinks } = useRenderTextWithLinks();
    return (
        <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => onPress(item)}
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
                {item?.description
                    ? renderTextWithLinks(item.description)
                    : 'No description available.'}
            </Text>
            <TouchableOpacity
                onPress={() => onCategoryPress(item.category)}
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
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    <Text style={styles.uploadedAt}>
                        {item.uploadedBy !== 'YouTube'
                            ? item.uploadedAt && 'toDate' in item.uploadedAt
                                ? dayjs(item.uploadedAt.toDate()).fromNow()
                                : 'Just now'
                            : item.uploadedBy}
                    </Text>
                    {item.uploadedBy === 'YouTube' && (
                        <AntDesign name="youtube" color={'red'} size={15} />
                    )}
                </View>
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
};

export default memo(VideoCard);
