import { auth, db } from '@/config/fireConfig';
import { styles } from '@/styles/CourseProgressCard.styles';
import { Course } from '@/types/course';
import { CourseProgressCardProps } from '@/types/courseProgressCard';
import { sendNotification } from '@/utils/notifications';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    doc,
    FirebaseFirestoreTypes,
    getDoc,
} from '@react-native-firebase/firestore';
import * as Notifications from 'expo-notifications';
import { useContext, useEffect, useState } from 'react';
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
    const [userData, setUserData] =
        useState<FirebaseFirestoreTypes.DocumentData | null>(null);

    async function fetchUserFromFirestore() {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            console.log('No authenticated user.');
            return;
        }

        const userDocRef = doc(db, 'users', userDetail?.email); // using email as doc ID
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data(); // data: DocumentData | undefined
            if (data) {
                setUserData(data);
            } else {
                setUserData(null); // fallback, just in case
            }
        } else {
            console.log('No user document found in Firestore.');
            setUserData(null);
        }
    }

    useEffect(() => {
        fetchUserFromFirestore();
    }, []);

    const GetCompletedChapters = (course: Course) => {
        const total = course?.chapters?.length ?? 0;

        const completed = course?.completedChapter?.length ?? 0;
        if (total === 0) return 0;
        const percentage = completed / total;
        return Math.min(percentage, 1); // ensure it's not > 1
    };

    const notificationSentKey = `notificationSent-${item?.courseTitle}`;

    useEffect(() => {
        async function checkAndSendNotification() {
            if (!item) {
                return;
            }

            if (item.completedChapter?.length === item.chapters?.length) {
                // Check if notification was already sent for this course
                const sent = await AsyncStorage.getItem(notificationSentKey);

                if (sent === 'true') {
                    return; // already sent, do nothing
                }

                const { status } = await Notifications.getPermissionsAsync();

                if (status !== 'granted') {
                    const { status: newStatus } =
                        await Notifications.requestPermissionsAsync();
                    if (newStatus !== 'granted') {
                        console.log(
                            'Notification permission not granted, aborting notification.',
                        );
                        return;
                    }
                }

                const userEmail = userDetail?.email;
                if (userEmail) {
                    await sendNotification(
                        userEmail,
                        'Course Completed! 🎉',
                        `You completed all chapters in "${item.courseTitle}"`,
                    );
                }

                await AsyncStorage.setItem(notificationSentKey, 'true');
            } else {
            }
        }

        checkAndSendNotification();
    }, [
        item?.completedChapter?.length,
        item?.chapters?.length,
        item?.courseTitle,
        userDetail?.email,
        notificationSentKey,
        item,
    ]);

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
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text
                        style={styles.courseTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.courseTitle}
                    </Text>

                    <View style={styles.commonStyles}>
                        <Text style={styles.chapter}>
                            {item?.chapters?.length} Chapters
                        </Text>

                        {item?.completedChapter?.length ===
                            item.chapters?.length && (
                            <Ionicons
                                color={'green'}
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
                    progress={GetCompletedChapters(item)}
                    width={width - moderateScale(24)}
                />

                <View style={styles.commonStyles}>
                    {item?.completedChapter?.length ===
                        item.chapters?.length && (
                        <FontAwesome
                            size={scale(15)}
                            color={'green'}
                            name="flag-checkered"
                        />
                    )}

                    <Text
                        style={{
                            marginTop: verticalScale(2),
                            fontFamily: 'outfit',
                        }}
                    >
                        {item?.completedChapter?.length ===
                        item?.chapters?.length ? (
                            <Text
                                style={{
                                    color: 'green',
                                    fontFamily: 'outfit-bold',
                                }}
                            >
                                All chapters completed
                            </Text>
                        ) : (
                            `${item?.completedChapter?.length ?? 0} of ${
                                item.chapters?.length
                            } chapters completed`
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
