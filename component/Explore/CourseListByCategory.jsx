import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "../../constant/Colors";
import CourseList from "../Home/CourseList";

// ✅ Modular Firestore API (React Native Firebase)
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "@react-native-firebase/firestore";

export default function CourseListByCategory({ category }) {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetCourseListByCategory();
  }, [category]);

  const GetCourseListByCategory = async () => {
    setLoading(true);
    setCourseList([]);
    try {
      const db = getFirestore(); // ✅ Get Firestore instance
      const q = query(collection(db, "course"), orderBy("createdOn", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((docData) => docData.category === category);

      setCourseList(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ActivityIndicator size={32} color={Colors.GREEN} />
        </View>
      ) : courseList?.length > 0 ? (
        <CourseList heading={category} courseList={courseList} enroll={true} />
      ) : null}
    </View>
  );
}
