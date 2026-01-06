import { useFocusEffect } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    ToastAndroid,
    View,
} from 'react-native';
import NoCourse from '../../component/Home/NoCourse';
import CourseProgressCard from '../../component/Shared/CourseProgressCard';
import { UserDetailContext } from '../../context/UserDetailContext';

import { db } from '@/config/firebaseConfig';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { styles } from '../../styles/Progress.styles';

export default function Progress({ enroll = false }) {
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { color, backgroundColor } = useDarkMode();
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [courseList, setCourseList] = useState<Course[]>([]);
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
        setLastDoc(null);

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
                limit(7),
            );

            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    ...doc.data(),
                    id: doc.id,
                }),
            );

            setCourseList(data);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        } catch (error) {
            console.error(error);
            Sentry.captureException(error);
            ToastAndroid.show('Failed to load progress', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, [userDetail?.email]);

    const loadMore = async () => {
        if (loadingMore || !lastDoc) return;

        setLoadingMore(true);

        try {
            const courseRef = collection(db, 'course');
            const q = query(
                courseRef,
                where('createdBy', '==', userDetail?.email),
                orderBy('createdOn', 'desc'),
                startAfter(lastDoc),
                limit(7),
            );

            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    ...doc.data(),
                    id: doc.id,
                }),
            );

            setCourseList((prev) => [...prev, ...data]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        } catch (error) {
            console.error(error);
            Sentry.captureException(error);
        } finally {
            setLoadingMore(false);
        }
    };

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
                        showsVerticalScrollIndicator={true}
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
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={
                            loadingMore ? (
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: scale(3),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color,
                                            textAlign: 'center',
                                            padding: scale(10),
                                            margin: scale(5),
                                        }}
                                    >
                                        Loading more...
                                    </Text>
                                    <ActivityIndicator
                                        size={'small'}
                                        color={color}
                                    />
                                </View>
                            ) : null
                        }
                        contentContainerStyle={{
                            padding: scale(10),
                            marginBottom: moderateScale(10),
                        }}
                    />
                ) : (
                    !loading && <NoCourse />
                )}
            </View>
        </SafeAreaView>
    );
}
