import HeaderText from '@/component/common/Header';
import { Colors } from '@/constant/Colors';
import { imageAssets } from '@/constant/Option';
import { UserDetailContext } from '@/context/UserDetailContext';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { chefuApiClient } from '@/services/chefuApiClient';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { styles } from '../../styles/MyCourses.styles';

export default function MyCourses() {
    const { userDetail } = useContext(UserDetailContext);
    const { safePush } = useSafeNavigation();
    const { backgroundColor } = useDarkMode();
    const [loading, setLoading] = useState(true);
    const [myCourses, setMyCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                if (!userDetail?.email) return;

                const response = await chefuApiClient.get(
                    '/api/academy/mobile/courses/my',
                    { params: { limit: 100 } },
                );
                const courses = response.data?.courses || [];
                setMyCourses(courses);
            } catch (err) {
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, [userDetail?.email]);

    const isCourseComplete = (course: Course) => {
        const totalChapters = course.chapters?.length || 0;
        const completedChapters = course.completedChapter?.length || 0;

        return totalChapters > 0 && totalChapters === completedChapters;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Header */}
            <HeaderText title="My Courses" />

            {/* Body */}
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.PRIMARY}
                    style={styles.loader}
                />
            ) : myCourses.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                        You haven’t created or enrolled in any courses yet.
                    </Text>
                </View>
            ) : (
                <>
                    <FlatList
                        numColumns={2}
                        data={myCourses}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.courseCard,
                                    {
                                        backgroundColor: isCourseComplete(item)
                                            ? Colors.LIGHT_GREEN
                                            : Colors.BG_GRAY,
                                    },
                                ]}
                                onPress={() =>
                                    safePush({
                                        pathname: '/courseView',
                                        params: {
                                            courseParams: JSON.stringify(item),
                                            enroll: 'true',
                                        },
                                    })
                                }
                            >
                                {item.banner_image && (
                                    <>
                                        <Image
                                            source={
                                                imageAssets[item?.banner_image]
                                            }
                                            style={styles.bannerImage}
                                            resizeMode="cover"
                                        />

                                        {isCourseComplete(item) && (
                                            <Ionicons
                                                size={scale(20)}
                                                color={Colors.GREEN}
                                                name="checkmark-circle"
                                                style={styles.checkmark}
                                            />
                                        )}
                                    </>
                                )}

                                <View style={styles.detailsContainer}>
                                    <Text
                                        numberOfLines={3}
                                        style={styles.courseTitle}
                                    >
                                        {item.courseTitle}
                                    </Text>

                                    <View style={styles.chapterContainer}>
                                        <Text style={styles.chapter}>
                                            Chapters:{' '}
                                            {item.chapters?.length || 0}
                                        </Text>

                                        <Text
                                            numberOfLines={1}
                                            style={styles.time}
                                        >
                                            {formatCourseDate(item.createdOn)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        style={styles.AB}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

function formatCourseDate(value: any) {
    const date =
        value && typeof value.toDate === 'function'
            ? value.toDate()
            : value
              ? new Date(value)
              : null;

    if (!date || Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
