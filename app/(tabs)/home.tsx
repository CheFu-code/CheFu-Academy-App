import EmailVerificationBanner from '@/component/Home/EmailVerificationBanner';
import SparksFeed from '@/component/Home/SparksFeed';
import VideoCardHomeScreen from '@/component/Video/VideoCardHomeScreen';
import { useCourses } from '@/hooks/useCourses';
import { getAuth } from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef } from 'react';
import { FlatList, Image, View } from 'react-native';
import CourseList from '../../component/Home/CourseList';
import CourseProgress from '../../component/Home/CourseProgress';
import Header from '../../component/Home/Header';
import LineLoader from '../../component/Home/LineLoader';
import NoCourse from '../../component/Home/NoCourse';
import PracticeSection from '../../component/Home/PracticeSection';
import { Colors } from '../../constant/Colors';

export default function Home() {
    const auth = getAuth();
    const flatListRef = useRef<FlatList>(null);
    const { courseList, fetchCourses, loading } = useCourses();

    useFocusEffect(
        useCallback(() => {
            if (auth.currentUser) {
                fetchCourses();
            }
        }, [auth]),
    );

    function shuffleArray<T>(array: T[]): T[] {
        return array
            .map((item) => ({ item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ item }) => item);
    }

    const randomizedBlocks = useMemo(
        () =>
            shuffleArray([
                <VideoCardHomeScreen key="videos" />,
                <SparksFeed key="sparks" />,
            ]),
        [courseList],
    );

    return (
        <>
            <EmailVerificationBanner />
            <Header
                onPress={() => {
                    flatListRef.current?.scrollToOffset({
                        offset: 0,
                        animated: true,
                    });
                }}
            />

            {loading && <LineLoader />}

            <FlatList
                ref={flatListRef}
                data={courseList}
                keyExtractor={(item) => item.id}
                style={{ backgroundColor: Colors.BG_COLOR }}
                onRefresh={() => {
                    if (auth.currentUser) {
                        fetchCourses(true);
                    }
                }}
                refreshing={loading}
                showsVerticalScrollIndicator={false}
                renderItem={() => null}
                ListHeaderComponent={
                    <View>
                        <Image
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: 400,
                            }}
                            source={require('../../assets/images/graph.png')}
                            resizeMode="cover"
                        />
                        <>
                            {courseList.length === 0 ? (
                                <NoCourse />
                            ) : (
                                <>
                                    <CourseProgress courseList={courseList} />

                                    <View style={{ padding: 10 }}>
                                        {/* <Categories /> */}
                                        <PracticeSection />

                                        <CourseList courseList={courseList} />

                                        {randomizedBlocks}
                                    </View>
                                </>
                            )}
                        </>
                    </View>
                }
            />
        </>
    );
}
