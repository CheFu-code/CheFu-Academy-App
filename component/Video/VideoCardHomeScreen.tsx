import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useVideos } from '@/hooks/useVideos';
import { Video } from '@/types/video';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback } from 'react';
import { FlatList } from 'react-native';
import VideoCard from '../VideoCard';

dayjs.extend(relativeTime);

export default function VideoCardHomeScreen() {
    const { safePush } = useSafeNavigation();
    const { videos } = useVideos();

    const handleCategoryPress = useCallback(
        (category: string) => {
            safePush({
                pathname: '/searchResults',
                params: { query: category },
            });
        },
        [safePush],
    );

    const renderVideoCard = useCallback(
        ({ item }: { item: Video }) => (
            <VideoCard
                item={item}
                onPress={(item) =>
                    safePush({
                        pathname: '/videoDetail',
                        params:
                            item.uploadedBy === 'YouTube'
                                ? { ytVideo: JSON.stringify(item) }
                                : { id: item.id },
                    })
                }
                onCategoryPress={handleCategoryPress}
            />
        ),
        [safePush, handleCategoryPress],
    );

    return (
        <FlatList
            data={videos}
            keyExtractor={(item, index) => item.id ?? index.toString()}
            renderItem={renderVideoCard}
            contentContainerStyle={{ paddingBottom: 20 }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={3}
            removeClippedSubviews
        />
    );
}
