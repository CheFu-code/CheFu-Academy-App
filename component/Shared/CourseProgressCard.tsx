import { styles } from '@/styles/CourseProgressCard.styles';
import { CourseProgressCardProps } from '@/types/courseProgressCard';
import { sendNotification } from '@/utils/notifications';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useContext, useEffect, useMemo } from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';
import { imageAssets } from '../../constant/Option';
import { UserDetailContext } from '../../context/UserDetailContext';

export default function CourseProgressCard({
    item,
    width = 230,
    loading = false,
    disabled = false,
    onPress,
}: CourseProgressCardProps) {
    const { userDetail } = useContext(UserDetailContext);
    const progressWidth =
        typeof width === 'number' ? width - moderateScale(24) : 206;
    const courseTitle = item?.courseTitle ?? '';
    const notificationSentKey = `notificationSent-${courseTitle}`;
    const completedCount = item?.completedChapter?.length ?? 0;
    const chapterCount = item?.chapters?.length ?? 0;
    const isComplete = chapterCount > 0 && completedCount === chapterCount;
    const progress = useMemo(() => {
        if (chapterCount === 0) return 0;
        return Math.min(completedCount / chapterCount, 1);
    }, [chapterCount, completedCount]);

    useEffect(() => {
        async function checkAndSendNotification() {
            if (!courseTitle || !isComplete) return;

            const sent = await AsyncStorage.getItem(notificationSentKey);
            if (sent === 'true') return;

            try {
                const { status } = await Notifications.getPermissionsAsync();
                if (status !== 'granted') {
                    const { status: newStatus } =
                        await Notifications.requestPermissionsAsync();
                    if (newStatus !== 'granted') return;
                }

                const userEmail = userDetail?.email;
                if (userEmail) {
                    await sendNotification(
                        userEmail,
                        'Course Completed!',
                        `You completed all chapters in "${courseTitle}"`,
                    );
                }
            } catch (error) {
                console.error('Failed to send completion notification:', error);
            } finally {
                await AsyncStorage.setItem(notificationSentKey, 'true');
            }
        }

        void checkAndSendNotification();
    }, [courseTitle, isComplete, notificationSentKey, userDetail?.email]);

    if (!item) return null;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || loading}
            style={{
                margin: moderateScale(3),
                padding: moderateScale(2),
                backgroundColor: Colors.BG_GRAY,
                borderRadius: moderateScale(12),
                width: width as number | undefined,
                opacity: disabled || loading ? 0.5 : 1,
                position: 'relative',
            }}
        >
            <View style={styles.commonStyles}>
                <Image
                    style={styles.bannerImage}
                    source={
                        imageAssets[
                            item?.banner_image as keyof typeof imageAssets
                        ]
                    }
                />
                <View style={{ flex: 1 }}>
                    <Text
                        style={styles.courseTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {courseTitle}
                    </Text>

                    <View style={styles.commonStyles}>
                        <Text style={styles.chapter}>
                            {chapterCount} Chapters
                        </Text>

                        {isComplete && (
                            <Ionicons
                                color="green"
                                size={scale(15)}
                                name="checkmark"
                            />
                        )}
                    </View>
                </View>
            </View>

            <View
                style={{
                    marginTop: verticalScale(10),
                    paddingHorizontal: moderateScale(5),
                    paddingBottom: verticalScale(4),
                }}
            >
                <Progress.Bar
                    color={Colors.GREEN}
                    progress={progress}
                    width={progressWidth}
                />

                <View style={styles.commonStyles}>
                    {isComplete && (
                        <FontAwesome
                            size={scale(15)}
                            color="green"
                            name="flag-checkered"
                        />
                    )}

                    <Text
                        style={{
                            marginTop: verticalScale(2),
                            fontFamily: 'outfit',
                        }}
                    >
                        {isComplete ? (
                            <Text
                                style={{
                                    color: 'green',
                                    fontFamily: 'outfit-bold',
                                }}
                            >
                                All chapters completed
                            </Text>
                        ) : (
                            `${completedCount} of ${chapterCount} chapters completed`
                        )}
                    </Text>
                </View>
            </View>

            {loading && (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size="large" color={Colors.GREEN} />
                </View>
            )}
        </TouchableOpacity>
    );
}
