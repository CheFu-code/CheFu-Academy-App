import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import Chapters from "../../component/CourseView/Chapters";
import Intro from "../../component/CourseView/Intro";
import { Colors } from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";

export default function CourseView() {
  const { courseParams, enroll } = useLocalSearchParams();
  // let course = { chapters: [] };
  const router = useRouter();
  const [course, setCourse] = useState({ chapters: [] });

  useEffect(() => {
    if (
      typeof courseParams === "string" &&
      courseParams.trim() !== "" &&
      courseParams.trim() !== "undefined" &&
      (courseParams.trim().startsWith("{") ||
        courseParams.trim().startsWith("["))
    ) {
      try {
        const parsed = JSON.parse(courseParams);
        setCourse(parsed);
      } catch (e) {
        console.error("Failed to parse courseParams:", courseParams, e);
        setCourse({ chapters: [] });
      }
    } else {
      console.warn("courseParams is missing or invalid:", courseParams);
      setCourse({ chapters: [] });
    }
  }, [courseParams]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
      {/* Fixed Image at the Top */}
      <Image
        source={
          imageAssets[course?.banner_image] ||
          require("../../assets/images/default_course_banner.png")
        }
        style={{
          width: "100%",
          height: 260,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          zIndex: 1,
        }}
      />

      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 40, // adjust as needed for safe area
          left: 20,
          zIndex: 2,
          backgroundColor: "rgba(255,255,255,0.6)", // optional background
          borderRadius: 25,
          padding: 6,
        }}
      >
        <Ionicons size={24} color={Colors.BLACK} name="arrow-back" />
      </Pressable>

      {/* Spacer below the image */}
      <View style={{ height: 260 }} />

      {/* Scrollable content below */}
      <FlatList
        data={[]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Intro course={course} enroll={enroll} />
            <Chapters course={course} />
          </View>
        }
      />
    </View>
  );
}
