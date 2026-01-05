import HeaderText from '@/component/common/Header';
import CourseCard from '@/component/Shared/CourseCard';
import Loading from '@/component/Shared/Loading';
import VideoCard from '@/component/VideoCard';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useVideo } from '@/hooks/useVideo';
import { styles } from '@/styles/SearchResult.styles';
import { useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const { query } = useLocalSearchParams();
    const { safePush } = useSafeNavigation();
    const { videoResults, fetchVideos, results, fetchCourses, loading } =
        useVideo();
    const totalResults = results.length + videoResults.length;

    useEffect(() => {
        fetchCourses(query);
    }, [query, fetchCourses]);

    useEffect(() => {
        fetchVideos(query);
    }, [query, fetchVideos]);

    if (loading)
        return (
            <Loading message="Hang tight, we’re finding the best courses for you..." />
        );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: 5, flex: 1 }}>
                <HeaderText title="Results for :" />
                <View style={styles.queryContainer}>
                    <Text numberOfLines={1} style={styles.queryText}>
                        {' '}
                        &quot;{query}&quot;
                    </Text>
                    {(results.length > 0 || videoResults.length > 0) && (
                        <View style={styles.center}>
                            <Text style={styles.found}>
                                found:{' '}
                                <Text style={styles.total}>{totalResults}</Text>
                            </Text>
                        </View>
                    )}
                </View>

                {results.length === 0 && videoResults.length === 0 ? (
                    <View style={styles.noResultsContainer}>
                        <LottieView
                            source={require('../../assets/animations/Empty box by partho.json')}
                            autoPlay
                            loop
                            style={{ width: 190, height: 190 }}
                        />
                        <Text style={styles.noResultsText}>
                            No results were found.
                        </Text>
                        <Text style={styles.noResultsDescription}>
                            We couldn&apos;t find any results that match your
                            search. Try exploring by category — and if you still
                            don’t find what you’re looking for, be the first to{' '}
                            <TouchableOpacity
                                onPress={() => {
                                    safePush('/addCourse');
                                }}
                            >
                                <Text style={styles.createText}>
                                    create it with our AI
                                </Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>
                        {results.length > 0 && (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={results}
                                numColumns={2}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <CourseCard course={item} enroll={true} />
                                )}
                                contentContainerStyle={{
                                    paddingBottom: insets.bottom,
                                    paddingHorizontal: 10,
                                }}
                                columnWrapperStyle={{
                                    justifyContent: 'space-between',
                                }}
                            />
                        )}

                        {videoResults.length > 0 && (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={videoResults}
                                keyExtractor={(item) => item.id}
                                ListFooterComponent={
                                    <View style={{ height: insets.bottom }} />
                                }
                                renderItem={({ item }) => (
                                    <VideoCard
                                        item={item}
                                        onPress={(video) =>
                                            safePush({
                                                pathname: '/videoDetail',
                                                params:
                                                    video.uploadedBy ===
                                                    'YouTube'
                                                        ? {
                                                              ytVideo:
                                                                  JSON.stringify(
                                                                      video,
                                                                  ),
                                                          }
                                                        : { id: video.id },
                                            })
                                        }
                                        onCategoryPress={(category) =>
                                            safePush({
                                                pathname: '/searchResults',
                                                params: { query: category },
                                            })
                                        }
                                    />
                                )}
                                contentContainerStyle={{
                                    paddingHorizontal: 10,
                                }}
                            />
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
