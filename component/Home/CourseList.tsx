import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../constant/Colors';
import { imageAssets } from '../../constant/Option';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface CourseListProps {
    courseList: Course[];
    heading?: string;
    enroll?: boolean;
}

export default function CourseList({
    courseList,
    heading = 'Courses',
    enroll = false,
}: CourseListProps) {
    const { safePush } = useSafeNavigation();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const displayedCourses = courseList.slice(0, 4);

    useFocusEffect(
        useCallback(() => {
            setLoadingId(null);
        }, []),
    );

    const handlePress = (item: Course) => {
        const id = item.id || item.courseTitle || '';
        setLoadingId(id);

        setTimeout(() => {
            safePush({
                pathname: '/courseView',
                params: {
                    courseParams: JSON.stringify(item),
                    enroll: enroll.toString(),
                },
            });
        }, 10); // 10ms delay to show loading state
    };

    return (
        <View
            style={{
                pointerEvents: loadingId ? 'none' : 'auto',
                marginHorizontal: -10,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: 10,
                }}
            >
                <Text style={styles.heading}>{heading}</Text>
                <TouchableOpacity onPress={() => safePush('/myCourses')}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={displayedCourses}
                keyExtractor={(item, index) =>
                    item.id?.toString() || item.courseTitle || index.toString()
                }
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={({ item }: { item: Course }) => {
                    const isLoading =
                        loadingId === (item.id || item.courseTitle || '');
                    return (
                        <TouchableOpacity
                            style={styles.courseContainer}
                            onPress={() => handlePress(item)}
                            disabled={Boolean(loadingId)}
                        >
                            <Image
                                style={{
                                    width: moderateScale(190),
                                    height: verticalScale(100),
                                    borderRadius: moderateScale(15),
                                    opacity: loadingId ? 0.5 : 1,
                                }}
                                source={
                                    imageAssets[
                                        item?.banner_image as keyof typeof imageAssets
                                    ]
                                }
                            />
                            <Text
                                style={{
                                    fontFamily: 'outfit-bold',
                                    fontSize: RFValue(12),
                                    marginTop: RFValue(5),
                                    maxWidth: 200,
                                    paddingHorizontal: 5,
                                }}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {item?.courseTitle}
                            </Text>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 5,
                                    alignItems: 'center',
                                    paddingHorizontal: 5,
                                    paddingBottom: 4,
                                }}
                            >
                                <Ionicons
                                    name="book-outline"
                                    size={RFValue(16)}
                                    color={Colors.PRIMARY}
                                />
                                <Text
                                    style={{
                                        fontFamily: 'outfit',
                                        fontSize: RFValue(11),
                                    }}
                                >
                                    {item?.chapters?.length} Chapters
                                </Text>
                            </View>
                            {isLoading && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor:
                                            'rgba(255,255,255,0.5)',
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ActivityIndicator
                                        style={{ alignItems: 'center' }}
                                        size="large"
                                        color={Colors.PRIMARY}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    courseContainer: {
        padding: 2,
        backgroundColor: Colors.GREEN,
        margin: 6,
        borderRadius: 15,
    },
    heading: {
        fontFamily: 'outfit-bold',
        fontSize: RFValue(18),
        color: Colors.PRIMARY,
    },
    viewAll: {
        fontFamily: 'outfit',
        fontSize: RFValue(12),
        color: Colors.PRIMARY,
        textDecorationLine: 'underline',
    },
});
