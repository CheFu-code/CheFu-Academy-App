import {
  createUserWithEmailAndPassword,
  getAuth,
} from "@react-native-firebase/auth";

import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";

import LottieView from "lottie-react-native";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as RNLocalize from "react-native-localize";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";
import { styles } from "../../styles/SignUp.styles";

const SignUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const DEFAULT_PREFS = {
    general: false,
    marketing: false,
    activity: false,
    security: true,
  };

  const auth = getAuth();

  // Email and password validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pw) => pw.length >= 6;

  const CreateNewAccount = async () => {
    if (loading) return; // Prevent double submission
    setErrorMsg("");
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }
    if (!validateEmail(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setErrorMsg("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const resp = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = resp.user;

      await user.sendEmailVerification();
      await SaveUser(user);

      setErrorMsg("");
      Alert.alert(
        "Account Created Successfully",
        "Please check your email to verify your address."
      );
    } catch (e) {
      Sentry.captureException(e);
      if (!e || !e.code) {
        setErrorMsg("An unknown error occurred. Please try again.");
        setLoading(false);
        return;
      }
      switch (e.code) {
        case "auth/email-already-in-use":
          setErrorMsg(
            "This email is already in use. Please use a different email."
          );
          break;
        case "auth/invalid-email":
          setErrorMsg("The email address is not valid.");
          break;
        case "auth/weak-password":
          setErrorMsg("Password should be at least 6 characters.");
          break;
        case "auth/operation-not-allowed":
          setErrorMsg(
            "Email/password accounts are not enabled. Please contact support."
          );
          break;
        case "auth/missing-email":
          setErrorMsg("Please enter your email address.");
          break;
        case "auth/too-many-requests":
          setErrorMsg("Too many attempts. Please try again later.");
          break;
        case "auth/internal-error":
          setErrorMsg("Internal error. Please try again later.");
          break;
        default:
          if (e.message && e.message.includes("network")) {
            setErrorMsg(
              "Network error: Please check your internet connection and try again."
            );
          } else {
            setErrorMsg(e.message);
          }
      }
    } finally {
      setLoading(false);
    }
  };

  const SaveUser = async (user) => {
    try {
      const firestore = getFirestore();
      const { Platform, Dimensions } = require("react-native");
      const { width, height } = Dimensions.get("window");
      const deviceInfo = {
        os: Platform.OS,
        osVersion: Platform.Version,
        screenWidth: width,
        screenHeight: height,
        isTablet: width >= 600,
      };

      const country = RNLocalize.getCountry();
      const userEmail = user.email || email.trim();
      const userFullName = user.displayName || fullName;
      const userPhoto = user.photoURL || null;
      const userProvider =
        (user.providerData && user.providerData[0]?.providerId) ||
        user.providerId ||
        "email";

      // Check if user already exists
      const userDocRef = doc(firestore, "users", userEmail);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // User exists, update lastLogin and any new info
        await setDoc(
          userDocRef,
          {
            ...userDoc.data(),
            lastLogin: new Date(),
            updatedAt: new Date(),
            fullname: userFullName,
            profilePicture: userPhoto,
            provider: userProvider,
          },
          { merge: true }
        );
        setUserDetail({
          ...userDoc.data(),
          fullname: userFullName,
          profilePicture: userPhoto,
          provider: userProvider,
        });
      } else {
        // New user, create document
        const data = {
          fullname: userFullName,
          email: userEmail,
          member: false,
          isVerified: user.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date(),
          uid: user.uid,
          emailPreferences: DEFAULT_PREFS,
          profilePicture: userPhoto,
          lastLogin: new Date(),
          provider: userProvider,
          onboardingComplete: false,
          roles: ["user"],
          bio: "",
          language: "en",
          country,
          subscriptionStatus: "free",
          deviceInfo,
        };
        await setDoc(userDocRef, data);
        setUserDetail(data);

        // Only send welcome email for new users
        await fetch(
          "https://chefu-academy-tmzx.onrender.com/api/email/send-welcome",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              name: userFullName,
            }),
          }
        );
      }

      router.replace("/(tabs)/home");
    } catch (e) {
      Sentry.captureException(e);
      console.log("Error in SaveUser:", e.message);
      alert("Failed to save your data. Please try again later.");
    }
  };

  if (loading) {
    return (
      <Modal animationType="fade" transparent={true} visible={loading}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require("./../../assets/animations/GO TO SCHOOL ANIMATION.json")}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.modalTitle}>Creating your account...</Text>
            <Text style={styles.modalSubtext}>
              Just a moment while we create your account.
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={30}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", padding: 10 }}>
            <Image
              source={require("./../../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Create new account</Text>

            <TextInput
              placeholder="Fullname"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              onChangeText={(v) => setFullName(v.trimStart())}
              maxLength={50}
              value={fullName}
              accessibilityLabel="Full Name"
              autoCapitalize="words"
              returnKeyType="next"
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              onChangeText={(v) => setEmail(v.trim())}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={100}
              value={email}
              accessibilityLabel="Email Address"
              returnKeyType="next"
            />
            <View style={{ width: "100%", position: "relative" }}>
              <TextInput
                placeholder="Password"
                style={styles.textInput}
                placeholderTextColor={Colors.GRAY}
                secureTextEntry={!showPassword}
                onChangeText={(v) => setPassword(v)}
                maxLength={50}
                value={password}
                accessibilityLabel="Password"
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (!loading) CreateNewAccount();
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 15, top: 32 }}
                accessibilityLabel={
                  showPassword ? "Hide Password" : "Show Password"
                }
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.showPassword,
                    {
                      color:
                        showPassword === true ? Colors.GREEN : Colors.PRIMARY,
                    },
                  ]}
                >
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {errorMsg ? (
              <Text
                style={{ color: "red", marginTop: 10, textAlign: "center" }}
                accessibilityLiveRegion="polite"
              >
                {errorMsg}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={CreateNewAccount}
              style={[
                styles.button,
                {
                  opacity:
                    loading || !email || !password || !fullName ? 0.4 : 1,
                },
              ]}
              disabled={loading || !email || !password || !fullName}
            >
              {!loading ? (
                <Text style={styles.buttonText}>Create Account</Text>
              ) : (
                <ActivityIndicator color={"white"} size={"large"} />
              )}
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                gap: 3,
                marginTop: 20,
              }}
            >
              <Text style={{ color: Colors.WHITE }}>
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.replace("/auth/signIn")}>
                <Text
                  style={{
                    color: Colors.PRIMARY,
                    fontWeight: "bold",
                  }}
                >
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
