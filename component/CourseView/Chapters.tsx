import useDarkMode from '@/hooks/useDarkMode';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import {
    FlatList,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';
import { UserDetailContext } from '../../context/UserDetailContext';
import { styles } from '../../styles/CourseView.styles';

interface ChaptersProps {
    course: Course;
}

export default function Chapters({ course }: ChaptersProps) {
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const { color } = useDarkMode();
    const isChapterCompleted = (index: number) => {
        if (!Array.isArray(course?.completedChapter)) return false;
        const isCompleted = course.completedChapter.find(
            (item) => item === index.toString(),
        );
        return isCompleted ? true : false;
    };

    return (
        <View
            style={{
                padding: moderateScale(15),
            }}
        >
            <Text style={[styles.chapterTextContent, { color }]}>
                Chapters
            </Text>

            <FlatList
                style={{ marginBottom: moderateScale(40) }}
                data={course?.chapters || []}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    const completed = isChapterCompleted(index);
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                const isOwner =
                                    course?.createdBy === userDetail?.email;
                                const isEnrolled =
                                    course.enrolled === true && isOwner;

                                if (!isOwner && !isEnrolled) {
                                    ToastAndroid.show(
                                        'Please enroll in this course to access chapters.',
                                        ToastAndroid.LONG,
                                    );
                                    return;
                                }

                                if (completed && userDetail.member === false) {
                                    ToastAndroid.show(
                                        'You completed this chapter. Subscribe to revisit it.',
                                        ToastAndroid.SHORT,
                                    );
                                    return;
                                }

                                safePush({
                                    pathname: '/chapterView',
                                    params: {
                                        chapterParams: JSON.stringify(item),
                                        docId: course?.docId,
                                        chapterIndex: index,
                                    },
                                });
                            }}
                            key={index}
                            style={[
                                styles.buttonContainer,
                                {
                                    opacity:
                                        completed &&
                                        userDetail.member === false &&
                                        course?.createdBy === userDetail?.email
                                            ? 0.6
                                            : 1,

                                    borderColor: completed
                                        ? Colors.GREEN
                                        : '#ccc',
                                },
                            ]}
                        >
                            <View style={styles.chapterNameContainer}>
                                <Text
                                    style={[
                                        styles.chapterText,
                                        completed &&
                                        course?.createdBy === userDetail?.email
                                            ? { color: Colors.GREEN }
                                            : null,
                                        // ✨ dim completed items
                                    ]}
                                >
                                    {index + 1}.
                                </Text>
                                <Text
                                    style={[
                                        styles.chapterText,
                                        { maxWidth: scale(210) },
                                        completed &&
                                        course?.createdBy === userDetail?.email
                                            ? { color: Colors.GREEN }
                                            : null,
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item?.chapterName}
                                </Text>
                            </View>
                            {completed &&
                            course?.createdBy === userDetail?.email ? (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={scale(22)}
                                    color="green"
                                />
                            ) : (
                                <Ionicons
                                    name="play"
                                    color={Colors.PRIMARY}
                                    size={scale(22)}
                                />
                            )}
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}
