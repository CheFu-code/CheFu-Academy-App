import { Ionicons } from "@expo/vector-icons";
import { doc, getFirestore, setDoc } from "@react-native-firebase/firestore"; // use RN Firebase consistently
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import Button from "../Shared/Button";

export default function Intro({ course, enroll }) {
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [showFull, setShowFull] = useState(false);
    const maxLines = showFull ? undefined : 4;
    const db = getFirestore();
    const router = useRouter();

    // Moved this here for clarity; no need to access course before definition
    const isCourseCompleted =
        Array.isArray(course?.completedChapter) &&
        course?.completedChapter.length === course?.chapters?.length;

    const onEnrollCourse = async () => {
        // Check course completion and subscription status first
        if (isCourseCompleted && userDetail?.member === false) {
            ToastAndroid.show(
                "You completed this course. Subscribe to revisit it.",
                ToastAndroid.SHORT
            );
            return; // Early return to prevent further execution
        }

        try {
            setLoading(true);
            const docId = Date.now().toString();
            const data = {
                ...course,
                createdBy: userDetail?.email,
                createdOn: new Date(),
                enrolled: true,
            };

            await setDoc(doc(db, "course", docId), data);

            router.replace({
                pathname: "/courseView/",
                params: {
                    courseParams: JSON.stringify(data),
                    enroll: false,
                },
            });
        } catch (error) {
            console.error("Failed to enroll course:", error);
            ToastAndroid.show(
                "Failed to enroll. Please try again.",
                ToastAndroid.SHORT
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <View>
            <View
                style={{
                    padding: 20,
                }}
            >
                <Text
                    style={{
                        fontFamily: "outfit-bold",
                        fontSize: 20,
                        color: Colors.PRIMARY,
                    }}
                >
                    {course?.courseTitle}
                </Text>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center",
                        marginTop: 5,
                    }}
                >
                    <Ionicons
                        name="book-outline"
                        size={18}
                        color={Colors.PRIMARY}
                    />
                    <Text
                        style={{
                            fontFamily: "outfit",
                            textDecorationLine: "underline",
                            fontSize: 18,
                            color: Colors.WHITE,
                        }}
                    >
                        {course?.chapters?.length} Chapters
                    </Text>
                </View>

                <Text
                    style={{
                        fontFamily: "outfit-bold",
                        fontSize: 20,
                        marginTop: 10,
                        color: Colors.WHITE,
                    }}
                >
                    Description:
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                        numberOfLines={maxLines}
                        style={{
                            fontFamily: "outfit",
                            fontSize: 16,
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
                                    marginTop: 5,
                                }}
                            >
                                {showFull ? "Read less ▲" : "Read more ▼"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                {enroll === "true" && course?.createdBy !== userDetail.email ? (
                    <Button
                        text={"Enroll Now"}
                        loading={loading}
                        onPress={onEnrollCourse}
                        disabled={loading || isCourseCompleted}
                        icon={
                            <Ionicons
                                name="download-outline"
                                size={18}
                                color="white"
                            />
                        }
                    />
                ) : isCourseCompleted ? (
                    <Button
                        text="Completed"
                        disabled={true}
                        icon={
                            <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color="green"
                            />
                        }
                    />
                ) : null}
            </View>
        </View>
    );
}
