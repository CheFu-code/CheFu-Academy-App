import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { imageAssets } from "../../constant/imageAssets";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/CourseCard.styles";

type Chapter = {
    topic: string;
    content: string;
    example?: string;
    explain?: string;
    code?: string;
};

type Course = {
    id: string;
    courseTitle: string;
    category?: string;
    banner_image?: string;
    chapters?: Chapter[];
    flashcards?: any[];
    qa?: any[];
    quiz?: any[];
    description?: string;
    price?: number;
    createdBy: string;
    createdOn: FirebaseFirestoreTypes.Timestamp;
};

export default function CourseCard({
    course,
    enroll,
}: {
    course: Course;
    enroll?: boolean;
}) {
    const { userDetail } = useContext(UserDetailContext);
    return (
        <>
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: "/courseView",
                        params: {
                            courseParams: JSON.stringify(course),
                            enroll: enroll?.toString(),
                        },
                    });
                }}
                style={styles.buttonContainer}
            >
                {course.banner_image && (
                    <Image
                        source={imageAssets[course?.banner_image]}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
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
                        {course?.createdBy === userDetail.email && (
                            <Text>Owner</Text>
                        )}

                        {course?.createdBy !== userDetail.email && (
                            <Text numberOfLines={1} style={styles.time}>
                                {course?.createdOn?.toDate
                                    ? course.createdOn
                                          .toDate()
                                          .toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                    : ""}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
}
