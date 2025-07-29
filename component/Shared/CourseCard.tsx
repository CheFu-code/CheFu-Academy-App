import { Colors } from "@/constant/Colors";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { imageAssets } from "../../constant/imageAssets";

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
};

export default function CourseCard({ course, enroll }: { course: Course; enroll?: boolean }) {
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
                style={{
                    backgroundColor: Colors.BG_GRAY,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 15,
                    marginTop: 10,
                    width: "48%",
                }}
            >
                {course.banner_image && (
                    <Image
                        source={imageAssets[course?.banner_image]}
                        style={{ width: "100%", height: 100, borderRadius: 10 }}
                        resizeMode="cover"
                    />
                )}
                <View style={{ flex: 1, justifyContent: "space-between", minHeight: 80 }}>
                    <Text
                        numberOfLines={3}
                        style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            marginTop: 8,
                            color: Colors.PRIMARY,
                        }}
                    >
                        {course.courseTitle}
                    </Text>

                    <Text
                        style={{ fontSize: 14, color: Colors.BLACK, fontFamily: "outfit", }}
                    >
                        Chapters: {course.chapters?.length || 0}
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    );
}
