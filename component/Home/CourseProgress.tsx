import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course, CourseProgressProps } from '@/types/course';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';
import CourseProgressCard from '../Shared/CourseProgressCard';

type ItemType = Course | { isViewAll: true };

export default function CourseProgress({
    courseList,
    enroll = false,
}: CourseProgressProps) {
    const { safePush } = useSafeNavigation();

    const [loadingId, setLoadingId] = useState<string | null>(null);
    const progressItems = useMemo<ItemType[]>(
        () => [...courseList.slice(0, 4), { isViewAll: true }],
        [courseList],
    );

    useFocusEffect(
        useCallback(() => {
            setLoadingId(null);
        }, []),
    );

    const handlePress = useCallback(
        (item: Course) => {
            const id = item.id || item.courseTitle || '';
            setLoadingId(id);

            safePush({
                pathname: '/courseView',
                params: {
                    courseParams: JSON.stringify(item),
                    enroll: enroll.toString(),
                },
            });
        },
        [enroll, safePush],
    );

    const renderProgressItem = useCallback(
        ({ item }: { item: ItemType }) =>
            'isViewAll' in item ? (
                <TouchableOpacity
                    onPress={() => safePush('/(tabs)/progress')}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: moderateScale(10),
                        backgroundColor: Colors.BG,
                        borderRadius: moderateScale(30),
                        height: verticalScale(40),
                        marginTop: verticalScale(25),
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: RFValue(12),
                            color: Colors.PRIMARY,
                        }}
                    >
                        View All
                    </Text>
                </TouchableOpacity>
            ) : (
                <CourseProgressCard
                    item={item}
                    onPress={() => handlePress(item)}
                    disabled={Boolean(loadingId)}
                    loading={loadingId === (item.id || item.courseTitle)}
                />
            ),
        [handlePress, loadingId, safePush],
    );

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: moderateScale(8),
                }}
            >
                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        fontSize: RFValue(18),
                        color: Colors.PRIMARY,
                    }}
                >
                    Progress
                </Text>
            </View>
            <FlatList<ItemType>
                data={progressItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={3}
                removeClippedSubviews
                keyExtractor={(item, index) =>
                    'isViewAll' in item
                        ? 'view-all'
                        : item.docId || item.id || index.toString()
                }
                renderItem={renderProgressItem}
            />
        </View>
    );
}
