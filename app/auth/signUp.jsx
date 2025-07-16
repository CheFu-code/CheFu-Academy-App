import auth from "@react-native-firebase/auth";
import { doc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

const SignUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const DEFAULT_PREFS = {
    general: false,
    marketing: false,
    activity: false,
    security: true,
  };

  const CreateNewAccount = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert("All fields are required.");
      return;
    }
    setLoading(true);

    try {
      const resp = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password
      );
      const user = resp.user;

      await user.sendEmailVerification();

      await SaveUser(user);

      alert("Account created! Please check your email to verify your address.");
    } catch (e) {
      Sentry.captureException(e);
      console.log("Error in createUserWithEmailAndPassword:", e.message);
      switch (e.code) {
        case "auth/email-already-in-use":
          alert("This email is already in use. Please use a different email.");
          break;
        case "auth/invalid-email":
          alert("The email address is not valid.");
          break;
        case "auth/weak-password":
          alert("Password should be at least 6 characters.");
          break;
        case "auth/operation-not-allowed":
          alert(
            "Email/password accounts are not enabled. Please contact support."
          );
          break;
        case "auth/missing-email":
          alert("Please enter your email address.");
          break;
        case "auth/too-many-requests":
          alert("Too many attempts. Please try again later.");
          break;
        case "auth/internal-error":
          alert("Internal error. Please try again later.");
          break;
        default:
          if (e.message && e.message.includes("network")) {
            alert(
              "Network error: Please check your internet connection and try again."
            );
          } else {
            alert(e.message);
          }
      }
    } finally {
      setLoading(false);
    }
  };

  const SaveUser = async (user) => {
    try {
      const db = getFirestore();
      const data = {
        fullname: fullName,
        email: email.trim(),
        member: false,
        isVerified: user.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
        uid: user.uid,
        emailPreferences: DEFAULT_PREFS,
      };

      await setDoc(doc(db, "users", email.trim()), data);

      setUserDetail(data);
      router.push("/home");
    } catch (e) {
      Sentry.captureException(e);
      console.log("Error in SaveUser:", e.message);
      alert("Failed to save your data. Please try again later.");
    }
  };

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
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: Colors.PRIMARY,
                marginBottom: 15,
              }}
            />
            <Text
              style={{
                fontSize: 28,
                fontFamily: "outfit-bold",
                color: Colors.PRIMARY,
              }}
            >
              Create new account
            </Text>

            <TextInput
              placeholder="Fullname"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              onChangeText={setFullName}
              maxLength={50}
              value={fullName}
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={100}
              value={email}
            />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              maxLength={50}
              value={password}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ color: Colors.PRIMARY }}>
                {showPassword ? "Hide Password" : "Show Password"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={CreateNewAccount}
              style={{
                padding: 15,
                backgroundColor: Colors.PRIMARY,
                width: "100%",
                borderRadius: 10,
                marginTop: 25,
                opacity: loading || !email || !password || !fullName ? 0.4 : 1,
              }}
              disabled={loading || !email || !password || !fullName}
            >
              {!loading ? (
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    fontSize: 20,
                    textAlign: "center",
                    color: Colors.WHITE,
                  }}
                >
                  Create Account
                </Text>
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
              <Pressable onPress={() => router.push("/auth/signIn")}>
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
});
