import { sendEmailVerification } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import ImmersiveMode from "react-native-immersive";
import CourseList from "../../component/Home/CourseList";
import CourseProgress from "../../component/Home/CourseProgress";
import Header from "../../component/Home/Header";
import NoCourse from "../../component/Home/NoCourse";
import PracticeSection from "../../component/Home/PracticeSection";
import { auth, db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Home() {
  const [courseList, setCourseList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  const isDev = __DEV__; // true in development
  useEffect(() => {
    if (Platform.OS === "android" && ImmersiveMode?.setImmersive) {
      ImmersiveMode.setImmersive(true);
    }
  }, []);

  useEffect(() => {
    if (userDetail) GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);

    try {
      // 🔄 Refresh user data
      await auth.currentUser?.reload();

      const refreshedUser = auth.currentUser;

      if (!refreshedUser || !refreshedUser.email) {
        setCourseList([]);
        return;
      }

      const querySnapshot = await db
        .collection("course")
        .where("createdBy", "==", refreshedUser.email)
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

  const verify = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(auth.currentUser);
        alert(
          `We've sent a verification email to ${user?.email}! Check your inbox — and if it’s not there, don’t forget to look in your spam folder.`
        );
      } catch (error) {
        console.error("Failed to send verification email:", error);
        alert("Failed to send verification email. Try again later.");
      }
    } else {
      alert("No user is currently signed in.");
    }
  };

  return (
    <>
      {auth.currentUser && !auth.currentUser.emailVerified && (
        <View
          style={{
            backgroundColor: Colors.BG_COLOR,
          }}
        >
          <TouchableOpacity
            onPress={() => verify()}
            style={{
              backgroundColor: "#FFD700",
              padding: 10,
              marginTop: 35,
              borderTopEndRadius: 15,
              borderTopStartRadius: 15,
              borderBottomEndRadius: 15,
              borderBottomStartRadius: 15,
              opacity: 0.8,
            }}
          >
            <Text
              style={{
                color: "#000",
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              Please verify your email address to access all features.
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    </>
  );
}
