// notifications/requestUserPermission.js
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission,
} from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export async function requestUserPermission() {

  try {
    const authStatus = await requestPermission(getMessaging());

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await getToken(getMessaging());
      console.log("📲 FCM Token:", token);
      return token;
    } else {
      console.warn("❌ Notification permission denied.");
      Alert.alert("Permission Denied", "Enable notifications in settings.");
    }
  } catch (error) {
    console.error("❌ Failed to request notification permission:", error);
    Alert.alert("Error", "Failed to request notification permission.");
  }
}
