import CourseCard from '@/component/Shared/CourseCard';
import Loading from '@/component/Shared/Loading';
import VideoCard from '@/component/VideoCard';
import { Colors } from '@/constant/Colors';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import { Video } from '@/types/video';
import { AntDesign } from '@expo/vector-icons';
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    getFirestore,
} from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const { query } = useLocalSearchParams();
    const { safePush, safeBack } = useSafeNavigation();
    const [results, setResults] = useState<Course[]>([]);
    const [videoResults, setVideoResults] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();
    const totalResults = results.length + videoResults.length;

    const fetchCourses = useCallback(
        async (query: string | string[]) => {
            try {
                const term = Array.isArray(query) ? query[0] : query || '';

                const snapshot = await getDocs(collection(db, 'course'));

                const filtered: Course[] = snapshot.docs
                    .map(
                        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                docId: doc.id,
                                courseTitle:
                                    data.courseTitle || data.title || '',
                                category: data.category,
                                banner_image: data.banner_image,
                                chapters: data.chapters,
                                flashcards: data.flashcards,
                                qa: data.qa,
                                quiz: data.quiz,
                                description: data.description,
                                price: data.price,
                                createdBy: data.createdBy,
                                createdOn: data.createdOn,
                                enrolled: data.enrolled,
                            };
                        },
                    )
                    .filter(
                        (course: Course) =>
                            course.courseTitle
                                ?.toLowerCase()
                                .includes(term.toLowerCase()) ||
                            course.category
                                ?.toLowerCase()
                                .includes(term.toLowerCase()),
                    );

                setResults(filtered);
            } catch (e) {
                console.error('Search error:', e);
            } finally {
                setLoading(false);
            }
        },
        [db],
    );
    const fetchVideos = useCallback(
        async (query: string | string[]) => {
            try {
                const term = Array.isArray(query) ? query[0] : query || '';

                const snapshot = await getDocs(collection(db, 'videos'));

                const filtered: Video[] = snapshot.docs
                    .map(
                        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                docId: doc.id,
                                title: data.title || '',
                                category: data.category,
                                thumbnailURL: data.thumbnailURL,
                                videoURL: data.videoURL,
                                views: data.views,
                                duration: data.duration,
                                instructorCompany: data.instructorCompany,
                                instructorName: data.instructorName,
                                description: data.description,
                                level: data.level,
                                uploadedBy: data.uploadedBy,
                                uploadedAt: data.uploadedAt,
                                topics: data.topics,
                            };
                        },
                    )
                    .filter(
                        (video: Video) =>
                            video.title
                                ?.toLowerCase()
                                .includes(term.toLowerCase()) || // ✅ use videoTitle
                            video.category
                                ?.toLowerCase()
                                .includes(term.toLowerCase()),
                    );

                setVideoResults(filtered);
            } catch (e) {
                console.error('Search error:', e);
            } finally {
                setLoading(false);
            }
        },
        [db],
    );

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
            <View style={{ marginTop: 5 }}>
                <TouchableOpacity
                    onPress={safeBack}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        borderBottomWidth: 0.7,
                        borderBottomColor: Colors.GRAY,
                        paddingBottom: 5,
                    }}
                >
                    <AntDesign
                        style={{ left: 5 }}
                        color={'white'}
                        size={20}
                        name="left"
                    />
                    <Text
                        numberOfLines={1}
                        style={{
                            color: Colors.WHITE,
                            fontSize: RFValue(18),
                            fontFamily: 'outfit-bold',
                            maxWidth: 320,
                        }}
                    >
                        Results for :
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: 10,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            color: Colors.PRIMARY,
                            fontStyle: 'italic',
                            fontSize: RFValue(14),
                        }}
                    >
                        {' '}
                        &quot;{query}&quot;
                    </Text>
                    {results.length > 0 ||
                        (videoResults.length > 0 && (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'outfit',
                                        color: 'white',
                                    }}
                                >
                                    found:{' '}
                                    <Text
                                        style={{
                                            fontFamily: 'outfit-bold',
                                            color: Colors.PRIMARY,
                                        }}
                                    >
                                        {totalResults}
                                    </Text>
                                </Text>
                            </View>
                        ))}
                </View>

                {results.length === 0 && videoResults.length === 0 ? (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 50,
                            padding: 20,
                        }}
                    >
                        <LottieView
                            source={require('../../assets/animations/Empty box by partho.json')}
                            autoPlay
                            loop
                            style={{ width: 190, height: 190 }}
                        />
                        <Text
                            style={{
                                color: Colors.GRAY,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 50,
                                fontFamily: 'outfit-bold',
                                fontSize: RFValue(16),
                                textAlign: 'center',
                            }}
                        >
                            No results were found.
                        </Text>
                        <Text
                            style={{
                                color: Colors.GRAY,
                                fontFamily: 'outfit',
                                fontSize: RFValue(13),
                                marginTop: 25,
                            }}
                        >
                            We couldn&apos;t find any results that match your
                            search. Try exploring by category — and if you still
                            don’t find what you’re looking for, be the first to{' '}
                            <TouchableOpacity
                                onPress={() => {
                                    safePush('/addCourse');
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors.PRIMARY,
                                        textDecorationLine: 'underline',
                                    }}
                                >
                                    create it with our AI
                                </Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                ) : (
                    <View>
                        {results.length > 0 && (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={results}
                                numColumns={2}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <CourseCard course={item} enroll={true} />
                                )}
                                columnWrapperStyle={{
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 10,
                                }}
                            />
                        )}

                        {videoResults.length > 0 && (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={videoResults}
                                keyExtractor={(item) => item.id}
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
