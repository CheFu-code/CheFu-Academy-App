import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import {
    FlatList,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import CourseCard from "../../component/Shared/CourseCard";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/Explore.styles";

export default function ExploreScreen() {
    const { userDetail } = useContext(UserDetailContext);
    const [courseData, setCourseData] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchCourses = useCallback(async () => {
        setRefreshing(true);
        try {
            const db = getFirestore();
            const q = query(
                collection(db, "course"),
                orderBy("createdOn", "desc")
            );
            const snapshot = await getDocs(q);

            let data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // ✅ Exclude courses owned by current user
            data = data.filter(
                (course) => course.createdBy !== userDetail?.email
            );

            const limitedData = data.slice(0, Math.ceil(data.length * 0.4)); // 40%

            setCourseData(limitedData);
            setFilteredCourses(limitedData);
            await AsyncStorage.setItem(
                "cachedCourses",
                JSON.stringify(limitedData)
            );
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            const cached = await AsyncStorage.getItem("cachedCourses");
            if (cached) {
                const parsed = JSON.parse(cached);
                setCourseData(parsed);
                setFilteredCourses(parsed);
            }
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [userDetail?.email]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            ToastAndroid.show("Please enter a search term", ToastAndroid.SHORT);
            return;
        }

        router.push({
            pathname: "/searchResults",
            params: { query: searchTerm.trim() },
        });
        setSearchTerm("");
    };

    if (loading) {
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
                    Loading...
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
            <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>Explore more courses</Text>
            </View>

            <View style={{ padding: 15 }}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Search course or category..."
                        placeholderTextColor={Colors.BLACK}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onSubmitEditing={handleSearch}
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                    />
                    <TouchableOpacity onPress={() => handleSearch()}>
                        <Ionicons
                            name="search"
                            size={20}
                            color={Colors.GREEN}
                            style={{ marginRight: 8 }}
                        />
                    </TouchableOpacity>
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{
                        paddingBottom: 160,
                        paddingTop: 5,
                    }}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => (
                        <CourseCard
                            course={item}
                            enroll={true}
                            style={{ width: "48%", marginBottom: 16 }}
                        />
                    )}
                    ListEmptyComponent={
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: 20,
                                color: "#999",
                            }}
                        >
                            No courses found.
                        </Text>
                    }
                    refreshing={loading}
                    onRefresh={fetchCourses}
                />
            </View>
        </View>
    );
}
