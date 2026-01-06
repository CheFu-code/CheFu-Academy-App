import HeaderText from '@/component/common/Header';
import Loading from '@/component/Shared/Loading';
import { db } from '@/config/firebaseConfig';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { styles } from '@/styles/CompletedCourse.styles';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    query,
    where,
} from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

const CompletedChapters = () => {
    const { safeReplace } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { color, backgroundColor } = useDarkMode();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompleted = async () => {
            if (!userDetail?.email) {
                safeReplace('/auth/signIn');
                return;
            }

            try {
                // ✅ Fetch only courses created by the current user
                const q = query(
                    collection(db, 'course'),
                    where('createdBy', '==', userDetail?.email),
                );

                const snapshot = await getDocs(q);
                let completed: Course[] = [];

                snapshot.forEach(
                    (
                        docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot<Course>,
                    ) => {
                        const data = docSnap.data() as Course;

                        if (
                            data.completedChapter &&
                            data.completedChapter.length > 0
                        ) {
                            completed.push({
                                ...data,
                                id: docSnap.id,
                            });
                        }
                    },
                );

                setCourses(completed);
            } catch (error) {
                console.error('Error fetching completed chapters:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userDetail?.email) {
            fetchCompleted();
        }
    }, [userDetail?.email, safeReplace]);

    const renderItem = ({ item }: { item: Course }) => (
        <View style={styles.courseItem}>
            <Ionicons
                name="checkmark-circle"
                size={scale(26)}
                color={Colors.GREEN}
            />
            <View style={{ marginLeft: scale(12), width: '80%' }}>
                <Text
                    numberOfLines={2}
                    style={[styles.courseTitle, { color }]}
                >
                    {item.courseTitle}
                </Text>
                <Text style={styles.courseDate}>
                    {item.chapters.length} chapters completed
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <HeaderText title="Completed Courses" />

            {courses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="sad-outline"
                        size={scale(50)}
                        color={Colors.GRAY}
                    />
                    <Text style={styles.emptyText}>
                        No courses completed yet
                    </Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={courses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </SafeAreaView>
    );
};

export default CompletedChapters;
