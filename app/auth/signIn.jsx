import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constant/Colors"; // Make sure this path is correct
import { UserDetailContext } from "../../context/UserDetailContext"; // Adjust if needed

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fatalError, setFatalError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  const SUPPORT_EMAIL = "kurisanimaluleke77@gmail.com";

  const getUserDetail = async (email) => {
    try {
      const userDocRef = doc(db, "users", email);
      // Update lastLogin to now
      await userDocRef.update({ lastLogin: new Date() });
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserDetail(userDoc.data());
      } else {
        console.warn("User data not found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data from sign in:", error);
      Sentry.captureException(error);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async () => {
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();
    setEmailError("");
    setPasswordError("");

    if (!cleanEmail) {
      setEmailError("Please enter your email");
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setPasswordError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const resp = await auth.signInWithEmailAndPassword(cleanEmail, password);
      await getUserDetail(resp.user.email);
      ToastAndroid.show("Signed in successfully", ToastAndroid.SHORT);
      router.replace("/(tabs)/home");
    } catch (e) {
      Sentry.captureException(e);
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
          ToastAndroid.show("Invalid credentials. Please try again.", ToastAndroid.SHORT);
          break;
        case "auth/internal-error":
        case "auth/network-request-failed":
          Alert.alert(
            "Error",
            e.message || "Please try again or contact support.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Contact", onPress: contactSupport },
            ]
          );
          break;
        default:
          Alert.alert("Error", e.message);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  if (fatalError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_COLOR, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 18, marginBottom: 20 }}>A fatal error occurred.</Text>
        <Text style={{ color: "red", fontSize: 14, marginBottom: 20 }}>{fatalError?.message || String(fatalError)}</Text>
        <TouchableOpacity onPress={() => setFatalError(null)} style={{ backgroundColor: Colors.PRIMARY, padding: 12, borderRadius: 8, marginTop: 10 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG_COLOR }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={30}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: "center", paddingTop: 30, padding: 25 }}>
            <Image
              source={require("./../../assets/images/logo.png")}
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: Colors.PRIMARY,
                marginBottom: 15,
              }}
            />
            <Text style={{ fontSize: 28, fontFamily: "outfit-bold", color: Colors.PRIMARY }}>Welcome back</Text>

            <TextInput
              placeholder="Email"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              onChangeText={(value) => {
                setEmail(value.trim());
                if (emailError) setEmailError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? <Text style={{ color: "red", alignSelf: "flex-start" }}>{emailError}</Text> : null}

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
                style={{ flex: 1, fontSize: 18, paddingVertical: 15, color: "#ffffff" }}
                onSubmitEditing={() => { if (!loading) handleSignIn(); }}
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={Colors.PRIMARY} />
              </Pressable>
            </View>
            {passwordError ? <Text style={{ color: "red", alignSelf: "flex-start" }}>{passwordError}</Text> : null}

            <Pressable onPress={() => router.push("/auth/forgotPassword")} style={{ alignSelf: "flex-end", marginTop: 10 }}>
              <Text style={{ color: Colors.PRIMARY, fontWeight: "bold" }}>Forgot Password?</Text>
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
                <Text style={{ fontFamily: "outfit", fontSize: 20, textAlign: "center", color: Colors.WHITE }}>Sign In</Text>
              ) : (
                <ActivityIndicator color="white" size="large" />
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <Text style={{ color: Colors.WHITE }}>Don't have an account? </Text>
              <Pressable onPress={() => router.push("/auth/signUp")}>
                <Text style={{ color: Colors.PRIMARY, fontWeight: "bold" }}>Sign Up</Text>
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
    color: "#ffffff",
    borderColor: Colors.GRAY,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: Colors.GRAY,
    marginTop: 20,
  },
});
