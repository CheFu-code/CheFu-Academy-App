import { Course } from "@/types/course";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";

interface CourseListProps {
    courseList: Course[];
    heading?: string;
    enroll?: boolean;
}

export default function CourseList({
    courseList,
    heading = "Your Courses",
    enroll = false,
}: CourseListProps) {
    const router = useRouter();
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

        setTimeout(() => {
            router.push({
                pathname: "/courseView",
                params: {
                    courseParams: JSON.stringify(item),
                    enroll: enroll.toString(),
                },
            });
        }, 10); // 10ms delay to show loading state
    };

    return (
        <View
            style={{
                pointerEvents: loadingId ? "none" : "auto",
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text style={styles.heading}>{heading}</Text>
                <TouchableOpacity onPress={() => router.push("/myCourses")}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={displayedCourses}
                keyExtractor={(item, index) =>
                    item.id?.toString() || item.courseTitle || index.toString()
                }
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={({ item }: { item: Course }) => {
                    const isLoading =
                        loadingId === (item.id || item.courseTitle || "");
                    return (
                        <TouchableOpacity
                            style={styles.courseContainer}
                            onPress={() => handlePress(item)}
                            disabled={Boolean(loadingId)}
                        >
                            <Image
                                style={{
                                    width: 200,
                                    height: 110,
                                    borderRadius: 15,
                                    opacity: loadingId ? 0.5 : 1,
                                }}
                                source={
                                    imageAssets[
                                        item?.banner_image as keyof typeof imageAssets
                                    ]
                                }
                            />
                            <Text
                                style={{
                                    fontFamily: "outfit-bold",
                                    fontSize: 15,
                                    marginTop: 10,
                                    maxWidth: 200,
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {item?.courseTitle}
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
                                    size={20}
                                    color={Colors.PRIMARY}
                                />
                                <Text
                                    style={{
                                        fontFamily: "outfit",
                                        textDecorationLine: "underline",
                                    }}
                                >
                                    {item?.chapters?.length} Chapters
                                </Text>
                            </View>
                            {isLoading && (
                                <View
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor:
                                            "rgba(255,255,255,0.5)",
                                        borderRadius: 15,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ActivityIndicator
                                        style={{ alignItems: "center" }}
                                        size="large"
                                        color={Colors.PRIMARY}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    courseContainer: {
        padding: 8,
        backgroundColor: Colors.GREEN,
        margin: 6,
        borderRadius: 15,
    },
    heading: {
        fontFamily: "outfit-bold",
        fontSize: 25,
        color: Colors.PRIMARY,
    },
    viewAll: {
        fontFamily: "outfit",
        fontSize: 14,
        color: Colors.PRIMARY,
        textDecorationLine: "underline",
    },
});
