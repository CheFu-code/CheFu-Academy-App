import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CourseList from "../../component/Home/CourseList";
import CourseProgress from "../../component/Home/CourseProgress";
import Header from "../../component/Home/Header";
import NoCourse from "../../component/Home/NoCourse";
import PracticeSection from "../../component/Home/PracticeSection";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

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

import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

// ... (all your imports stay the same)

export default function Home() {
  const [courseList, setCourseList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const CACHE_KEY = "@cached_courses";

  const router = useRouter();
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(
          "👤 Authenticated user detected. Loading cached courses..."
        );
        loadCachedCourses();
      } else {
        console.log("🚫 No authenticated user. Redirecting...");
        setCourseList([]);
        router.replace("/auth/signIn");
      }
    });

    return () => unsubscribe();
  }, []);

  const GetCourseList = async (isRefresh = false) => {
    if (fetching && !isRefresh) return;

    setLoading(true);
    setFetching(true);
    console.log("🌐 Fetching courses from Firestore...");

    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("⚠️ No current user found. Aborting fetch.");
        setCourseList([]);
        return;
      }

      await reload(user);
      const refreshedUser = auth.currentUser;
      if (!refreshedUser?.email) {
        console.log("❌ User email missing after reload.");
        ToastAndroid.show("Your email could not be found", ToastAndroid.SHORT);
        setCourseList([]);
        return;
      }

      const coursesRef = collection(firestore, "course");
      const q = query(
        coursesRef,
        where("createdBy", "==", refreshedUser.email),
        orderBy("createdOn", "desc")
      );
      const querySnapshot = await getDocs(q);
      const courses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      console.log(`✅ ${courses.length} courses fetched.`);

      setCourseList(courses);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(courses));
      console.log("💾 Courses saved to AsyncStorage.");

      if (isRefresh) {
        ToastAndroid.show("Refreshed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("🔥 Error fetching courses:", error);
      let errorMessage = "Failed to fetch courses. Please try again.";
      if (error.code === "firestore/unavailable") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === "firestore/permission-denied") {
        if (error.code === "auth/unknown") {
          errorMessage = "Unknown error.";
        } else if (error.code === "firestore/permission-denied") {
          errorMessage = "You don't have permission to access these courses.";
        }
      }
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        console.log("📌 useFocusEffect triggered. Refreshing courses...");
        GetCourseList();
      }
    }, [])
  );

  const loadCachedCourses = async () => {
    try {
      console.log("📦 Checking AsyncStorage for cached courses...");
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        console.log("✅ Cached courses found. Loading into state.");
        const parsed = JSON.parse(cached);
        setCourseList(parsed);
      } else {
        console.log("⚠️ No cached courses found.");
      }
    } catch (e) {
      console.error("❌ Error loading cached courses:", e);
    } finally {
      console.log("🔄 Fetching fresh courses in background...");
      GetCourseList();
    }
  };

  const verify = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        "Not Signed In",
        "Seems like you're currently not signed in."
      );
      return;
    }

    setSending(true);
    try {
      console.log("📨 Sending verification email...");
      await sendEmailVerification(user);
      Alert.alert(
        "Email Verification Sent",
        `We've sent a verification email to ${user.email}! Check your inbox — and if it’s not there, don’t forget to look in your spam folder.`
      );
    } catch (error) {
      console.error("❌ Failed to send verification email:", error);
      let errorMessage =
        "Failed to send verification email. Please try again later.";
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {auth.currentUser &&
        !auth.currentUser.emailVerified &&
        (sending ? (
          <ActivityIndicator
            style={{
              backgroundColor: Colors.GREEN,
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
            color={Colors.GREEN}
            size="small"
          />
        ) : (
          <View style={{ backgroundColor: Colors.BG_COLOR }}>
            <TouchableOpacity
              onPress={verify}
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
        ))}

      <FlatList
        data={courseList}
        style={{ backgroundColor: Colors.BG_COLOR }}
        onRefresh={() => {
          const user = auth.currentUser;
          if (user) {
            console.log("🔁 Manual refresh triggered.");
            setFetching(false);
            GetCourseList(user);
          }
        }}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Image
              style={{ position: "absolute", width: "100%", height: 500 }}
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
        unitId="ca-app-pub-8952058057579255/9705798694"
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => {
          setAdLoaded(true);
          console.log("✅ Ad loaded successfully.");
        }}
        onAdFailedToLoad={(err) => {
          console.log("❌ Ad failed to load", err);
          setAdLoaded(false);
        }}
      />
    </>
  );
}
