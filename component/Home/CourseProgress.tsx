import { Course, CourseProgressProps } from "@/types/course";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import CourseProgressCard from "../Shared/CourseProgressCard";

export default function CourseProgress({
    courseList,
    enroll = false,
}: CourseProgressProps) {
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const displayedCourses = courseList.slice(0, 4);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setLoadingId(null);
        }, [])
    );

    const handlePress = (item: Course) => {
        const id = item.id || item.courseTitle || "";
        setLoadingId(id);

        // Add a small delay so loading state can show before navigation
        setTimeout(() => {
            router.push({
                pathname: "/courseView",
                params: {
                    courseParams: JSON.stringify(item),
                    enroll: enroll.toString(),
                },
            });
        }, 100);
    };

    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontFamily: "outfit-bold",
                        fontSize: 25,
                        color: Colors.PRIMARY,
                    }}
                >
                    Your Progress
                </Text>
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/progress")}
                >
                    <Text
                        style={{
                            fontFamily: "outfit",
                            color: "white",
                            fontSize: 15,
                        }}
                    >
                        View All
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={displayedCourses}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) =>
                    item.docId ||
                    item.id?.toString() ||
                    `${item.courseTitle}-${index}`
                }
                renderItem={({ item }) => (
                    <CourseProgressCard
                        item={item}
                        onPress={() => handlePress(item)}
                        disabled={Boolean(loadingId)}
                        loading={
                            loadingId === (item.id || item.courseTitle || "")
                        }
                    />
                )}
            />
        </View>
    );
}
