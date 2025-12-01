// app/firebase-background-handler.ts
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    try {
        console.log("🔕 Background notification:", remoteMessage);

        // Extract notification and data
        const { notification, data } = remoteMessage;
        const title =
            notification?.title || data?.title || "Background Notification";
        const body = notification?.body || data?.body || "";

        await notifee.displayNotification({
            title,
            body,
            android: {
                channelId: "default",
                smallIcon: "ic_launcher",
                color: "#1a73e8",
                pressAction: {
                    id: "default",
                },
                sound: "default",
                importance: notifee.AndroidImportance.HIGH,
            },
            data: data || {},
        });
    } catch (e) {
        console.error("Error handling background notification:", e);
    }
});
