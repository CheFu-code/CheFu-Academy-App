import { db } from '@/config/firebaseConfig';
import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from '@react-native-firebase/firestore';
import { useContext, useState } from 'react';
import {
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';
import { UserDetailContext } from '../../context/UserDetailContext';
import Button from '../Shared/Button';

interface IntroProps {
    course: Course;
    enroll: string;
}

export default function Intro({ course, enroll }: IntroProps) {
    const { userDetail } = useContext(UserDetailContext);
    const { safeReplace } = useSafeNavigation();
    const { textColor } = useDarkMode();
    const [loading, setLoading] = useState(false);
    const [showFull, setShowFull] = useState(false);
    const maxLines = showFull ? undefined : 4;

    const isCourseCompleted =
        Array.isArray(course?.completedChapter) &&
        course?.completedChapter.length === course?.chapters?.length;

    const onEnrollCourse = async () => {
        if (isCourseCompleted && userDetail?.member === false) {
            ToastAndroid.show(
                'You completed this course. Subscribe to revisit it.',
                ToastAndroid.SHORT,
            );
            return; // Early return to prevent further execution
        }

        try {
            setLoading(true);
            const emailSafe = userDetail?.email.replace(/[@.]/g, '_');
            const docId = emailSafe + '_' + Date.now().toString();
            const data = {
                ...course,
                createdBy: userDetail?.email,
                createdOn: new Date(),
                enrolled: true,
            };

            await setDoc(doc(db, 'course', docId), data);

            safeReplace({
                pathname: '/courseView',
                params: {
                    courseParams: JSON.stringify(data),
                    enroll: enroll.toString(),
                },
            });
        } catch (error) {
            console.error('Failed to enroll course:', error);
            ToastAndroid.show(
                'Failed to enroll. Please try again.',
                ToastAndroid.SHORT,
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <View>
            <View
                style={{
                    padding: moderateScale(15),
                }}
            >
                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        fontSize: RFValue(18),
                        color: Colors.PRIMARY,
                    }}
                >
                    {course?.courseTitle}
                </Text>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: moderateScale(5),
                        alignItems: 'center',
                        marginTop: verticalScale(5),
                    }}
                >
                    <Ionicons
                        name="book-outline"
                        size={moderateScale(18)}
                        color={textColor}
                    />
                    <Text
                        style={{
                            fontFamily: 'outfit',
                            fontSize: RFValue(16),
                            color: textColor,
                        }}
                    >
                        {course?.chapters?.length} Chapters
                    </Text>
                </View>

                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        fontSize: RFValue(18),
                        marginTop: verticalScale(10),
                        color: textColor,
                    }}
                >
                    Description:
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                        numberOfLines={maxLines}
                        style={{
                            fontFamily: 'outfit',
                            fontSize: RFValue(14),
                            color: Colors.GRAY,
                        }}
                    >
                        {course?.description}
                    </Text>

                    {course?.description?.length > 200 && (
                        <TouchableOpacity
                            onPress={() => setShowFull(!showFull)}
                        >
                            <Text
                                style={{
                                    color: showFull
                                        ? Colors.YELLOW
                                        : Colors.GREEN,
                                    marginTop: verticalScale(5),
                                }}
                            >
                                {showFull ? 'Read less ▲' : 'Read more ▼'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                {enroll === 'true' &&
                course?.createdBy !== userDetail?.email ? (
                    <Button
                        text={'Enroll Now'}
                        loading={loading}
                        onPress={onEnrollCourse}
                        disabled={loading || isCourseCompleted}
                        icon={
                            <Ionicons
                                name="download-outline"
                                size={moderateScale(18)}
                                color={textColor}
                            />
                        }
                    />
                ) : isCourseCompleted ? (
                    <Button
                        text="Completed"
                        disabled={true}
                        loading={false}
                        onPress={() => {}}
                        icon={
                            <Ionicons
                                name="checkmark-circle"
                                size={moderateScale(18)}
                                color="green"
                            />
                        }
                    />
                ) : null}
            </View>
        </View>
    );
}
