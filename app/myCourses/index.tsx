import { Colors } from "@/constant/Colors";
import { imageAssets } from "@/constant/Option";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Course } from "@/types/course";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
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
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/MyCourses.styles";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

export default function MyCourses() {
    const { safeBack, safePush } = useSafeNavigation()
    const { userDetail } = useContext(UserDetailContext);
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
                    collection(db, "course"),
                    where("createdBy", "==", user.email)
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

    const isCourseComplete = (course: Course) => {
        const totalChapters = course.chapters?.length || 0;
        const completedChapters = course.completedChapter?.length || 0;

        return totalChapters > 0 && totalChapters === completedChapters;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <TouchableOpacity
                onPress={() => safeBack()}
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
                    style={styles.loader}
                />
            ) : myCourses.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                        You haven’t created or enrolled in any courses yet.
                    </Text>
                </View>
            ) : (
                <>
                    <FlatList
                        numColumns={2}
                        data={myCourses}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.courseCard}
                                onPress={() =>
                                    safePush({
                                        pathname: "/courseView",
                                        params: {
                                            courseParams: JSON.stringify(item),
                                            enroll: "true",
                                        },
                                    })
                                }
                            >
                                {item.banner_image && (
                                    <>
                                        <Image
                                            source={
                                                imageAssets[item?.banner_image]
                                            }
                                            style={styles.bannerImage}
                                            resizeMode="cover"
                                        />

                                        {isCourseComplete(item) && (
                                            <Ionicons
                                                size={24}
                                                color={Colors.GREEN}
                                                name="checkmark-circle"
                                                style={styles.checkmark}
                                            />
                                        )}
                                    </>
                                )}

                                <View style={styles.detailsContainer}>
                                    <Text
                                        numberOfLines={3}
                                        style={styles.courseTitle}
                                    >
                                        {item.courseTitle}
                                    </Text>

                                    <View style={styles.chapterContainer}>
                                        <Text style={styles.chapter}>
                                            Chapters:{" "}
                                            {item.chapters?.length || 0}
                                        </Text>

                                        <Text
                                            numberOfLines={1}
                                            style={styles.time}
                                        >
                                            {item?.createdOn?.toDate
                                                ? item.createdOn
                                                    .toDate()
                                                    .toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        }
                                                    )
                                                : ""}
                                        </Text>
                                    </View>
                                    {isCourseComplete(item) && (
                                        <Text style={styles.completedBadge}>
                                            Completed
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </SafeAreaView>
    );
}
