import { useContext, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Platform,
    ToastAndroid,
    View,
} from "react-native";
import CourseList from "../../component/Home/CourseList";
import CourseProgress from "../../component/Home/CourseProgress";
import Header from "../../component/Home/Header";
import NoCourse from "../../component/Home/NoCourse";
import PracticeSection from "../../component/Home/PracticeSection";
import { db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Home() {
  const [courseList, setCourseList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  const isDev = __DEV__; // true in development

  useEffect(() => {
    if (userDetail) GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    if (!userDetail || !userDetail.email) {
      setCourseList([]);
      setLoading(false);
      return;
    }

    try {
      const querySnapshot = await db
        .collection("course")
        .where("createdBy", "==", userDetail.email)
        .orderBy("createdOn", "desc")
        .get();

      if (querySnapshot.empty) {
        setCourseList([]);
      } else {
        const courses = [];
        querySnapshot.forEach((doc) => {
          courses.push({ ...doc.data(), id: doc.id });
        });
        setCourseList(courses);
      }

      ToastAndroid.show("Courses refreshed", ToastAndroid.SHORT);
    } catch (error) {
      setCourseList([]);

      if (error?.message?.includes("Could not reach Our backend")) {
        // ✅ Notify user about offline mode
        Alert.alert(
          "Connection Issue",
          "You're offline or your internet is unstable. Data may not be up to date."
        );
      } else {
        Alert.alert("Error", "Failed to fetch courses. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={[]}
      style={{
        backgroundColor: Colors.BG_COLOR,
      }}
      onRefresh={() => GetCourseList()}
      refreshing={loading}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <Image
            style={{
              position: "absolute",
              width: "100%",
              height: 500,
            }}
            source={require("../../assets/images/graph.png")}
          />
          <View
            style={{
              paddingTop: Platform.OS === "ios" && 45,
              padding: 25,
              // flex: 1,
            }}
          >
            <Header />

            {courseList?.length === 0 ? (
              <NoCourse />
            ) : (
              <View>
                <CourseProgress courseList={courseList} />
                <PracticeSection />
                <CourseList courseList={courseList} />
              </View>
            )}
          </View>
          {/* <BannerAd
            unitId={
              isDev ? TestIds.BANNER : "ca-app-pub-8952058057579255/9705798694"
            }
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          /> */}
        </View>
      }
    />
  );
}
