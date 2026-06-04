import {
    AuthorizationStatus,
    getMessaging,
    getToken,
    requestPermission,
} from "@react-native-firebase/messaging";
import { chefuFetch } from "@/services/chefuApiClient";
import { Alert } from "react-native";

export async function requestUserPermission(userEmail) {
    try {
        const authStatus = await requestPermission(getMessaging());

        const enabled =
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            const token = await getToken(getMessaging());
            await sendTokenToBackend(token, userEmail);
            return token;
        }

        console.warn("Notification permission denied.");
        Alert.alert("Permission Denied", "Enable notifications in settings.");
    } catch (error) {
        console.error("Failed to request notification permission:", error);
        Alert.alert("Error", "Failed to request notification permission.");
    }
}

async function sendTokenToBackend(token, userEmail) {
    try {
        if (!userEmail) {
            console.warn("User not logged in, cannot send FCM token");
            return;
        }

        const response = await chefuFetch("/api/academy/mobile/notifications/fcm-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fcmToken: token,
                platform: "mobile",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn("Failed to save FCM token on backend:", errorText);
        } else {
            console.log("FCM token saved on backend successfully");
        }
    } catch (error) {
        console.error("Error sending FCM token to backend:", error);
    }
}
