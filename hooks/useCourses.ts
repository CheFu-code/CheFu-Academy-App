import { auth, db } from '@/config/fireConfig';
import { CACHE_KEY } from '@/constant/caches';
import { UserDetailContext } from '@/context/UserDetailContext';
import { Course } from '@/types/course';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, reload } from '@react-native-firebase/auth';
import { collection, doc, FirebaseFirestoreTypes, getDoc, getDocs, orderBy, query, where } from '@react-native-firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useSafeNavigation } from './useSafeNavigation';

export const useCourses = () => {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const { safeReplace } = useSafeNavigation();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const loadCachedCourses = async () => {
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                setCourseList(parsed);
                return parsed;
            }
            return null;
        } catch (error) {
            console.error('Error loading cached courses:', error);
            return null;
        }
    };

    const loadCachedCoursesThenFetch = async () => {
        const cached = await loadCachedCourses();
        if (!cached) {
            await fetchCourses();
        } else {
            fetchCourses(); // fire and forget
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                loadCachedCoursesThenFetch();
            } else {
                setCourseList([]);
                safeReplace('/auth/signIn');
            }
        });

        return unsubscribe;
    }, [safeReplace]);

    const fetchCourses = useCallback(async (isRefresh = false) => {
        if (fetching && !isRefresh) return;

        setLoading(true);
        setFetching(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                setCourseList([]);
                safeReplace('/auth/signIn');
                return;
            }

            if (!user.email) {
                console.warn('Signed-in user has no email!');
                setCourseList([]);
                safeReplace('/auth/signIn');
                return;
            }

            await reload(user);
            const refreshedUser = auth.currentUser;

            if (!refreshedUser?.email) {
                ToastAndroid.show(
                    'We detected an issue, please try to login.',
                    ToastAndroid.LONG,
                );
                setCourseList([]);
                safeReplace('/');
                return;
            }
            if (!userDetail?.email) {
                const refreshedUser = auth.currentUser;

                if (refreshedUser?.email) {
                    try {
                        console.log(
                            'Fetching user document for:',
                            refreshedUser.email,
                        );
                        const userDocRef = doc(
                            db,
                            'users',
                            refreshedUser.email,
                        );
                        const docSnap = await getDoc(userDocRef);

                        if (docSnap.exists()) {
                            const freshData = {
                                id: docSnap.id,
                                ...docSnap.data(),
                            };
                            setUserDetail(freshData);
                        } else {
                            ToastAndroid.show(
                                "We couldn't find your user profile. Please login again.",
                                ToastAndroid.LONG,
                            );
                            setCourseList([]);
                            safeReplace('/auth/signIn');
                            return;
                        }
                    } catch (err) {
                        console.error('Error refreshing userDetail:', err);
                        ToastAndroid.show(
                            'An error occurred while refreshing your profile.',
                            ToastAndroid.LONG,
                        );
                        setCourseList([]);
                        safeReplace('/auth/signIn');
                        return;
                    }
                } else {
                    ToastAndroid.show(
                        'No active session found, please login again.',
                        ToastAndroid.LONG,
                    );
                    setCourseList([]);
                    safeReplace('/auth/signIn');
                    return;
                }
            }

            const coursesRef = collection(db, 'course');
            const q = query(
                coursesRef,
                where('createdBy', '==', refreshedUser.email),
                orderBy('createdOn', 'desc'),
            );

            const querySnapshot = await getDocs(q);

            const courses = querySnapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id,
                    };
                },
            );

            // Compare new courses with cache to avoid redundant writes
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
                typeof (error as any).code === 'string'
            ) {
                switch ((error as any).code) {
                    case 'firestore/unavailable':
                        errorMessage =
                            'Network error. Please check your connection.';
                        break;
                    case 'firestore/permission-denied':
                        errorMessage =
                            "You don't have permission to access these courses.";
                        break;
                    case 'auth/user-not-found':
                        errorMessage =
                            'User not found. Your account may have been deleted.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address format.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage =
                            'Too many requests. Please try again later.';
                        break;
                }
            }

            ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, [fetching, safeReplace, userDetail, setUserDetail]);

    return { courseList, fetchCourses, loading, fetching };
};
