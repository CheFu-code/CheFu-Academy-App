import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import CourseList from "../Home/CourseList";

export default function CourseListByCategory({ category }) {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetCourseListByCategory();
  }, [category]);

  const GetCourseListByCategory = async () => {
    setCourseList([]);
    setLoading(true);
    // Log the category prop before querying
    console.log("[DEBUG] Category prop:", category);
    // Fetch all courses, not filtered
    const q = query(
      collection(db, "course"),
      orderBy("createdOn", "desc")
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      // Log the category field of each document
      console.log("[DEBUG] Firestore doc:", doc.id, "category:", docData.category);
      if (docData.category === category) {
        data.push({ id: doc.id, ...docData });
      }
    });
    console.log("[DEBUG] Filtered data array:", data);
    setCourseList(data);
    setLoading(false);
  };
  return (
    <View>
      {loading ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size={32} color={Colors.GREEN} />
        </View>
      ) : courseList?.length > 0 ? (
        <CourseList heading={category} courseList={courseList} enroll={true} />
      ) : null}
    </View>
  );
}
