import { useFocusEffect } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, Image, Text, ToastAndroid, View } from 'react-native';
import NoCourse from '../../component/Home/NoCourse';
import CourseProgressCard from '../../component/Shared/CourseProgressCard';
import { UserDetailContext } from '../../context/UserDetailContext';

import { db } from '@/config/fireConfig';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    orderBy,
    query,
    where,
} from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import { styles } from '../../styles/Progress.styles';

export default function Progress({ enroll = false }) {
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { backgroundColor } = useDarkMode();
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [fetching, setFetching] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setLoadingId(null);
        }, []),
    );

    const GetCourseList = useCallback(async () => {
        if (fetching) return;
        setLoading(true);
        setFetching(true);
        setCourseList([]);
        if (!userDetail?.email) {
            setLoading(false);
            setFetching(false);
            return;
        }

        try {
            const courseRef = collection(db, 'course');
            const q = query(
                courseRef,
                where('createdBy', '==', userDetail?.email),
                orderBy('createdOn', 'desc'),
            );
            const querySnapshot = await getDocs(q);

            const courses = querySnapshot.docs.map(
                (
                    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<Course>,
                ) => ({
                    ...doc.data(),
                    id: doc.id,
                }),
            );

            setCourseList(courses);
        } catch (error) {
            console.error(error);
            Sentry.captureException(error);
            if (typeof ToastAndroid !== 'undefined') {
                ToastAndroid.show(
                    'Failed to load progress',
                    ToastAndroid.SHORT,
                );
            }
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, [userDetail?.email]);

    useEffect(() => {
        if (userDetail) GetCourseList();
    }, [userDetail, GetCourseList]);

    const handlePress = (item: Course) => {
        const id = item.id || item.courseTitle || '';
        setLoadingId(id);

        safePush({
            pathname: '/courseView',
            params: {
                courseParams: JSON.stringify(item),
                enroll: enroll ? 'true' : 'false',
            },
        });
    };

    if (loading && courseList.length === 0) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor }]}>
                <LottieView
                    autoPlay
                    loop
                    source={require('../../assets/animations/Loading.json')}
                    style={{
                        width: scale(150),
                        height: verticalScale(150),
                    }}
                />
                <Text style={styles.loadingText}>Loading your progress...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <Image
                source={require('../../assets/images/graph.png')}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: verticalScale(500),
                }}
            />
            <View>
                <Text style={styles.headerText}>Course Progress</Text>

                {courseList.length > 0 ? (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        onRefresh={GetCourseList}
                        refreshing={loading}
                        data={courseList}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isLoading =
                                loadingId ===
                                (item.id || item.courseTitle || '');
                            return (
                                <CourseProgressCard
                                    item={item}
                                    width={'97%'}
                                    loading={isLoading}
                                    disabled={Boolean(loadingId)}
                                    onPress={() => handlePress(item)}
                                />
                            );
                        }}
                        contentContainerStyle={{ padding: scale(10) }}
                    />
                ) : (
                    !loading && <NoCourse />
                )}
            </View>
        </SafeAreaView>
    );
}
