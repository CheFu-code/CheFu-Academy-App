import {
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getFirestore,
} from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { imageAssets } from "../../constant/Option";
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
    const [creatorInfo, setCreatorInfo] =
        useState<null | FirebaseFirestoreTypes.DocumentData>(null);
    const firestore = getFirestore();

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
                    <>
                        <Image
                            source={imageAssets[course?.banner_image]}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                        <Image
                            source={
                                creatorInfo?.profilePicture
                                    ? { uri: creatorInfo.profilePicture }
                                    : require("../../assets/images/logo.png")
                            }
                            style={styles.creatorProfilePic}
                        />
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
                        {course?.createdBy === userDetail.email && (
                            <Text>Owner</Text>
                        )}

                        {course?.createdBy !== userDetail.email && (
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
        </>
    );
}
