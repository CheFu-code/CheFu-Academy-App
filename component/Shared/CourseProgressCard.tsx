import { Course } from "@/types/course";
import { sendNotification } from "@/utils/notifications";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import {
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getFirestore,
} from "@react-native-firebase/firestore";
import * as Notifications from "expo-notifications";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as Progress from "react-native-progress";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";
import { UserDetailContext } from "../../context/UserDetailContext";

interface CourseProgressCardProps {
    item: Course;
    width?: number | string; // Allow both number and string for width
    loading?: boolean;
    disabled?: boolean;
    onPress?: () => void;
}

export default function CourseProgressCard({
    item,
    width = 230,
    loading = false,
    disabled = false,
    onPress,
}: CourseProgressCardProps) {
    if (!item) return null;
    const auth = getAuth();
    const firestore = getFirestore();
    const { userDetail } = useContext(UserDetailContext);
    const [userData, setUserData] =
        useState<FirebaseFirestoreTypes.DocumentData | null>(null);

    async function fetchUserFromFirestore() {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            console.log("No authenticated user.");
            return;
        }

        const userDocRef = doc(firestore, "users", userDetail.email); // using email as doc ID
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data(); // data: DocumentData | undefined
            if (data) {
                setUserData(data);
            } else {
                setUserData(null); // fallback, just in case
            }
        } else {
            console.log("No user document found in Firestore.");
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
                console.log("No course item provided.");
                return;
            }

            if (item.completedChapter?.length === item.chapters?.length) {
                // Check if notification was already sent for this course
                const sent = await AsyncStorage.getItem(notificationSentKey);

                if (sent === "true") {
                    return; // already sent, do nothing
                }

                const { status } = await Notifications.getPermissionsAsync();

                if (status !== "granted") {
                    const { status: newStatus } =
                        await Notifications.requestPermissionsAsync();
                    if (newStatus !== "granted") {
                        console.log(
                            "Notification permission not granted, aborting notification."
                        );
                        return;
                    }
                }

                const userEmail = userDetail?.email;
                if (userEmail) {
                    await sendNotification(
                        userEmail,
                        "Course Completed! 🎉",
                        `You completed all chapters in "${item.courseTitle}"`
                    );
                }

                await AsyncStorage.setItem(notificationSentKey, "true");
            } else {
            }
        }

        checkAndSendNotification();
    }, [
        item?.completedChapter?.length,
        item?.chapters?.length,
        item?.courseTitle,
    ]);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || loading}
            style={{
                margin: 5,
                padding: 12,
                backgroundColor: Colors.BG_GRAY,
                borderRadius: 15,
                width: width as number | undefined,
                opacity: disabled || loading ? 0.5 : 1,
                position: "relative",
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
                                color={"green"}
                                size={16}
                                name="checkmark"
                            />
                        )}
                    </View>
                </View>
            </View>

            <View
                style={{
                    marginTop: 10,
                }}
            >
                <Progress.Bar
                    color={Colors.GREEN}
                    progress={GetCompletedChapters(item)}
                    width={width - 24}
                />

                <View style={styles.commonStyles}>
                    {item?.completedChapter?.length ===
                        item.chapters?.length && (
                        <FontAwesome color={"green"} name="flag-checkered" />
                    )}

                    <Text
                        style={{
                            marginTop: 2,
                            fontFamily: "outfit",
                        }}
                    >
                        {item?.completedChapter?.length ===
                        item?.chapters?.length ? (
                            <Text
                                style={{
                                    color: "green",
                                    fontFamily: "outfit-bold",
                                }}
                            >
                                All chapters completed!
                            </Text>
                        ) : (
                            `${item?.completedChapter?.length ?? 0} of ${
                                item.chapters?.length
                            } chapters completed!`
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

export const styles = StyleSheet.create({
    bannerImage: { height: 60, width: 60, borderRadius: 8 },
    courseTitle: {
        fontFamily: "outfit-bold",
        fontSize: 15,
        flexWrap: "wrap",
        maxWidth: "90%",
    },
    commonStyles: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    chapter: {
        fontFamily: "outfit",
        fontSize: 13,
    },
    activityIndicatorContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
});
