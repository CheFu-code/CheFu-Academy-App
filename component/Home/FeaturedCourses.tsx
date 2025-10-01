import { db } from "@/config/fireConfig";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";
import { Course } from "@/types/course";
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    limit,
    query
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constant/Colors";
import FeaturedCourseCard from "./FeaturedCourseCard";
import FeaturedCourseSkeleton from "./FeaturedCourseSkeleton";

export default function FeaturedCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { safePush } = useSafeNavigation()
    useEffect(() => {
        const fetchFeaturedCourses = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "course"), limit(5)); // Fetch 5 courses as "featured"
                const querySnapshot = await getDocs(q);
                const courseList: Course[] = [];
                querySnapshot.forEach(
                    (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                        courseList.push(doc.data() as Course);
                    }
                );
                setCourses(courseList);
            } catch (error) {
                console.error("Error fetching featured courses: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedCourses();
    }, []);

    const handlePress = (item: Course) => {
        safePush({
            pathname: "/courseView",
            params: {
                courseParams: JSON.stringify(item),
                enroll: false.toString(),
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Featured Courses</Text>
            {loading ? (
                <View style={styles.skeletonContainer}>
                    {[...Array(3)].map((_, index) => (
                        <FeaturedCourseSkeleton key={index} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={courses}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.docId || item.courseTitle}
                    renderItem={({ item }) => (
                        <FeaturedCourseCard
                            course={item}
                            onPress={() => handlePress(item)}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    heading: {
        fontFamily: "outfit-bold",
        fontSize: 25,
        color: Colors.PRIMARY,
        marginBottom: 10,
    },
    skeletonContainer: {
        flexDirection: "row",
    },
});
