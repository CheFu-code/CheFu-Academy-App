import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import CourseList from "../../component/Home/CourseList";
import CourseProgress from "../../component/Home/CourseProgress";
import Header from "../../component/Home/Header";
import NoCourse from "../../component/Home/NoCourse";
import PracticeSection from "../../component/Home/PracticeSection";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

// Modular React Native Firebase imports
import authModule from "@react-native-firebase/auth";
import firestoreModule from "@react-native-firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
} from "@react-native-firebase/auth";

import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";

export default function Home() {
  const [courseList, setCourseList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize modular auth/firestore instances
  const auth = getAuth(authModule.app);
  const firestore = getFirestore(firestoreModule.app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        GetCourseList(user);
      } else {
        setCourseList([]);
        console.log("🚫 No authenticated user. Redirecting to sign-in...");
        router.replace("/auth/signIn");
      }
    });

    return () => unsubscribe();
  }, []);

  const GetCourseList = async (user) => {
    setLoading(true);

    try {
      await reload(user);

      // After reload, get updated currentUser from auth
      const refreshedUser = auth.currentUser;

      if (!refreshedUser?.email) {
        console.log("⚠️ No email on refreshedUser");
        setCourseList([]);
        return;
      }

      // Build query
      const coursesRef = collection(firestore, "course");
      const q = query(
        coursesRef,
        where("createdBy", "==", refreshedUser.email),
        orderBy("createdOn", "desc")
      );

      const querySnapshot = await getDocs(q);

      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push({ ...doc.data(), id: doc.id });
      });

      setCourseList(courses);
      ToastAndroid.show("Courses refreshed", ToastAndroid.SHORT);
    } catch (error) {
      console.error("🔥 Error fetching courses:", error);
      setCourseList([]);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        alert(
          `We've sent a verification email to ${user.email}! Check your inbox — and if it’s not there, don’t forget to look in your spam folder.`
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
        <View style={{ backgroundColor: Colors.BG_COLOR }}>
          <TouchableOpacity
            onPress={() => verify()}
            style={{
              backgroundColor: "#FFD700",
              padding: 10,
              marginTop: 35,
              borderRadius: 15,
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
        data={courseList}
        style={{ backgroundColor: Colors.BG_COLOR }}
        onRefresh={() => {
          const user = auth.currentUser;
          if (user) {
            GetCourseList(user);
          }
        }}
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
                paddingTop: Platform.OS === "ios" ? 40 : 0,
                padding: 15,
              }}
            >
              <Header />

              {courseList?.length === 0 ? (
                <NoCourse />
              ) : (
                <>
                  <CourseProgress courseList={courseList} />
                  <PracticeSection />
                  <CourseList courseList={courseList} />
                </>
              )}
            </View>
          </View>
        }
      />

      <BannerAd
        unitId={"ca-app-pub-8952058057579255/9705798694"}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </>
  );
}
