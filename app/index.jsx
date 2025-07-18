globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;


import { UserDetailContext } from "@/context/UserDetailContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from "../constant/Colors";

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setUserDetail } = useContext(UserDetailContext);
  const auth = getAuth();
  const firestore = getFirestore();

  // Google Sign-In config
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual web client ID
      offlineAccess: true,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo;
      // Authenticate with Firebase using the Google idToken
      const { GoogleAuthProvider, signInWithCredential } = await import('@react-native-firebase/auth');
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
      // User is now signed in, onAuthStateChanged will handle the rest
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error
        console.error('Google Sign-In error:', error);
        Sentry.captureException(error);
      }
    }
  };

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
              // Removed console.log for production
              await user.reload();

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
                  console.log("✅ Firestore updated: Email is now verified.");
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
          style={[styles.button, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#4285F4' }]}
          onPress={handleGoogleSignIn}
        >
          <MaterialCommunityIcons name="google" size={24} color="#4285F4" style={{ marginRight: 10 }} />
          <Text style={[styles.buttonText, { color: '#4285F4' }]}>Continue with Google</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
  },
});
