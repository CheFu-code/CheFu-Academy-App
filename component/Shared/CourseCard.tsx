import { Course } from "@/types/course";
import {
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getFirestore,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    Image,
    StyleProp,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { imageAssets } from "../../constant/Option";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/CourseCard.styles";
import AppModal from "./AppModal";

export default function CourseCard({
    course,
    enroll,
}: {
    course: Course;
    enroll?: boolean;
    style?: StyleProp<ViewStyle>;
}) {
    const { userDetail } = useContext(UserDetailContext);
    const [creatorInfo, setCreatorInfo] =
        useState<null | FirebaseFirestoreTypes.DocumentData>(null);
    const firestore = getFirestore();
    const [modal, setModal] = useState({
        visible: false,
        title: "",
        message: "",
    });

    useEffect(() => {
        const fetchCreator = async () => {
            if (!course?.createdBy) return;

            const userDocRef = doc(firestore, "users", course.createdBy);
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
                            title: "Course Owner",
                            message:
                                "You are the owner of this course, can we take you to the course progress page?",
                        });
                        return;
                    } else {
                        router.push({
                            pathname: "/courseView",
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
                                router.push({
                                    pathname: "/profileView",
                                    params: {
                                        userId: course.createdBy,
                                    },
                                });
                            }}
                        >
                            <Image
                                source={
                                    creatorInfo?.profilePicture
                                        ? { uri: creatorInfo.profilePicture }
                                        : require("../../assets/images/logo.png")
                                }
                                style={styles.creatorProfilePic}
                            />
                        </TouchableOpacity>
                    </>
                )}
                <View
                    style={{
                        flex: 1,
                        justifyContent: "space-between",
                        minHeight: 80,
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
                            <Text>Owner</Text>
                        )}

                        {course?.createdBy !== userDetail?.email && (
                            <Text numberOfLines={1} style={styles.time}>
                                {course?.createdOn?.toDate
                                    ? course.createdOn
                                          .toDate()
                                          .toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                          })
                                    : ""}
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
                    router.push("/myCourses");
                }}
                onCancel={() => setModal({ ...modal, visible: false })}
            />
        </>
    );
}
