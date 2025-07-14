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

    const q = query(collection(db, "course"), orderBy("createdOn", "desc"));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();

      if (docData.category === category) {
        data.push({ id: doc.id, ...docData });
      }
    });
    setCourseList(data);
    setLoading(false);
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
