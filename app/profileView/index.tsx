import { db } from '@/config/fireConfig';
import { Colors } from '@/constant/Colors';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/ProfileView.styles';
import { Course } from '@/types/course';
import { User } from '@/types/user';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getDocs,
    query,
    where
} from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileView() {
    const { safeBack } = useSafeNavigation();
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User | null>(null);
    const [progress, setProgress] = useState(0);
    const [coursesCount, setCoursesCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [completedChaptersCount, setCompletedChaptersCount] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get user document
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserData(userSnap.data() as User);
                } else {
                    setUserData(null);
                }

                // Get courses created by this user
                const coursesQuery = query(
                    collection(db, 'course'),
                    where('createdBy', '==', userId),
                );
                const coursesSnap = await getDocs(coursesQuery);

                setCoursesCount(coursesSnap.size);

                let completedCourses = 0;
                let completedChapters = 0;
                let totalChapters = 0;

                coursesSnap.forEach(
                    (
                        docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot<Course>,
                    ) => {
                        const course = docSnap.data();
                        const courseChapters = course.chapters?.length || 0;
                        const completedChaptersInCourse =
                            course.completedChapter?.length || 0;

                        totalChapters += courseChapters;

                        if (
                            courseChapters > 0 &&
                            completedChaptersInCourse === courseChapters
                        ) {
                            completedCourses += 1;
                        }

                        completedChapters += completedChaptersInCourse;
                    },
                );

                setCompletedCount(completedCourses);
                setCompletedChaptersCount(completedChapters);

                const progressPercent =
                    totalChapters > 0
                        ? Math.round((completedChapters / totalChapters) * 100)
                        : 0;
                setProgress(progressPercent);
            } catch (err) {
                console.log('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}
                    size="large"
                    color={Colors.PRIMARY}
                />
            </SafeAreaView>
        );
    }

    if (!userData) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => safeBack()}
                >
                    <AntDesign name="left" size={24} color={Colors.WHITE} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.animationContainer}>
                    <LottieView
                        source={require('../../assets/animations/Empty box by partho.json')}
                        autoPlay
                        loop
                        style={{ width: 200, height: 200 }}
                    />
                    <Text style={styles.notFound}>Account Not Found</Text>
                    <Text style={styles.notFoundMessage}>
                        We couldn’t locate this profile. The account may have
                        been deleted or is no longer available.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../../assets/images/graph.png')}
                style={{ position: 'absolute', width: '100%', height: 500 }}
            />
            <TouchableOpacity onPress={() => safeBack()} style={styles.header}>
                <AntDesign name="left" size={24} color={Colors.WHITE} />
                <Text numberOfLines={1} style={styles.backText}>
                    {userData?.fullname || 'Back'}
                </Text>
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Image
                    source={
                        userData.profilePicture
                            ? { uri: userData.profilePicture }
                            : require('../../assets/images/logo.png')
                    }
                    style={styles.profilePicture}
                />
                <View>
                    <View style={styles.checkmark}>
                        <Text numberOfLines={1} style={styles.fullname}>
                            {userData?.fullname}
                        </Text>
                        {userData?.member && (
                            <Ionicons
                                name="checkmark-circle"
                                color={Colors.PRIMARY}
                                size={20}
                            />
                        )}
                    </View>
                    <Text numberOfLines={1} style={styles.email}>
                        {userData?.email}
                    </Text>
                    <Text numberOfLines={1} style={styles.email}>
                        {userData?.roles}
                    </Text>
                </View>
            </View>

            {userData?.bio && (
                <Text numberOfLines={3} style={styles.bio}>
                    {userData?.bio}
                </Text>
            )}

            <View style={styles.boxContainer}>
                <View style={styles.common}>
                    <View style={styles.box}>
                        <Text style={styles.numberOfCourses}>
                            {coursesCount}
                        </Text>
                        <Text style={[styles.email, { textAlign: 'center' }]}>
                            Courses
                        </Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.numberOfCourses}>
                            {completedCount}
                        </Text>
                        <Text style={[styles.email, { textAlign: 'center' }]}>
                            Completed Courses
                        </Text>
                    </View>
                </View>

                <View style={styles.common}>
                    <View style={styles.box}>
                        <Text style={styles.numberOfCourses}>
                            {completedChaptersCount}
                        </Text>
                        <Text style={[styles.email, { textAlign: 'center' }]}>
                            Completed Chapters
                        </Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.numberOfCourses}>{progress}%</Text>
                        <Text style={[styles.email, { textAlign: 'center' }]}>
                            Progress
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
