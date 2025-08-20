import { Course } from "@/types/course";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";

interface FeaturedCourseCardProps {
    course: Course;
    onPress: () => void;
}

export default function FeaturedCourseCard({
    course,
    onPress,
}: FeaturedCourseCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image
                source={
                    imageAssets[course?.banner_image as keyof typeof imageAssets]
                }
                style={styles.banner}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {course.courseTitle}
                </Text>
                <Text style={styles.category}>{course.category}</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Ionicons
                            name="book-outline"
                            size={16}
                            color={Colors.GRAY}
                        />
                        <Text style={styles.detailText}>
                            {course.chapters?.length} Chapters
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons
                            name="person-outline"
                            size={16}
                            color={Colors.GRAY}
                        />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {course.createdBy?.split("@")[0]}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 250,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        overflow: "hidden",
    },
    banner: {
        width: "100%",
        height: 100,
    },
    infoContainer: {
        padding: 10,
    },
    title: {
        fontFamily: "outfit-bold",
        fontSize: 16,
        color: Colors.BLACK,
        marginBottom: 5,
    },
    category: {
        fontFamily: "outfit",
        fontSize: 12,
        color: Colors.PRIMARY,
        backgroundColor: "rgba(26, 115, 232, 0.1)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
        overflow: "hidden",
        marginBottom: 5,
    },
    detailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 10,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        flex: 1,
    },
    detailText: {
        fontFamily: "outfit",
        fontSize: 13,
        color: Colors.GRAY,
    },
});