import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import Chapters from "../../component/CourseView/Chapters";
import Intro from "../../component/CourseView/Intro";
import { Colors } from "../../constant/Colors";

export default function CourseView() {
  const { courseParams, enroll } = useLocalSearchParams();
  let course = { chapters: [] };
  if (
    typeof courseParams === "string" &&
    courseParams.trim() !== "" &&
    courseParams.trim() !== "undefined" &&
    (courseParams.trim().startsWith("{") || courseParams.trim().startsWith("["))
  ) {
    try {
      course = JSON.parse(courseParams);
    } catch (e) {
      console.error("Failed to parse courseParams:", courseParams, e);
      course = { chapters: [] };
    }
  } else {
    console.warn("courseParams is missing or invalid:", courseParams);
    course = { chapters: [] };
  }
  return (
    <FlatList
      data={[]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View
          style={{
            backgroundColor: Colors.BG_COLOR,
            flex: 1,
          }}
        >
          <Intro course={course} enroll={enroll} />
          <Chapters course={course} />
        </View>
      }
    />
  );
}
