import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import * as Sentry from "@sentry/react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";

export default function ChangePassword() {
  const user = auth().currentUser;
  // (No navigation button found in first 80 lines, skipping UI navigation patch)

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validatePasswordStrength = (password) => {
    const regex = /^.{6,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    if (loading) return; // Prevent double submission
    // Only trim on submit, not on every keystroke
    const curPwd = currentPassword.trim();
    const newPwd = newPassword.trim();
    const confPwd = confirmPassword.trim();

    if (!curPwd || !newPwd || !confPwd) {
      return ToastAndroid.show("All fields are required", ToastAndroid.SHORT);
    }

    if (newPwd !== confPwd) {
      return ToastAndroid.show("Passwords do not match", ToastAndroid.SHORT);
    }

    if (!validatePasswordStrength(newPwd)) {
      return ToastAndroid.show(
        "Password must be at least 6 characters",
        ToastAndroid.SHORT
      );
    }

    if (!user) {
      return ToastAndroid.show(
        "Session expired. Please sign in again.",
        ToastAndroid.SHORT
      );
    }

    setLoading(true);

    try {
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        curPwd
      );

      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPwd);

      ToastAndroid.show("Password updated!", ToastAndroid.SHORT);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back();
    } catch (err) {
      console.error(err);
      if (typeof Sentry !== 'undefined') Sentry.captureException(err);
      if (err?.code === "auth/invalid-credential") {
        ToastAndroid.show(
          "Incorrect password. Please try again.",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          err?.message?.toString() || "Something went wrong",
          ToastAndroid.SHORT
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, value, setter, field) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#aaa"
        secureTextEntry={!show[field]}
        value={value}
        onChangeText={setter}
      />
      <TouchableOpacity
        style={styles.eye}
        onPress={() => setShow((prev) => ({ ...prev, [field]: !prev[field] }))}
      >
        <Ionicons
          name={show[field] ? "eye-off" : "eye"}
          size={22}
          color="#aaa"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Change Password</Text>

        {renderInput(
          "Current Password",
          currentPassword,
          setCurrentPassword,
          "current"
        )}
        {renderInput("New Password", newPassword, setNewPassword, "new")}
        {renderInput(
          "Confirm New Password",
          confirmPassword,
          setConfirmPassword,
          "confirm"
        )}

        <TouchableOpacity
          style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BG_COLOR,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 15,
  },
  input: {
    backgroundColor: Colors.CARD,
    color: Colors.WHITE,
    borderRadius: 8,
    padding: 12,
    fontFamily: "outfit",
    paddingRight: 40,
    borderWidth: 0.9,
    borderColor: "#ccc",
  },
  eye: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
});
