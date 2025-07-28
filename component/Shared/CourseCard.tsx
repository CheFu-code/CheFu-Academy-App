import { Colors } from "@/constant/Colors";
import React from "react";
import { Image, Pressable, Text } from "react-native";
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
    title: string;
    category?: string;
    banner_image?: string;
    chapters?: Chapter[];
    flashcards?: any[];
    qa?: any[];
    quiz?: any[];
    description?: string;
    price?: number;
};

export default function CourseCard({ course }: { course: Course }) {
    return (
        <>
            <Pressable
                style={{
                    backgroundColor: Colors.BG_GRAY,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 15,
                    marginTop: 10,
                    width: "48%", // Allow space for two cards with spacing
                }}
            >
                {course.banner_image && (
                    <Image
                        source={imageAssets[course?.banner_image]}
                        style={{ width: "100%", height: 100, borderRadius: 10 }}
                        resizeMode="cover"
                    />
                )}

                <Text
                    numberOfLines={3}
                    style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginTop: 8,
                        color: Colors.PRIMARY,
                    }}
                >
                    {course.title}
                </Text>

                <Text
                    style={{ fontSize: 14, color: Colors.BLACK, fontFamily: "outfit" }}
                >
                    Chapters: {course.chapters?.length || 0}
                </Text>
            </Pressable>
        </>
    );
}
