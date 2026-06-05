import { CACHE_KEY, scopedCacheKey } from '@/constant/caches';
import { UserDetailContext } from '@/context/UserDetailContext';
import { chefuApiClient } from '@/services/chefuApiClient';
import { Course } from '@/types/course';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useSafeNavigation } from './useSafeNavigation';

export const useCourses = () => {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const fetchingRef = useRef(false);
    const { safeReplace } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const userEmail = userDetail?.email;
    const courseCacheKey = useMemo(
        () => scopedCacheKey(CACHE_KEY, userEmail),
        [userEmail],
    );

    const loadCachedCourses = useCallback(async () => {
        try {
            const cached = await AsyncStorage.getItem(courseCacheKey);
            if (!cached) return null;

            const parsed = JSON.parse(cached) as Course[];
            setCourseList(parsed);
            return parsed;
        } catch (error) {
            console.error('Error loading cached courses:', error);
            return null;
        }
    }, [courseCacheKey]);

    const fetchCourses = useCallback(async (isRefresh = false) => {
        if (fetchingRef.current) return;

        fetchingRef.current = true;
        setLoading(true);
        setFetching(true);

        try {
            if (!userEmail) {
                setCourseList([]);
                safeReplace('/auth/sso' as any);
                return;
            }

            const response = await chefuApiClient.get(
                '/api/academy/mobile/courses/my',
                { params: { limit: 100 } },
            );
            const courses = (response.data?.courses || []) as Course[];
            const nextCache = JSON.stringify(courses);
            const cachedCoursesJSON = await AsyncStorage.getItem(courseCacheKey);

            setCourseList(courses);

            if (cachedCoursesJSON !== nextCache) {
                await AsyncStorage.setItem(courseCacheKey, nextCache);
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
            fetchingRef.current = false;
            setLoading(false);
            setFetching(false);
        }
    }, [courseCacheKey, safeReplace, userEmail]);

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
    }, [fetchCourses, loadCachedCourses, userEmail]);

    return { courseList, fetchCourses, loading, fetching };
};
