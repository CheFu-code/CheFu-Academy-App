import { UserDetailContext } from "@/context/UserDetailContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImmersiveMode from "react-native-immersive";
import "../app/firebase-background-handler";
import { auth, db } from "../config/fireConfig";
import { Colors } from "../constant/Colors";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // start true to wait for async loading
  const { setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    if (Platform.OS === "android" && ImmersiveMode?.setImmersive) {
      ImmersiveMode.setImmersive(true);
    } else {
      StatusBar.setHidden(true); // fallback for iOS or no immersive module
    }
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        // 1. Try load user from AsyncStorage first
        const storedUser = await AsyncStorage.getItem("userDetail");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // console.log("Loaded user from AsyncStorage:", userData);
          setUserDetail(userData);
          setLoading(false);
          router.replace("/(tabs)/home");
          return; // stop here, user loaded locally
        }

        // 2. Else listen to Firebase Auth state change
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              console.log("User signed in (Firebase):", user.email);

              await user.reload(); // 🔄 Make sure we get the latest verification status

              const userRef = doc(db, "users", user.email);

              const result = await getDoc(userRef);

              if (result.exists()) {
                const userData = result.data();
                console.log("Fetched user data from Firestore:", userData);

                if (user.emailVerified && !userData.isVerified) {
                  await updateDoc(userRef, {
                    isVerified: true,
                    updatedAt: new Date(),
                  });
                  console.log("✅ Firestore updated: Email is now verified.");
                  userData.isVerified = true; // also update local object
                }
                setUserDetail(userData);

                // Save to AsyncStorage
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
              console.error("Error fetching user data:", error);
              Sentry.captureException(error);
              setLoading(false);
            }
          } else {
            console.log("No user is currently signed in.");
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

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator color={Colors.PRIMARY} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
      <Image
        source={require("./../assets/images/landing.png")}
        style={{ width: "100%", height: 400, marginTop: 20 }}
        resizeMode="contain"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.bottomSheet}
      >
        <Text style={styles.title}>
          Welcome to{"\n"}
          <Text style={{ color: Colors.BG_COLOR, fontFamily: "outfit-bold" }}>
            CheFu Academy
          </Text>
        </Text>

        <Text style={styles.subtitle}>Smart Learning Starts Here</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/signUp")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/signIn")}
          style={[styles.button2, { backgroundColor: Colors.PRIMARY }]}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Already have an account? {"\n"}
            <Text
              style={{ color: Colors.BLACK, textDecorationLine: "underline" }}
            >
              Sign In
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              color: Colors.WHITE,
              marginTop: 30,
              fontSize: 14,
            }}
          >
            By signing up, you agree to our{" "}
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
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BG_COLOR,
  },
  bottomSheet: {
    padding: 25,
    backgroundColor: Colors.PRIMARY,
    height: "100%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.WHITE,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.WHITE,
    marginTop: 20,
    textAlign: "center",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 7,
  },
  button2: {
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
  },
});
