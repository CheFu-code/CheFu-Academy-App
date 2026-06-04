import { CACHE_KEY } from '@/constant/caches';
import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import { Course } from '@/types/course';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useSafeNavigation } from './useSafeNavigation';

export const useCourses = () => {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const { safeReplace } = useSafeNavigation();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const userEmail = userDetail?.email;

    const loadCachedCourses = async () => {
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const parsed = JSON.parse(cached);
            setCourseList(parsed);
            return parsed;
        } catch (error) {
            console.error('Error loading cached courses:', error);
            return null;
        }
    };

    const fetchCourses = useCallback(async (isRefresh = false) => {
        if (fetching && !isRefresh) return;

        setLoading(true);
        setFetching(true);

        try {
            if (!userEmail) {
                setCourseList([]);
                safeReplace('/auth/sso' as any);
                return;
            }

            if (!userDetail?.id) {
                try {
                    const response = await chefuApiClient.get('/api/academy/mobile/me');
                    setUserDetail(response.data);
                } catch (err) {
                    console.error('Error refreshing userDetail:', err);
                    ToastAndroid.show(
                        'An error occurred while refreshing your profile.',
                        ToastAndroid.LONG,
                    );
                }
            }

            const response = await chefuApiClient.get(
                '/api/academy/mobile/courses/my',
                { params: { limit: 100 } },
            );
            const courses = (response.data?.courses || []) as Course[];

            const cachedCoursesJSON = await AsyncStorage.getItem(CACHE_KEY);
            const cachedCourses = cachedCoursesJSON
                ? JSON.parse(cachedCoursesJSON)
                : null;
            const isSame =
                cachedCourses &&
                JSON.stringify(cachedCourses) === JSON.stringify(courses);

            setCourseList(courses);

            if (!isSame) {
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(courses));
            }

            if (isRefresh) {
                ToastAndroid.show('Refreshed', ToastAndroid.SHORT);
            }
        } catch (error: unknown) {
            console.error('Error fetching courses:', error);
            let errorMessage = 'Failed to refresh. Please try again.';

            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                typeof (error as { code?: unknown }).code === 'string'
            ) {
                switch ((error as { code: string }).code) {
                    case 'firestore/unavailable':
                        errorMessage =
                            'Network error. Please check your connection.';
                        break;
                    case 'firestore/permission-denied':
                        errorMessage =
                            "You don't have permission to access these courses.";
                        break;
                }
            }

            ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, [fetching, safeReplace, setUserDetail, userDetail?.id, userEmail]);

    useEffect(() => {
        if (!userEmail) {
            setCourseList([]);
            return;
        }

        let mounted = true;
        void (async () => {
            const cached = await loadCachedCourses();
            if (!mounted) return;

            if (!cached) {
                await fetchCourses();
            } else {
                void fetchCourses();
            }
        })();

        return () => {
            mounted = false;
        };
    }, [fetchCourses, userEmail]);

    return { courseList, fetchCourses, loading, fetching };
};
