import { Course, CourseProgressProps } from "@/types/course";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import CourseProgressCard from "../Shared/CourseProgressCard";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

export default function CourseProgress({
    courseList,
    enroll = false,
}: CourseProgressProps) {
    const { userDetail } = useContext(UserDetailContext);
    const { safePush } = useSafeNavigation()
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const displayedCourses = courseList.slice(0, 4);

    useFocusEffect(
        useCallback(() => {
            setLoadingId(null);
        }, [])
    );

    const handlePress = (item: Course) => {
        const id = item.id || item.courseTitle || "";
        setLoadingId(id);

        safePush({
            pathname: "/courseView",
            params: {
                courseParams: JSON.stringify(item),
                enroll: enroll.toString(),
            },
        });
    };

    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10
                }}
            >
                <Text
                    style={{
                        fontFamily: "outfit-bold",
                        fontSize: 25,
                        color: Colors.PRIMARY,

                    }}
                >
                    My Progress
                </Text>
                <TouchableOpacity
                    onPress={() => safePush("/(tabs)/progress")}
                >
                    <Text
                        style={{
                            fontFamily: "outfit",
                            fontSize: 14,
                            color: Colors.PRIMARY,
                            textDecorationLine: "underline",
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
