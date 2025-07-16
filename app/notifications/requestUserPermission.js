// notifications/requestUserPermission.js
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export async function requestUserPermission() {
  console.log("🔔 Requesting notification permissions...");

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("✅ Notification permission granted.");
    const token = await messaging().getToken();
    console.log("📲 FCM Token:", token);
    return token;
  } else {
    console.warn("❌ Notification permission denied.");
    Alert.alert("Permission Denied", "Enable notifications in settings.");
  }
}
