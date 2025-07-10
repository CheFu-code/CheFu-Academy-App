import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/fireConfig";
import { Colors } from "../../constant/Colors";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    const cleanEmail = email.trim().toLowerCase();

    console.log("[DEBUG] Attempting to reset password for:", cleanEmail);

    if (!cleanEmail) {
      Alert.alert("Enter Email", "Please enter your email address.");
      console.warn("[DEBUG] No email entered.");
      return;
    }

    if (loading) {
      console.log("[DEBUG] Already loading, skipping duplicate request.");
      return;
    }

    setLoading(true);
    console.log("[DEBUG] Sending reset email...");

    sendPasswordResetEmail(auth, cleanEmail)
      .then(() => {
        setLoading(false);
        console.log("[DEBUG] Password reset email sent successfully.");
        Alert.alert(
          "Check Your Email",
          `Password reset link sent to ${cleanEmail}.`
        );
        router.back();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error sending password reset email:", error);
        Alert.alert("Error", error.message);

        switch (error.code) {
          case "auth/user-not-found":
            console.warn("[DEBUG] No user found with this email.");
            Alert.alert("User Not Found", "No user found with this email.");
            break;
          case "auth/invalid-email":
            console.warn("[DEBUG] Invalid email format.");
            Alert.alert("Invalid Email", "The email address is not valid.");
            break;
          case "auth/missing-email":
            console.warn("[DEBUG] Missing email.");
            Alert.alert("Missing Email", "Please enter your email address.");
            break;
          case "auth/network-request-failed":
            console.warn("[DEBUG] Network error occurred.");
            Alert.alert(
              "Network Error",
              "Please check your internet connection."
            );
            break;
          default:
            console.warn("[DEBUG] Unhandled error:", error.code);
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor={Colors.GRAY}
        onChangeText={(text) => {
          console.log("[DEBUG] Email input changed to:", text);
          setEmail(text);
        }}
        autoCapitalize="none"
      />
      <TouchableOpacity
        disabled={loading || !email}
        onPress={handleReset}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              { opacity: loading || !email ? 0.5 : 1 },
            ]}
          >
            Send Reset Link
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log("[DEBUG] Cancel button pressed, navigating back.");
          router.back();
        }}
        style={styles.cancel}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    padding: 25,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: Colors.WHITE,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 18,
    textAlign: "center",
  },
  cancel: {
    marginTop: 15,
  },
  cancelText: {
    color: Colors.PRIMARY,
    textAlign: "center",
  },
});
