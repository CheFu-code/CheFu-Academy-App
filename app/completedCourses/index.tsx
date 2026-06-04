import HeaderText from '@/component/common/Header';
import Loading from '@/component/Shared/Loading';
import { Colors } from '@/constant/Colors';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { chefuApiClient } from '@/services/chefuApiClient';
import { styles } from '@/styles/CompletedCourse.styles';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
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
                safeReplace('/auth/sso' as any);
                return;
            }

            try {
                // ✅ Fetch only courses created by the current user
                const response = await chefuApiClient.get(
                    '/api/academy/mobile/courses/my',
                    { params: { limit: 100, status: 'completed' } },
                );
                const completed = (response.data?.courses || []) as Course[];

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
