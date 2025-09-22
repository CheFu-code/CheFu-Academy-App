import CourseCard from '@/component/Shared/CourseCard';
import Loading from '@/component/Shared/Loading';
import { Colors } from '@/constant/Colors';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
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

export default function SearchScreen() {
    const { query } = useLocalSearchParams();
    const { safePush, safeBack } = useSafeNavigation();
    const [results, setResults] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const category = results[0]?.category;
    const db = getFirestore();

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

    useEffect(() => {
        fetchCourses(query);
    }, [query, fetchCourses]);

    if (loading) return <Loading message="Hang tight, we’re finding the best courses for you..." />;

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View
                style={{
                    paddingTop: 20,
                }}
            >
                <TouchableOpacity
                    onPress={safeBack}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.PRIMARY,
                        paddingBottom: 20,
                    }}
                >
                    <AntDesign color={'white'} size={20} name="left" />
                    <Text
                        numberOfLines={1}
                        style={{
                            color: Colors.WHITE,
                            fontSize: 20,
                            fontFamily: 'outfit-bold',
                            maxWidth: 320,
                        }}
                    >
                        Results for
                        <Text
                            numberOfLines={1}
                            style={{
                                color: Colors.PRIMARY,
                                fontStyle: 'italic',
                            }}
                        >
                            {' '}
                            &quot;{query}&quot;
                        </Text>
                    </Text>
                </TouchableOpacity>

                {results.length === 0 ? (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 50,
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
                                fontSize: 18,
                                textAlign: 'center',
                            }}
                        >
                            No courses were found.
                        </Text>
                        <Text
                            style={{
                                color: Colors.GRAY,
                                fontFamily: 'outfit',
                                fontSize: 15,
                                marginTop: 25,
                            }}
                        >
                            We couldn&apos;t find any courses that match your
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
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                        >
                            {category && (
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    style={{
                                        fontSize: 18,
                                        color: Colors.WHITE,
                                        fontFamily: 'outfit-bold',
                                        textTransform: 'capitalize',
                                        marginBottom: 10,
                                        maxWidth: 250,
                                    }}
                                >
                                    Category: {category}
                                </Text>
                            )}

                            {results.length > 0 && (
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
                                            {results.length}
                                        </Text>
                                    </Text>
                                </View>
                            )}
                        </View>

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
                            contentContainerStyle={{
                                paddingBottom: 240,
                            }}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}
