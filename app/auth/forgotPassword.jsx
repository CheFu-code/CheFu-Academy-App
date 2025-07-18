import auth from "@react-native-firebase/auth";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
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
import { Colors } from "../../constant/Colors";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    if (loading) return; // Prevent double submission
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert("Enter Email", "Please enter your email address.");
      return;
    }

    setLoading(true);

    auth()
      .sendPasswordResetEmail(cleanEmail)
      .then(() => {
        setLoading(false);
        Alert.alert(
          "Check Your Email",
          `Password reset link sent to ${cleanEmail}.`
        );
        router.back();
      })
      .catch((error) => {
        setLoading(false);
        Sentry.captureException(error);

        if (!error || !error.code) {
          Alert.alert("Error", "An unknown error occurred. Please try again.");
          return;
        }
        switch (error.code) {
          case "auth/user-not-found":
            Alert.alert("User Not Found", "No user found with this email.");
            break;
          case "auth/invalid-email":
            Alert.alert("Invalid Email", "The email address is not valid.");
            break;
          case "auth/missing-email":
            Alert.alert("Missing Email", "Please enter your email address.");
            break;
          case "auth/network-request-failed":
            Alert.alert(
              "Network Error",
              "Please check your internet connection."
            );
            break;
          default:
            Alert.alert("Error", error.message);
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
        disabled={loading || !email.trim()}
        onPress={handleReset}
        style={[styles.button, { opacity: loading || !email.trim() ? 0.5 : 1 }]}
      >
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
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
