import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const SUPPORT_EMAIL = "kurisanimaluleke77@gmail.com";

  // UPDATED: changed param from uid to email to match firestore doc key usage
  const getUserDetail = async (email) => {
    try {
      const result = await getDoc(doc(db, "users", email));
      if (result.exists()) {
        setUserDetail(result.data());
      } else {
        console.warn("User data not found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // UPDATED: use async/await and removed shouldNavigate state
  const handleSignIn = async () => {
    const cleanEmail = email.trim().toLowerCase();

    // Clear errors before validation
    setEmailError("");
    setPasswordError("");

    if (!cleanEmail) {
      setEmailError("Please enter your email");
      return;
    }
    if (!password) {
      setPasswordError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const resp = await signInWithEmailAndPassword(auth, cleanEmail, password);
      await getUserDetail(resp.user.email); // Using email as Firestore doc key
      ToastAndroid.show("Signed in successfully", ToastAndroid.SHORT);
      router.replace("/(tabs)/home");
    } catch (e) {
      setLoading(false);
      const contactSupport = () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
      switch (e.code) {
        case "auth/operation-not-allowed":
          Alert.alert(
            "Login Not Enabled",
            "Email/password accounts are not enabled. Please contact support.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Contact Now", onPress: contactSupport },
            ]
          );
          break;
        case "auth/invalid-credential":
          ToastAndroid.show(
            "Invalid credentials. Please try again.",
            ToastAndroid.SHORT
          );
          break;
        case "auth/internal-error":
          Alert.alert(
            "Internal Error",
            "Something went wrong. Please try again later or contact support.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Contact", onPress: contactSupport },
            ]
          );
          break;
        case "auth/network-request-failed":
          Alert.alert(
            "Network Error",
            "Please check your internet connection and try again. Contact support if the problem persists.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Contact", onPress: contactSupport },
            ]
          );
          break;
        default:
          Alert.alert("Error", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.BG_COLOR,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={30}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: 30,
              padding: 25,
            }}
          >
            <Image
              source={require("./../../assets/images/logo.png")}
              style={{ width: 180, height: 180 }}
            />
            <Text
              style={{
                fontSize: 28,
                fontFamily: "outfit-bold",
                color: Colors.PRIMARY,
              }}
            >
              Welcome back
            </Text>

            <TextInput
              placeholder="Email"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Text style={{ color: "red", alignSelf: "flex-start" }}>
                {emailError}
              </Text>
            ) : null}

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                placeholderTextColor={Colors.GRAY}
                secureTextEntry={!showPassword}
                onChangeText={(value) => {
                  setPassword(value);
                  if (passwordError) setPasswordError("");
                }}
                autoCapitalize="none"
                style={{
                  flex: 1,
                  fontSize: 18,
                  paddingVertical: 15,
                  color: Colors.WHITE,
                }}
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color={Colors.PRIMARY}
                />
              </Pressable>
            </View>
            {passwordError ? (
              <Text style={{ color: "red", alignSelf: "flex-start" }}>
                {passwordError}
              </Text>
            ) : null}

            <Pressable
              onPress={() => router.push("/auth/forgotPassword")}
              style={{ alignSelf: "flex-end", marginTop: 10 }}
            >
              <Text style={{ color: Colors.PRIMARY, fontWeight: "bold" }}>
                Forgot Password?
              </Text>
            </Pressable>

            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: Colors.PRIMARY,
                width: "100%",
                borderRadius: 10,
                marginTop: 25,
                opacity: loading || !email || !password ? 0.4 : 1,
              }}
              onPress={handleSignIn}
              disabled={loading || !email || !password}
            >
              {!loading ? (
                <Text
                  style={{
                    fontFamily: "outfit", // FIXED typo from "out-fit"
                    fontSize: 20,
                    textAlign: "center",
                    color: Colors.WHITE,
                  }}
                >
                  Sign In
                </Text>
              ) : (
                <ActivityIndicator color={"white"} size={"large"} />
              )}
            </TouchableOpacity>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                marginTop: 20,
              }}
            >
              <Text style={{ color: Colors.WHITE }}>
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/auth/signUp")}>
                <Text style={{ color: Colors.PRIMARY, fontWeight: "bold" }}>
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  textInput: {
    width: "100%",
    borderWidth: 1,
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
    color: Colors.WHITE,
    borderColor: Colors.PRIMARY,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "transparent",
  },
});
