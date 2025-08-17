import { Colors } from "@/constant/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { styles } from "@/styles/CompletedCourse.styles";
import { Course } from "@/types/course";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    getFirestore,
    query,
    where,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CompletedChapters = () => {
    const router = useRouter();
    const { userDetail } = useContext(UserDetailContext);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompleted = async () => {
            if (!userDetail?.email) {
                router.replace("/auth/signIn");
                return;
            }
            
            try {
                const db = getFirestore();

                // ✅ Fetch only courses created by the current user
                const q = query(
                    collection(db, "course"),
                    where("createdBy", "==", userDetail?.email)
                );

                const snapshot = await getDocs(q);
                let completed: Course[] = [];

                snapshot.forEach(
                    (
                        docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot<Course>
                    ) => {
                        const data = docSnap.data() as Course;

                        if (
                            data.completedChapter &&
                            data.completedChapter.length > 0
                        ) {
                            completed.push({
                                ...data,
                                id: docSnap.id,
                            });
                        }
                    }
                );

                setCourses(completed);
            } catch (error) {
                console.error("Error fetching completed chapters:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userDetail?.email) {
            fetchCompleted();
        }
    }, [userDetail?.email]);

    const renderItem = ({ item }: { item: Course }) => (
        <View style={styles.courseItem}>
            <Ionicons name="checkmark-circle" size={28} color={Colors.GREEN} />
            <View style={{ marginLeft: 12, width: "80%" }}>
                <Text numberOfLines={2} style={styles.courseTitle}>
                    {item.courseTitle}
                </Text>
                <Text style={styles.courseDate}>
                    {item.chapters.length} chapters completed
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator size="large" color={Colors.GREEN} />
                <Text
                    style={[
                        styles.courseTitle,
                        { color: "white", marginTop: 16 },
                    ]}
                >
                    Loading...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.button}
            >
                <AntDesign name="left" size={24} color={Colors.WHITE} />
                <Text style={styles.header}>Completed Courses</Text>
            </TouchableOpacity>

            {courses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="sad-outline"
                        size={50}
                        color={Colors.GRAY}
                    />
                    <Text style={styles.emptyText}>
                        No courses completed yet
                    </Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={courses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

export default CompletedChapters;
