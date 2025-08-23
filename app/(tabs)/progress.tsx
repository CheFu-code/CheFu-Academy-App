import { useFocusEffect } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, Image, Text, ToastAndroid, View } from "react-native";
import NoCourse from "../../component/Home/NoCourse";
import CourseProgressCard from "../../component/Shared/CourseProgressCard";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

import { Course } from "@/types/course";
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    getFirestore,
    orderBy,
    query,
    where,
} from "@react-native-firebase/firestore";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Progress({ enroll = false }) {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const { userDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [fetching, setFetching] = useState(false); 
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            setLoadingId(null);
        }, [])
    );

    useEffect(() => {
        if (userDetail) GetCourseList();
    }, [userDetail]);

    const GetCourseList = async () => {
        if (fetching) return;
        setLoading(true);
        setFetching(true);
        setCourseList([]);
        if (!userDetail?.email) {
            setLoading(false);
            setFetching(false);
            return;
        }

        try {
            const db = getFirestore();
            const courseRef = collection(db, "course");
            const q = query(
                courseRef,
                where("createdBy", "==", userDetail.email),
                orderBy("createdOn", "desc")
            );
            const querySnapshot = await getDocs(q);

            const courses = querySnapshot.docs.map(
                (
                    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<Course>
                ) => ({
                    ...doc.data(),
                    id: doc.id,
                })
            );

            setCourseList(courses);
        } catch (error) {
            console.error(error);
            Sentry.captureException(error);
            if (typeof ToastAndroid !== "undefined") {
                ToastAndroid.show(
                    "Failed to load progress",
                    ToastAndroid.SHORT
                );
            }
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    const handlePress = (item: Course) => {
        const id = item.id || item.courseTitle || "";
        setLoadingId(id);

        setTimeout(() => {
            router.push({
                pathname: "/courseView",
                params: {
                    courseParams: JSON.stringify(item),
                    enroll: enroll ? "true" : "false", 
                },
            });
        }, 100);
    };

    if (loading && courseList.length === 0) {
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
                    Loading your progress...
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
            <Image
                source={require("../../assets/images/graph.png")}
                style={{ position: "absolute", width: "100%", height: 500 }}
            />
            <SafeAreaView style={{ flex: 1, padding: 15 }}>
                <Text
                    style={{
                        fontFamily: "outfit-bold",
                        fontSize: 24,
                        color: Colors.PRIMARY,
                        letterSpacing: 1,
                    }}
                >
                    Course Progress
                </Text>

                {courseList.length > 0 ? (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        onRefresh={GetCourseList}
                        refreshing={loading}
                        data={courseList}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isLoading =
                                loadingId ===
                                (item.id || item.courseTitle || "");
                            return (
                                <CourseProgressCard
                                    item={item}
                                    width={"97%"}
                                    loading={isLoading}
                                    disabled={Boolean(loadingId)}
                                    onPress={() => handlePress(item)}
                                />
                            );
                        }}
                    />
                ) : (
                    !loading && <NoCourse />
                )}
            </SafeAreaView>
        </View>
    );
}
