import { Course } from "@/types/course";
import { AntDesign } from "@expo/vector-icons";
import { getApp } from "@react-native-firebase/app";
import {
    collection,
    FirebaseFirestoreTypes,
    getDocs,
    getFirestore,
    orderBy,
    query,
    where,
} from "@react-native-firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CourseListGrid, {
    AllowedPaths,
} from "../../../component/PracticeScreen/CourseListGrid";
import { Colors } from "../../../constant/Colors";
import { PracticeOption } from "../../../constant/Option";
import { UserDetailContext } from "../../../context/UserDetailContext";

export default function PracticeTypeHomeScreen() {
    const { type } = useLocalSearchParams();
    const option = PracticeOption.find((item) => item.name === type);
    const { userDetail } = useContext(UserDetailContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [courseList, setCourseList] = useState<Course[]>([]);

    useEffect(() => {
        if (userDetail) {
            GetCourseList();
        }
    }, [userDetail]);

    const GetCourseList = async () => {
        setLoading(true);
        setCourseList([]);

        try {
            const db = getFirestore(getApp());
            const q = query(
                collection(db, "course"),
                where("createdBy", "==", userDetail.email),
                orderBy("createdOn", "desc")
            );
            const querySnapshot = await getDocs(q);
            const courses: Course[] = [];

            querySnapshot.forEach(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                    const courseData = doc.data() as Course; // assert type here
                    courses.push({ ...courseData, id: doc.id });
                }
            );

            setCourseList(courses);
        } catch (e) {
            console.error("❌ Error fetching course list:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SafeAreaView
                style={{
                    backgroundColor: Colors.BG_COLOR,
                }}
            >
                <Image
                    style={{
                        height: 250,
                        width: "100%",
                        borderBottomRightRadius: 25,
                        borderBottomLeftRadius: 25,
                    }}
                    source={option?.image}
                />
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        position: "absolute",
                        padding: 10,
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                        marginTop:15
                    }}
                >
                    <AntDesign
                        name="left"
                        size={24}
                        color={Colors.PRIMARY}
                    />
                    <Text
                        style={{
                            fontFamily: "outfit-bold",
                            fontSize: 25,
                            color: Colors.PRIMARY,
                        }}
                    >
                        {type}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
                showsVerticalScrollIndicator={false}
                onRefresh={() => GetCourseList()}
                refreshing={loading}
                style={{
                    backgroundColor: Colors.BG_COLOR,
                    flex: 1,
                }}
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={
                    <View style={{ flex: 1 }}>
                        {option && (
                            <CourseListGrid
                                option={{
                                    ...option,
                                    path: option.path as AllowedPaths,
                                }}
                                courseList={courseList}
                            />
                        )}
                    </View>
                }
            />
        </>
    );
}
