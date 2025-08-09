import {
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
} from "@react-native-firebase/firestore";
import LottieView from "lottie-react-native";
import { memo, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Colors } from "../../constant/Colors";
import CourseList from "../Home/CourseList";

function CourseListByCategory({ category }) {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const db = getFirestore();
                const q = query(
                    collection(db, "course"),
                    orderBy("createdOn", "desc")
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((docData) => docData.category === category);
                if (isMounted) setCourseList(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchCourses();
        return () => {
            isMounted = false;
        };
    }, [category]);

    if (loading && courseList.length === 0) {
        return (
            <View style={{ alignItems: "center", padding: 20 }}>
                <LottieView
                    autoPlay
                    loop
                    source={require("../../assets/animations/Loading.json")}
                    style={{ width: 150, height: 150 }}
                />
                <Text
                    style={{
                        marginTop: 10,
                        fontFamily: "outfit-bold",
                        fontSize: 16,
                        color: Colors.PRIMARY,
                    }}
                >
                    Exploring more courses...
                </Text>
                <Text
                    style={{
                        fontFamily: "outfit",
                        color: "#ccc",
                        marginTop: 10,
                        textAlign: "center",
                    }}
                >
                    This might take some time to load all the courses, please be
                    patient and monitor your network connection!
                </Text>
            </View>
        );
    }

    return courseList.length > 0 ? (
        <CourseList heading={category} courseList={courseList} enroll={true} />
    ) : null;
}

export default memo(CourseListByCategory);
