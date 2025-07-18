globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;

import { UserDetailContext } from "@/context/UserDetailContext";
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
import { authorize } from "react-native-app-auth";
import ImmersiveMode from "react-native-immersive";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../constant/Colors";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { SaveUser } from "./auth/signUp";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setUserDetail } = useContext(UserDetailContext);
  const auth = getAuth();
  const firestore = getFirestore();

  const githubAuthConfig = {
    clientId: "Ov23ligAlqOw7DlnHPxS",
    clientSecret: "69afb862358b38965e9ca00cc24eac296c22da48",
    redirectUrl: "chefu-academy://oauthredirect", // Must match your GitHub OAuth app settings
    scopes: ["identity", "user:email"],
    serviceConfiguration: {
      authorizationEndpoint: "https://github.com/login/oauth/authorize",
      tokenEndpoint: "https://github.com/login/oauth/access_token",
    },
  };

  async function getGithubAccessToken() {
    try {
      const result = await authorize(githubAuthConfig);
      // result.accessToken is what you need for Firebase
      return result.accessToken;
    } catch (error) {
      console.error("GitHub OAuth error:", error);
      throw error;
    }
  }

  // Google Sign-In config
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "441077080510-376i017sckjqhff8mf491f4erskpmp3d.apps.googleusercontent.com", // Required for Firebase
      offlineAccess: true,
    });
  }, []);
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo;
      // Authenticate with Firebase using the Google idToken
      const { GoogleAuthProvider, signInWithCredential } = await import(
        "@react-native-firebase/auth"
      );
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      // Save or update user in Firestore
      await SaveUser(userCredential.user);
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
        console.error("Google Sign-In error:", error);
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

  const handleGithubSignIn = async () => {
    try {
      // Sign in with GitHub using Firebase Auth
      const { GithubAuthProvider, signInWithCredential } = await import(
        "@react-native-firebase/auth"
      );
      // You need to obtain the GitHub OAuth access token from your OAuth flow
      // For demonstration, let's assume you have it as `githubAccessToken`
      const githubAccessToken = await getGithubAccessToken(); // Implement this function to get the token

      const githubCredential = GithubAuthProvider.credential(githubAccessToken);
      const userCredential = await signInWithCredential(auth, githubCredential);

      // Save or update user in Firestore
      await SaveUser(userCredential.user);

      // Fetch user data from Firestore
      const userRef = doc(firestore, "users", userCredential.user.email);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserDetail(userData);
        await AsyncStorage.setItem("userDetail", JSON.stringify(userData));
        router.replace("/(tabs)/home");
      } else {
        console.warn("User data not found in Firestore.");
      }
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      Sentry.captureException(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
      }}
    >
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
          style={styles.button}
          onPress={() => router.push("/auth/signUp")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
            }}
            onPress={handleGoogleSignIn}
          >
            <MaterialCommunityIcons
              name="google"
              size={24}
              color="white"
              style={{
                marginRight: 10,
                padding: 8,
                backgroundColor: Colors.GOOGLE.GRADIENT[0],
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
            }}
            onPress={handleGithubSignIn}
          >
            <MaterialCommunityIcons
              name="github"
              size={24}
              color="white"
              style={{
                marginRight: 10,
                padding: 8,
                backgroundColor: Colors.BLACK,
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        </View>

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
              marginBottom: 75,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button2: {
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
    fontFamily: "outfit-bold",
  },
});
