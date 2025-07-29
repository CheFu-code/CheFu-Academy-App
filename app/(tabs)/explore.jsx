import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "@react-native-firebase/firestore";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import CourseCard from "../../component/Shared/CourseCard";
import { Colors } from "../../constant/Colors";

export default function ExploreScreen() {
  const [courseData, setCourseData] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setRefreshing(true);
    try {
      const db = getFirestore();
      const q = query(collection(db, "course"), orderBy("createdOn", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const limitedData = data.slice(0, Math.ceil(data.length * 0.4)); // 40% of courses

      setCourseData(limitedData);
      setFilteredCourses(limitedData);
      await AsyncStorage.setItem("cachedCourses", JSON.stringify(limitedData));
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
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courseData);
    } else {
      const filtered = courseData.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courseData]);

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
        <TextInput
          placeholder="Search course or category..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginBottom: 12,
            color: Colors.TEXT,
            fontFamily: "outfit",
          }}
        />

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
            <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
  },
  headerWrapper: {
    padding: 10,
    marginTop: 30,
    backgroundColor: Colors.BG_COLOR,
  },
  headerText: {
    fontFamily: "outfit-bold",
    fontSize: 26,
    color: Colors.PRIMARY,
  },
  scrollContent: {
    padding: 20,
    backgroundColor: Colors.BG_COLOR,
  },
  categoryWrapper: {
    marginTop: 10,
  },
});
