import auth from "@react-native-firebase/auth";
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

            // Send token to backend here
            await sendTokenToBackend(token);

            return token;
        } else {
            console.warn("❌ Notification permission denied.");
            Alert.alert(
                "Permission Denied",
                "Enable notifications in settings."
            );
        }
    } catch (error) {
        console.error("❌ Failed to request notification permission:", error);
        Alert.alert("Error", "Failed to request notification permission.");
    }
}

async function sendTokenToBackend(token) {
    try {
        const user = auth().currentUser;
        if (!user?.email) {
            console.warn("⚠️ User not logged in, cannot send FCM token");
            return;
        }

        const response = await fetch(
            "https://chefu-academy-tmzx.onrender.com/api/save-fcm-token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    fcmToken: token,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.warn("⚠️ Failed to save FCM token on backend:", errorText);
        } else {
            console.log("✅ FCM token saved on backend successfully");
        }
    } catch (error) {
        console.error("❌ Error sending FCM token to backend:", error);
    }
}
