import { db } from '@/config/firebaseConfig';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import {
    doc,
    FirebaseFirestoreTypes,
    getDoc
} from '@react-native-firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import {
    Image,
    StyleProp,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { imageAssets } from '../../constant/Option';
import { UserDetailContext } from '../../context/UserDetailContext';
import { styles } from '../../styles/CourseCard.styles';
import AppModal from './AppModal';

export default function CourseCard({
    course,
    enroll,
}: {
    course: Course;
    enroll?: boolean;
    style?: StyleProp<ViewStyle>;
}) {
    const { safePush } = useSafeNavigation();
    const { userDetail } = useContext(UserDetailContext);
    const [creatorInfo, setCreatorInfo] =
        useState<null | FirebaseFirestoreTypes.DocumentData>(null);
    const [modal, setModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    useEffect(() => {
        const fetchCreator = async () => {
            if (!course?.createdBy) return;

            const userDocRef = doc(db, 'users', course.createdBy);
            const userDocSnap = await getDoc(userDocRef);

            const data = userDocSnap.data();
            if (userDocSnap.exists() && data !== undefined) {
                setCreatorInfo(data);
            }
        };

        fetchCreator();
    }, [course]);

    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    if (course?.createdBy === userDetail?.email) {
                        setModal({
                            visible: true,
                            title: 'Course Owner',
                            message:
                                "You're the owner of this course. We'll take you to your courses screen.",
                        });

                        return;
                    } else {
                        safePush({
                            pathname: '/courseView',
                            params: {
                                courseParams: JSON.stringify(course),
                                enroll: enroll?.toString(),
                            },
                        });
                    }
                }}
                style={styles.buttonContainer}
            >
                {course.banner_image && (
                    <>
                        <Image
                            source={imageAssets[course?.banner_image]}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.creatorProfilePicWrapper}
                            onPress={() => {
                                safePush({
                                    pathname: '/profileView',
                                    params: {
                                        userId: course.createdBy,
                                    },
                                });
                            }}
                        >
                            <Image
                                source={
                                    creatorInfo?.profilePicture
                                        ? {
                                              uri: creatorInfo.profilePicture,
                                          }
                                        : require('../../assets/images/logo.png')
                                }
                                style={styles.creatorProfilePic}
                            />
                        </TouchableOpacity>
                    </>
                )}
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        minHeight: scale(75),
                    }}
                >
                    <Text numberOfLines={3} style={styles.courseTitle}>
                        {course.courseTitle}
                    </Text>

                    <View style={styles.chapterContainer}>
                        <Text style={styles.chapter}>
                            Chapters: {course.chapters?.length || 0}
                        </Text>
                        {course?.createdBy === userDetail?.email && (
                            <Text style={styles.ownerLabel}>Owner</Text>
                        )}

                        {course?.createdBy !== userDetail?.email && (
                            <Text numberOfLines={1} style={styles.time}>
                                {course?.createdOn?.toDate
                                    ? course.createdOn
                                          .toDate()
                                          .toLocaleDateString('en-GB', {
                                              day: '2-digit',
                                              month: '2-digit',
                                              year: 'numeric',
                                          })
                                    : ''}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            <AppModal
                visible={modal.visible}
                title={modal.title}
                message={modal.message}
                onConfirm={() => {
                    setModal({ ...modal, visible: false });
                    safePush('/myCourses');
                }}
                onCancel={() => setModal({ ...modal, visible: false })}
            />
        </>
    );
}
