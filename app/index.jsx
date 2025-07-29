globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;

import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import ImmersiveMode from "react-native-immersive";
import { Colors } from "../constant/Colors";
import { UserDetailContext } from "../context/UserDetailContext";
import { styles } from "../styles/WelcomeScreen.styles";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setUserDetail } = useContext(UserDetailContext);
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    if (Platform.OS === "android" && ImmersiveMode?.setImmersive) {
      ImmersiveMode.setImmersive(true);
    } else {
      StatusBar.setHidden(true);
    }
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        // 1. Load user from AsyncStorage
        const storedUser = await AsyncStorage.getItem("userDetail");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserDetail(userData);
          setLoading(false);
          router.replace("/(tabs)/home");
          return;
        }

        // 2. Use modular auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              await user.reload();

              if (!user.email) {
                console.warn(
                  "User email is null or undefined, cannot fetch user document."
                );
                setLoading(false);
                return;
              }

              const userRef = doc(firestore, "users", user.email);

              const result = await getDoc(userRef);

              if (result.exists) {
                const userData = result.data();

                if (!userData) {
                  setLoading(false);
                  return;
                }

                if (user.emailVerified && !userData.isVerified) {
                  await updateDoc(userRef, {
                    isVerified: true,
                    updatedAt: new Date(),
                  });
                  userData.isVerified = true;
                }

                setUserDetail(userData);
                await AsyncStorage.setItem(
                  "userDetail",
                  JSON.stringify(userData)
                );

                setLoading(false);
                router.replace("/(tabs)/home");
              } else {
                console.warn("User data not found in Firestore.");
                setLoading(false);
              }
            } catch (error) {
              if (error.code === "firestore/unavailable") {
                ToastAndroid.show(
                  "Network error. Please check your connection.",
                  ToastAndroid.SHORT
                );
              }
              console.error("Error fetching user data:", error);
              Sentry.captureException(error);
              setLoading(false);
            }
          } else {
            console.log("No user is currently signed in from welcome screen.");
            setLoading(false);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error loading user from AsyncStorage:", error);
        Sentry.captureException(error);
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const gitHub = () => {
    router.push("/auth/github");
  };

  return (
    <View style={styles.centeredContainer}>
      <Image
        source={require("./../assets/images/landing.png")}
        style={{ width: "100%", height: 360, marginTop: 20 }}
        resizeMode="contain"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.bottomSheet}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text style={styles.title}>
          Welcome to{"\n"}
          <Text
            style={{
              color: Colors.BG_COLOR,
              fontFamily: "outfit-bold",
            }}
          >
            CheFu Academy
          </Text>
        </Text>

        <Text style={styles.subtitle}>Smart Learning Starts Here</Text>

        <TouchableOpacity
          disabled={loading}
          style={styles.button}
          onPress={() => router.push("/auth/signUp")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => gitHub()} styles={styles.gitHub}>
          <AntDesign
            style={{
              textAlign: "center",
              marginVertical: 10,
            }}
            name="github"
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          onPress={() => router.push("/auth/signIn")}
          style={[styles.button2, { backgroundColor: Colors.PRIMARY }]}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Already have an account? {"\n"}
            <Text style={{ color: Colors.BLACK }}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <Pressable disabled={loading}>
          <Text style={styles.conditions}>
            By using our app, you agree to our{" "}
            <Text
              style={{ color: Colors.YELLOW, textDecorationLine: "underline" }}
              onPress={() => router.push("/terms")}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={{ color: Colors.YELLOW, textDecorationLine: "underline" }}
              onPress={() => router.push("/privacy")}
            >
              Privacy Policy
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
