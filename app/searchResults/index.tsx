import CourseCard from "@/component/Shared/CourseCard";
import { Colors } from "@/constant/Colors";
import { AntDesign } from "@expo/vector-icons";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";


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

export default function SearchScreen() {
    const { query } = useLocalSearchParams();
    const [results, setResults] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const category = results[0]?.category;

    const fetchCourses = async () => {
        try {
            const term = Array.isArray(query) ? query[0] : query || "";

            const snapshot = await firestore().collection("course").get();

            const filtered = snapshot.docs
                .map((doc) => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        courseTitle: data.courseTitle || data.title || "",
                        category: data.category,
                        banner_image: data.banner_image,
                        chapters: data.chapters,
                        flashcards: data.flashcards,
                        qa: data.qa,
                        quiz: data.quiz,
                        description: data.description,
                        price: data.price,
                        createdBy: data.createdBy,
                        createdOn: data.createdOn
                    };
                })

                .filter(
                    (course) =>
                        course.courseTitle?.toLowerCase().includes(term.toLowerCase()) ||
                        course.category?.toLowerCase().includes(term.toLowerCase())
                );

            setResults(filtered);
        } catch (e) {
            console.error("Search error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [query]);

    if (loading)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.BG_COLOR,
                }}
            >
                <LottieView
                    autoPlay
                    loop
                    source={require("../../assets/animations/Loading.json")}
                    style={{
                        width: 150,
                        height: 150,
                    }}
                />
                <Text
                    style={{
                        marginTop: 10,
                        fontFamily: "outfit-bold",
                        fontSize: 16,
                        color: Colors.PRIMARY,
                    }}
                >
                    Finding courses you'll love...
                </Text>
            </View>
        );

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View
                style={{
                    paddingTop: 20,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.PRIMARY,
                        paddingBottom: 20,
                    }}
                >
                    <AntDesign color={"white"} size={20} name="left" />
                    <Text
                        style={{
                            color: Colors.WHITE,
                            fontSize: 20,
                            fontFamily: "outfit",
                        }}
                    >
                        Results for
                        <Text style={{ fontFamily: "outfit-bold", color: Colors.PRIMARY }}>
                            {" "}
                            "{query}"
                        </Text>
                    </Text>
                </TouchableOpacity>

                {results.length === 0 ? (
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text
                            style={{
                                color: Colors.GRAY,
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 100,
                                fontFamily: "outfit-bold",
                                fontSize: 16,
                                textAlign: "center",
                            }}
                        >
                            No courses were found.
                        </Text>
                        <Text
                            style={{
                                color: Colors.GRAY,

                                fontFamily: "outfit",
                                fontSize: 14,
                                marginTop: 30,
                            }}
                        >
                            We couldn't find any courses for your query. Try browsing by
                            category — for example: Coding, Science, Engineering, Cooking,
                            etc.
                        </Text>
                    </View>
                ) : (
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: 20,
                            }}
                        >
                            {category && (
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={"tail"}
                                    style={{
                                        fontSize: 18,
                                        color: Colors.WHITE,
                                        fontFamily: "outfit-bold",
                                        textTransform: "capitalize",

                                        maxWidth: 250,
                                    }}
                                >
                                    Category: {category}
                                </Text>
                            )}

                            {results.length > 0 && (
                                <View
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "outfit",
                                            color: "white",
                                        }}
                                    >
                                        found:{" "}
                                        <Text
                                            style={{
                                                fontFamily: "outfit-bold",
                                                color: Colors.PRIMARY,
                                            }}
                                        >
                                            {results.length}
                                        </Text>
                                    </Text>
                                </View>
                            )}
                        </View>

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={results}
                            numColumns={2}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <CourseCard
                                    course={item}
                                    enroll={true}
                                />
                            )}
                            columnWrapperStyle={{
                                justifyContent: "space-between",
                                paddingHorizontal: 10,
                            }}
                            contentContainerStyle={{
                                paddingBottom: 160,
                                paddingTop: 10,
                            }}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}
