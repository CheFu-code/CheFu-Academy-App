import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
import { auth, db } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

const SignUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  // const [error, setError] = useState("");
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const CreateNewAccount = () => {
    if (!fullName.trim() || !email || !password) {
      // Show an alert or set an error state
      alert("All fields are required.");
      return;
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        // console.log("User created:", user);
        await SaveUser(user);
        setLoading(false);
      })
      .catch((e) => {
        console.log("Error in createUserWithEmailAndPassword:", e.message);
        if (e.code === "auth/email-already-in-use") {
          alert("This email is already in use. Please use a different email.");
        } else if (e.code === "auth/invalid-email") {
          alert("The email address is not valid.");
        } else if (e.code === "auth/weak-password") {
          alert("Password should be at least 6 characters.");
        } else if (e.code === "auth/operation-not-allowed") {
          alert(
            "Email/password accounts are not enabled. Please contact support."
          );
        } else if (e.code === "auth/missing-email") {
          alert("Please enter your email address.");
        } else if (e.code === "auth/too-many-requests") {
          alert("Too many attempts. Please try again later.");
        } else if (e.code === "auth/internal-error") {
          alert("Internal error. Please try again later.");
        } else if (e.message && e.message.includes("network")) {
          alert(
            "Network error: Please check your internet connection and try again."
          );
        } else {
          alert(e.message);
        }
        setLoading(false);
      });
  };

  const SaveUser = async (user) => {
    try {
      const data = {
        fullname: fullName,
        email: email,
        member: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        uid: user.uid,
      };
      await setDoc(doc(db, "users", email), data);

      setUserDetail(data);
      // console.log("User saved successfully");
      router.push("/home");
    } catch (e) {
      console.log("Error in SaveUser:", e.message);
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
            // paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              // paddingTop: 30,
              padding: 10,
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
              Create new account
            </Text>

            <TextInput
              placeholder="Fullname"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              onChangeText={(value) => setFullName(value)}
              maxLength={50}
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              onChangeText={(value) => setEmail(value)}
              require={true}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={100}
            />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              placeholderTextColor={Colors.GRAY}
              secureTextEntry={!showPassword}
              onChangeText={(value) => setPassword(value)}
              maxLength={50}
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
                display: "flex",
                flexDirection: "row",
                gap: 3,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  color: Colors.WHITE,
                }}
              >
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
