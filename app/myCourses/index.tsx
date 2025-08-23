import { Colors } from "@/constant/Colors";
import { Course } from "@/types/course";
import { AntDesign } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    getFirestore,
    query,
    where
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyCourses() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [myCourses, setMyCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) return;

                const db = getFirestore();
                const q = query(
                    collection(db, "courses"),
                    where("createdBy", "==", user.uid)
                );
                const snap = await getDocs(q);

                const courses = snap.docs.map(
                    (doc: FirebaseFirestoreTypes.DocumentSnapshot) => ({
                        id: doc.id,
                        ...doc.data(),
                    })
                );
                setMyCourses(courses);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <AntDesign name="left" size={24} color={Colors.WHITE} />
                <Text style={styles.backButtonText}>My Courses</Text>
            </TouchableOpacity>

            {/* Body */}
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.PRIMARY}
                    style={{ marginTop: 20 }}
                />
            ) : myCourses.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                        You haven’t created or enrolled in any courses yet.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={myCourses}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.courseCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/courseView",
                                    params: {
                                        courseParams: JSON.stringify(item),
                                        enroll: "true",
                                    },
                                })
                            }
                        >
                            <Text style={styles.courseTitle}>
                                {item.courseTitle}
                            </Text>
                            <Text style={styles.courseCategory}>
                                {item.category}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
        padding: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
    },
    backButtonText: {
        color: Colors.WHITE,
        fontSize: 18,
        fontFamily: "outfit-bold",
    },
    emptyBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: Colors.GRAY,
        fontSize: 16,
        fontFamily: "outfit",
    },
    courseCard: {
        backgroundColor: Colors.GRAY,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    courseTitle: {
        fontSize: 18,
        color: Colors.WHITE,
        fontFamily: "outfit-medium",
    },
    courseCategory: {
        fontSize: 14,
        color: Colors.GRAY,
    },
});
