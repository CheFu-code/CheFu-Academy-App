import EmailVerificationBanner from '@/component/Home/EmailVerificationBanner';
import VideoCardHomeScreen from '@/component/Video/VideoCardHomeScreen';
import { auth } from '@/config/firebaseConfig';
import { useCourses } from '@/hooks/useCourses';
import useDarkMode from '@/hooks/useDarkMode';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef } from 'react';
import { FlatList, Image, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import CourseList from '../../component/Home/CourseList';
import CourseProgress from '../../component/Home/CourseProgress';
import Header from '../../component/Home/Header';
import LineLoader from '../../component/Home/LineLoader';
import NoCourse from '../../component/Home/NoCourse';
import PracticeSection from '../../component/Home/PracticeSection';

export default function Home() {
    const flatListRef = useRef<FlatList>(null);
    const { backgroundColor } = useDarkMode();
    const { courseList, fetchCourses, loading } = useCourses();

    useFocusEffect(
        useCallback(() => {
            if (auth.currentUser) {
                fetchCourses();
            }
        }, []),
    );

    const randomizedBlocks = useMemo(
        () => [<VideoCardHomeScreen key="videos" />],
        [],
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
                style={{ backgroundColor }}
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
                                height: scale(400),
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

                                    <View style={{ padding: scale(10) }}>
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
