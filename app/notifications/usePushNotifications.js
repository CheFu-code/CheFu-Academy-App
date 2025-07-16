import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export async function requestUserPermission() {
  console.log("🔔 Requesting notification permissions...");

  try {
    const authStatus = await messaging().requestPermission();
    console.log("🔐 Permission status:", authStatus);

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("✅ Permission granted.");
      const token = await messaging().getToken();
      console.log("📲 FCM Token:", token);
      return token;
    } else {
      console.warn("❌ Notification permission was not granted.");
      Alert.alert(
        "Permission denied",
        "Notifications permission was not granted."
      );
    }
  } catch (error) {
    console.error(
      "🚨 Error while requesting permissions or fetching token:",
      error
    );
    Alert.alert(
      "Error",
      "Something went wrong while requesting notification permissions."
    );
  }
}
