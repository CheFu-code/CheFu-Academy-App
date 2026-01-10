import { CACHED_COURSES } from '@/constant/caches';
import { courseRef } from '@/constant/random';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Course } from '@/types/course';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    FirebaseFirestoreTypes,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
} from '@react-native-firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';

export const usePaginatedCourses = (pageSize = 6) => {
    const { userDetail } = useContext(UserDetailContext);

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] =
        useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchCourses = useCallback(async () => {
        setRefreshing(true);
        setLoading(true);
        setLastDoc(null);
        setHasMore(true);

        try {
            const q = query(
                courseRef,
                orderBy('createdOn', 'desc'),
                limit(pageSize),
            );
            const snapshot = await getDocs(q);

            let data: Course[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                }),
            );

            // Filter out courses created by current user
            data = data.filter(
                (course) => course.createdBy !== userDetail?.email,
            );

            setCourses(data);
            setHasMore(data.length === pageSize);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);

            // Save cache
            await AsyncStorage.setItem(CACHED_COURSES, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            const cached = await AsyncStorage.getItem(CACHED_COURSES);
            if (cached) {
                setCourses(JSON.parse(cached));
            }
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [pageSize, userDetail?.email]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !lastDoc || !hasMore) return;

        setLoadingMore(true);

        try {
            const q = query(
                courseRef,
                orderBy('createdOn', 'desc'),
                startAfter(lastDoc),
                limit(pageSize),
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setHasMore(false);
                setLastDoc(null);
                return;
            }

            let data: Course[] = snapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
                    id: doc.id,
                    ...doc.data(),
                }),
            );

            // Filter out courses created by current user
            data = data.filter(
                (course) => course.createdBy !== userDetail?.email,
            );

            setCourses((prev) => [...prev, ...data]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(data.length === pageSize);

            // Update cache
            const cached = await AsyncStorage.getItem(CACHED_COURSES);
            const cachedData: Course[] = cached ? JSON.parse(cached) : [];
            await AsyncStorage.setItem(
                CACHED_COURSES,
                JSON.stringify([...cachedData, ...data]),
            );
        } catch (error) {
            console.error('Failed to load more courses:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [lastDoc, loadingMore, hasMore, pageSize, userDetail?.email]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return {
        courses,
        loading,
        refreshing,
        loadingMore,
        hasMore,
        fetchCourses,
        loadMore,
    };
};
